<?php

namespace Tests\Feature;

use App\Models\CertificationAttemptItem;
use App\Models\Student;
use App\Models\Tenant;
use App\Models\Training;
use App\Models\User;
use Database\Seeders\AircraftLoadControlSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/** Admin APIs for assignments, curriculum content, blueprint and question quality. */
class AdminCurriculumTest extends TestCase
{
    use RefreshDatabase;

    protected const SLUG = 'aircraft-load-control-level-1';

    protected Training $training;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AircraftLoadControlSeeder::class);
        $this->training = Training::where('slug', self::SLUG)->firstOrFail();
    }

    protected function actingAsAdmin(): void
    {
        Sanctum::actingAs(User::factory()->create(), ['*'], 'sanctum');
    }

    protected function makeStudent(array $attrs = []): Student
    {
        return Student::create(array_merge([
            'uuid' => (string) Str::uuid(),
            'registration_id' => 'AIXX-ALM-' . random_int(1000, 9999),
            'full_name' => 'Learner ' . Str::random(4),
            'email' => Str::random(8) . '@example.com',
            'password' => bcrypt('secret123'),
        ], $attrs));
    }

    protected function bearer(Student $student): array
    {
        return ['Authorization' => 'Bearer ' . $student->createToken('mobile')->plainTextToken, 'Accept' => 'application/json'];
    }

    protected function module(int $index)
    {
        return $this->training->modules()->where('module_index', $index)->first();
    }

    protected function passModule(array $headers, int $index): void
    {
        $answers = $this->module($index)->questions->mapWithKeys(fn ($q) => [(string) $q->id => $q->correct_answer])->all();
        $this->postJson('/api/courses/' . self::SLUG . "/modules/{$index}/submit-quiz", ['answers' => $answers], $headers)->assertJsonPath('passed', true);
    }

    /** Run a full certification attempt answering every question correctly or wrongly. */
    protected function certify(array $headers, bool $correct): void
    {
        // Each call may use a different learner's token, so drop the user the guard cached from earlier requests
        $this->app['auth']->forgetGuards();

        // The assessment opens only once every module quiz is passed
        foreach ($this->training->modules()->pluck('module_index') as $index) {
            $this->passModule($headers, $index);
        }
        $this->postJson('/api/courses/' . self::SLUG . '/acknowledge', ['accepted' => true], $headers)->assertOk();
        $id = $this->postJson('/api/courses/' . self::SLUG . '/certification/attempts', [], $headers)->json('data.id');
        $answers = CertificationAttemptItem::where('certification_attempt_id', $id)->with('question')->get()->mapWithKeys(function ($i) use ($correct) {
            $right = array_search($i->question->correct_answer, $i->options_mapping, true);
            $wrong = collect(array_keys($i->options_mapping))->first(fn ($l) => $l !== $right);
            return [(string) $i->training_question_id => $correct ? $right : $wrong];
        })->all();
        $this->postJson("/api/certification/attempts/$id/answers", ['answers' => $answers], $headers)->assertOk();
        $this->postJson("/api/certification/attempts/$id/complete", [], $headers)->assertJsonPath('data.passed', $correct);
    }

    public function test_admin_routes_reject_students_and_guests(): void
    {
        $this->getJson('/api/admin/learning-assignments')->assertStatus(401);
        $this->getJson('/api/admin/learning-assignments', $this->bearer($this->makeStudent()))->assertStatus(401);
    }

    public function test_assignment_crud_and_manager_report(): void
    {
        $tenant = Tenant::create(['name' => 'SkyHandling', 'slug' => 'skyhandling']);
        $ramp1 = $this->makeStudent(['tenant_id' => $tenant->id, 'department' => 'Ramp', 'full_name' => 'Amal']);
        $this->makeStudent(['tenant_id' => $tenant->id, 'department' => 'Ramp', 'full_name' => 'Bala']);
        $this->makeStudent(['tenant_id' => $tenant->id, 'department' => 'Cargo']);
        $this->actingAsAdmin();

        $this->postJson('/api/admin/learning-assignments', ['tenant_id' => $tenant->id, 'title' => 'No course'])->assertStatus(422);

        $id = $this->postJson('/api/admin/learning-assignments', [
            'tenant_id' => $tenant->id,
            'department' => 'Ramp',
            'training_module_id' => $this->module(1)->id,
            'title' => 'Load control role briefing',
            'is_mandatory' => true,
            'requires_acknowledgement' => true,
            'version' => 'v1',
            'due_date' => now()->addWeek()->toDateString(),
            'recurrence_months' => 12,
            'prerequisites' => ['Airside induction'],
        ])->assertCreated()
            ->assertJsonPath('data.course.slug', self::SLUG) // course recorded from the module
            ->assertJsonPath('data.module.module_index', 1)
            ->json('data.id');

        $this->getJson("/api/admin/learning-assignments?tenant_id={$tenant->id}")->assertOk()->assertJsonPath('data.total', 1);

        $this->getJson("/api/admin/learning-assignments/$id/report")
            ->assertOk()
            ->assertJsonPath('data.summary.total_learners', 2)
            ->assertJsonPath('data.summary.pending', 2)
            ->assertJsonPath('data.summary.completion_rate', 0);

        // The learner sees it, completes the module and acknowledges
        $headers = $this->bearer($ramp1);
        $this->getJson('/api/me/assignments', $headers)->assertJsonPath('count', 1);
        $this->passModule($headers, 1);
        $this->postJson("/api/me/assignments/$id/acknowledge", ['accepted' => true], $headers)->assertOk();

        $this->getJson("/api/admin/learning-assignments/$id/report?status=completed")
            ->assertOk()
            ->assertJsonPath('data.summary.completed', 1)
            ->assertJsonPath('data.summary.completion_rate', 50)
            ->assertJsonPath('data.summary.acknowledged', 1)
            ->assertJsonCount(1, 'data.learners')
            ->assertJsonPath('data.learners.0.full_name', 'Amal');

        // A new version needs a fresh acknowledgement
        $this->putJson("/api/admin/learning-assignments/$id", ['version' => 'v2'])->assertOk()->assertJsonPath('data.version', 'v2');
        $this->getJson("/api/admin/learning-assignments/$id/report")->assertJsonPath('data.summary.acknowledged', 0);

        $this->deleteJson("/api/admin/learning-assignments/$id")->assertOk();
        $this->getJson("/api/admin/learning-assignments/$id")->assertNotFound();
    }

    public function test_blueprint_pass_mark_is_editable_and_used_by_mobile(): void
    {
        $this->actingAsAdmin();
        $id = $this->training->id;

        $this->getJson("/api/admin/trainings/$id/blueprint")
            ->assertOk()
            ->assertJsonPath('data.pass_mark', 70)
            ->assertJsonPath('data.max_possible_questions', 58)
            ->assertJsonPath('data.topics.0.pool_size', 6);

        $this->putJson("/api/admin/trainings/$id/blueprint", ['pass_mark' => 80])->assertOk()->assertJsonPath('data.pass_mark', 80);
        $this->getJson('/api/courses/' . self::SLUG . '/assessment/blueprint')->assertJsonPath('data.pass_mark', 80);

        $this->putJson("/api/admin/trainings/$id/blueprint", ['total_questions' => 5])->assertStatus(422); // minimums exceed total
        $this->putJson("/api/admin/trainings/$id/blueprint", ['topics' => [['module_index' => 1, 'topic' => 'x', 'min' => 3, 'max' => 2]]])->assertStatus(422);
        $this->putJson("/api/admin/trainings/$id/blueprint", ['pass_mark' => 101])->assertStatus(422);
    }

    public function test_module_content_translation_and_knowledge_checks(): void
    {
        $this->actingAsAdmin();
        $moduleId = $this->module(1)->id;

        $this->putJson("/api/admin/training-modules/$moduleId/content", [
            'lang' => 'ta',
            'study_time' => 'சுமார் 2 மணி நேரம்',
            'competency_area' => 'Role Awareness',
            'objectives' => ['Load control இன் நோக்கத்தை விளக்குக'],
            'cards' => [['heading' => 'Load control ஏன்?', 'body' => 'விளக்கம்'], ['body' => 'Boundary', 'type' => 'warning']],
            'terminology' => ['Load control'],
            'scenarios' => [['title' => 'காட்சி 1', 'description' => 'Process map']],
            'summary' => ['சுருக்கம்'],
            'knowledge_checks' => [
                ['question' => 'கேள்வி 1', 'suggested_answer' => 'பதில் 1'],
                ['question' => 'கேள்வி 2', 'suggested_answer' => 'பதில் 2'],
            ],
        ])->assertOk()->assertJsonCount(2, 'data.knowledge_checks')->assertJsonPath('data.content.lang', 'ta');

        $base = '/api/courses/' . self::SLUG . '/modules/1';
        $this->getJson("$base/lesson?lang=ta")->assertOk()->assertJsonPath('data.lang', 'ta')->assertJsonPath('data.cards.0.type', 'text')->assertJsonPath('data.knowledge_checks_count', 2);
        $this->getJson("$base/knowledge-checks?lang=ta")->assertJsonPath('data.total', 2);
        $this->getJson("$base/lesson")->assertJsonPath('data.lang', 'en')->assertJsonPath('data.knowledge_checks_count', 5);
        $this->assertContains('ta', collect($this->getJson('/api/languages')->json('data'))->pluck('code')->all());

        // Shortening the English list removes the extra check
        $checks = collect($this->getJson("/api/admin/training-modules/$moduleId/content")->json('data.knowledge_checks'))
            ->take(4)->map(fn ($c) => ['question' => $c['question'], 'suggested_answer' => $c['suggested_answer']])->all();
        $this->putJson("/api/admin/training-modules/$moduleId/content", ['knowledge_checks' => $checks])->assertOk()->assertJsonCount(4, 'data.knowledge_checks');

        $this->putJson("/api/admin/training-modules/$moduleId/content", ['cards' => [['type' => 'warning']]])->assertStatus(422);

        $this->putJson("/api/admin/trainings/{$this->training->id}/course-profile", ['lang' => 'ta', 'boundary_statement' => 'இது கல்வி நோக்கம் மட்டுமே'])->assertOk();
        $this->getJson('/api/courses/' . self::SLUG . '/curriculum?lang=ta')->assertJsonPath('data.lang', 'ta');
    }

    public function test_scenario_image_upload(): void
    {
        Storage::fake('public');
        $this->actingAsAdmin();
        $moduleId = $this->module(1)->id;
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');

        $url = $this->postJson("/api/admin/training-modules/$moduleId/scenarios/2/image", [
            'image' => UploadedFile::fake()->createWithContent('process-map.png', $png),
        ])->assertOk()->json('data.image_url');
        $this->assertNotNull($url);

        $scenario = $this->getJson('/api/courses/' . self::SLUG . '/modules/1/scenarios')->json('data.scenarios.1');
        $this->assertSame($url, $scenario['image_url']);
        $this->assertArrayNotHasKey('image_path', $scenario);
        $this->assertCount(1, Storage::disk('public')->allFiles("curriculum/scenarios/module-$moduleId"));

        // Replacing the image deletes the old file
        $this->postJson("/api/admin/training-modules/$moduleId/scenarios/2/image", ['image' => UploadedFile::fake()->createWithContent('v2.png', $png)])->assertOk();
        $this->assertCount(1, Storage::disk('public')->allFiles("curriculum/scenarios/module-$moduleId"));

        $this->postJson("/api/admin/training-modules/$moduleId/scenarios/9/image", ['image' => UploadedFile::fake()->createWithContent('x.png', $png)])->assertNotFound();
        $this->postJson("/api/admin/training-modules/$moduleId/scenarios/1/image", ['image' => UploadedFile::fake()->createWithContent('x.txt', 'hello')])->assertStatus(422);
    }

    public function test_feedback_review_and_question_analytics(): void
    {
        $strong = $this->bearer($this->makeStudent());
        $weak = $this->bearer($this->makeStudent());
        $qid = $this->module(1)->questions->first()->id;

        $this->postJson("/api/questions/$qid/feedback", ['type' => 'unclear_question', 'comment' => 'Ambiguous'], $strong)->assertCreated();
        $this->certify($strong, true);
        $this->certify($weak, false);

        $this->actingAsAdmin();
        $feedback = $this->getJson("/api/admin/question-feedback?status=open&training_id={$this->training->id}")
            ->assertOk()
            ->assertJsonPath('data.total', 1)
            ->assertJsonPath('data.data.0.question.id', $qid)
            ->assertJsonPath('data.data.0.question.module_index', 1);

        $analytics = $this->getJson("/api/admin/trainings/{$this->training->id}/question-analytics")
            ->assertOk()
            ->assertJsonPath('data.completed_attempts', 2)
            ->assertJsonPath('data.pass_rate', 50)
            ->assertJsonCount(72, 'data.questions')
            ->json('data');

        $usedByBoth = collect($analytics['questions'])->firstWhere('times_used', 2);
        $this->assertEquals(0.5, $usedByBoth['difficulty']);
        $this->assertEquals(1.0, $usedByBoth['discrimination']);
        $this->assertContains('open_feedback', collect($analytics['questions'])->firstWhere('question_id', $qid)['flags']);

        $this->patchJson("/api/admin/question-feedback/{$feedback->json('data.data.0.id')}", ['status' => 'resolved'])->assertOk()->assertJsonPath('data.status', 'resolved');
        $this->patchJson("/api/admin/question-feedback/{$feedback->json('data.data.0.id')}", ['status' => 'deleted'])->assertStatus(422);
        $this->getJson('/api/admin/question-feedback?status=open')->assertJsonPath('data.total', 0);
    }
}
