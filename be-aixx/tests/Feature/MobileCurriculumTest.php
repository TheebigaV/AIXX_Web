<?php

namespace Tests\Feature;

use App\Models\CertificationAttemptItem;
use App\Models\LearningAssignment;
use App\Models\Student;
use App\Models\Tenant;
use App\Models\Training;
use App\Models\TrainingQuestion;
use Database\Seeders\AircraftLoadControlSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * End-to-end tests for the curriculum APIs, run against the real
 * Level 1 Aircraft Load Control content seeded from the master curriculum.
 */
class MobileCurriculumTest extends TestCase
{
    use RefreshDatabase;

    protected const SLUG = 'aircraft-load-control-level-1';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AircraftLoadControlSeeder::class);
    }

    protected function makeStudent(array $attrs = []): Student
    {
        return Student::create(array_merge([
            'uuid' => (string) Str::uuid(),
            'registration_id' => 'AIXX-ALM-' . random_int(1000, 9999),
            'full_name' => 'Jane Doe',
            'email' => Str::random(8) . '@example.com',
            'password' => bcrypt('secret123'),
        ], $attrs));
    }

    protected function bearer(Student $student): array
    {
        return ['Authorization' => 'Bearer ' . $student->createToken('mobile')->plainTextToken, 'Accept' => 'application/json'];
    }

    /** Pass a module through the existing quiz endpoint using the real answer key. */
    protected function passModule(array $headers, int $moduleIndex): void
    {
        $module = Training::where('slug', self::SLUG)->first()->modules()->where('module_index', $moduleIndex)->first();
        $answers = $module->questions->mapWithKeys(fn ($q) => [(string) $q->id => $q->correct_answer])->all();

        $this->postJson("/api/courses/" . self::SLUG . "/modules/{$moduleIndex}/submit-quiz", ['answers' => $answers], $headers)
            ->assertOk()
            ->assertJsonPath('passed', true);
    }

    public function test_seeder_loads_the_full_curriculum_and_is_idempotent(): void
    {
        $this->seed(AircraftLoadControlSeeder::class);

        $training = Training::where('slug', self::SLUG)->firstOrFail();
        $this->assertSame(12, $training->modules()->where('is_published', true)->count());
        $this->assertSame(72, TrainingQuestion::whereHas('module', fn ($q) => $q->where('training_id', $training->id))->count());
        $this->assertSame(1, Training::where('slug', self::SLUG)->count());
    }

    public function test_curriculum_lesson_and_reference_content(): void
    {
        $base = '/api/courses/' . self::SLUG;

        $this->getJson("$base/curriculum")
            ->assertOk()
            ->assertJsonCount(12, 'data.modules')
            ->assertJsonCount(10, 'data.outcomes')
            ->assertJsonCount(10, 'data.competency_areas')
            ->assertJsonPath('data.pathway.level', 1)
            ->assertJsonPath('data.modules.0.title', 'The Load Control Role and the Airport/Airline Ecosystem')
            ->assertJsonPath('data.acknowledgement.acknowledged', false);

        $lesson = $this->getJson("$base/modules/1/lesson")
            ->assertOk()
            ->assertJsonPath('data.competency_area', 'Role Awareness')
            ->assertJsonPath('data.cards.0.heading', 'Why load control exists')
            ->assertJsonCount(5, 'data.objectives')
            ->assertJsonCount(9, 'data.terminology')
            ->assertJsonCount(2, 'data.scenarios')
            ->assertJsonPath('data.knowledge_checks_count', 5)
            ->assertJsonPath('data.steps', null) // guest
            ->assertJsonPath('data.previous_module', null)
            ->assertJsonPath('data.next_module', 2);
        $this->assertSame('warning', collect($lesson->json('data.cards'))->last()['type']);

        $this->getJson("$base/modules/12/lesson")->assertOk()->assertJsonPath('data.next_module', null);
        $this->getJson("$base/modules/13/lesson")->assertNotFound();
        $this->getJson('/api/courses/unknown-course/modules/1/lesson')->assertNotFound();

        $this->getJson("$base/modules/3/terminology")->assertOk()->assertJsonCount(12, 'data.terms');
        $this->getJson("$base/modules/1/scenarios")->assertOk()->assertJsonPath('data.scenarios.0.title', 'Scenario 1');
        $this->getJson("$base/modules/1/summary")->assertOk()->assertJsonPath('data.summary.0', 'Aircraft do not depart safely simply because all passengers and bags have arrived.');

        $glossary = $this->getJson("$base/glossary")->assertOk();
        $this->assertGreaterThan(80, $glossary->json('count'));
        $this->assertContains(1, collect($glossary->json('data'))->firstWhere('term', 'Load control')['modules']);

        // ?lang falls back to English when no translation exists
        $this->getJson("$base/modules/1/lesson?lang=ta")->assertOk()->assertJsonPath('data.lang', 'en');
        $this->getJson('/api/languages')->assertOk()->assertJsonPath('data.0.code', 'en');
    }

    public function test_knowledge_checks_and_lesson_steps(): void
    {
        $headers = $this->bearer($this->makeStudent());
        $base = '/api/courses/' . self::SLUG . '/modules/1';

        $checks = $this->getJson("$base/knowledge-checks", $headers)
            ->assertOk()
            ->assertJsonPath('data.total', 5)
            ->assertJsonPath('data.checks.0.suggested_answer', null) // hidden before answering
            ->json('data.checks');

        $this->postJson("$base/steps/learn/complete", [], $headers)->assertOk()->assertJsonPath('data.next_step', 'check');
        $this->postJson("$base/steps/check/complete", [], $headers)->assertStatus(422);
        $this->postJson("$base/steps/assess/complete", [], $headers)->assertStatus(422);
        $this->postJson("$base/steps/dance/complete", [], $headers)->assertStatus(422);

        $this->postJson("$base/knowledge-checks/{$checks[0]['id']}/answer", ['answer' => 'Many teams supply the load picture'], $headers)
            ->assertOk()
            ->assertJsonPath('data.answered_count', 1)
            ->assertJsonPath('data.all_answered', false)
            ->assertJsonPath('data.suggested_answer', 'Because the final load picture is built from information generated across passenger, baggage, cargo, ramp and operations activities.');

        foreach (array_slice($checks, 1) as $c) {
            $this->postJson("$base/knowledge-checks/{$c['id']}/answer", ['answer' => 'My answer'], $headers)->assertOk();
        }
        $this->getJson("$base/knowledge-checks", $headers)->assertJsonPath('data.answered_count', 5)->assertJsonPath('data.checks.0.your_answer', 'Many teams supply the load picture');

        // A check from another module is rejected
        $otherModuleCheck = $this->getJson('/api/courses/' . self::SLUG . '/modules/2/knowledge-checks')->json('data.checks.0.id');
        $this->postJson("$base/knowledge-checks/{$otherModuleCheck}/answer", ['answer' => 'x'], $headers)->assertNotFound();

        foreach (['check', 'scenario', 'review'] as $step) {
            $this->postJson("$base/steps/$step/complete", [], $headers)->assertOk();
        }
        $this->getJson("$base/lesson", $headers)->assertJsonPath('data.steps.next_step', 'assess')->assertJsonPath('data.steps.module_completed', false);

        // Existing quiz endpoint now carries competency tags; passing it completes "assess"
        $this->getJson('/api/courses/' . self::SLUG . '/modules/1')
            ->assertOk()
            ->assertJsonPath('total_questions', 6)
            ->assertJsonPath('questions.0.competency_tag', 'Role awareness / safety purpose');
        $this->passModule($headers, 1);
        $this->getJson("$base/lesson", $headers)->assertJsonPath('data.steps.module_completed', true)->assertJsonPath('data.steps.next_step', null);

        $this->app['auth']->forgetGuards();
        $this->postJson("$base/steps/learn/complete")->assertStatus(401);
        $this->postJson("$base/knowledge-checks/{$checks[0]['id']}/answer", ['answer' => 'x'])->assertStatus(401);
    }

    /** Displayed letter for every item of an attempt: the correct one, or a wrong one. */
    protected function attemptAnswers(int $attemptId, bool $correct): array
    {
        return CertificationAttemptItem::where('certification_attempt_id', $attemptId)->with('question')->get()
            ->mapWithKeys(function ($i) use ($correct) {
                $right = $i->question->correct_answer;
                $letter = $correct
                    ? array_search($right, $i->options_mapping, true)
                    : collect($i->options_mapping)->search(fn ($original) => $original !== $right);
                return [(string) $i->training_question_id => $letter];
            })->all();
    }

    public function test_certification_flow_issues_certificate_and_retry_draws_new_questions(): void
    {
        $student = $this->makeStudent();
        $headers = $this->bearer($student);
        $slug = self::SLUG;

        $this->getJson("/api/courses/$slug/assessment/blueprint")
            ->assertOk()
            ->assertJsonPath('data.total_questions', 50)
            ->assertJsonPath('data.pass_mark', 70)
            ->assertJsonCount(11, 'data.topics')
            ->assertJsonPath('data.eligibility', null);

        $this->postJson("/api/courses/$slug/certification/attempts", [], $headers)
            ->assertStatus(403)
            ->assertJsonPath('code', 'acknowledgement_required');

        $this->postJson("/api/courses/$slug/acknowledge", [], $headers)->assertStatus(422);
        $this->postJson("/api/courses/$slug/acknowledge", ['accepted' => true], $headers)->assertOk();
        $this->getJson("/api/courses/$slug/curriculum", $headers)->assertJsonPath('data.acknowledgement.acknowledged', true);

        // Every module quiz must be passed first
        $this->passModule($headers, 1);
        $this->postJson("/api/courses/$slug/certification/attempts", [], $headers)
            ->assertStatus(403)
            ->assertJsonPath('code', 'modules_incomplete')
            ->assertJsonPath('modules_completed', 1)
            ->assertJsonPath('modules_total', 12);
        $this->getJson("/api/courses/$slug/assessment/blueprint", $headers)
            ->assertJsonPath('data.eligibility.can_start', false)
            ->assertJsonPath('data.eligibility.blocked_reason', 'modules_incomplete');

        foreach (range(2, 12) as $i) {
            $this->passModule($headers, $i);
        }
        $this->getJson("/api/courses/$slug/assessment/blueprint", $headers)
            ->assertJsonPath('data.eligibility.can_start', true)
            ->assertJsonPath('data.eligibility.blocked_reason', null);

        $start = $this->postJson("/api/courses/$slug/certification/attempts", [], $headers)
            ->assertCreated()
            ->assertJsonPath('data.total_questions', 50)
            ->assertJsonCount(50, 'data.questions');
        $attemptId = $start->json('data.id');
        $this->assertArrayNotHasKey('correct_option', $start->json('data.questions.0'));

        // Topic balance stays within the blueprint's min/max
        $perModule = CertificationAttemptItem::where('certification_attempt_id', $attemptId)->with('question.module')->get()
            ->countBy(fn ($i) => $i->question->module->module_index);
        $blueprint = collect($this->getJson("/api/courses/$slug/assessment/blueprint")->json('data.topics'));
        foreach ($blueprint as $t) {
            $this->assertGreaterThanOrEqual($t['min'], $perModule[$t['module_index']] ?? 0);
            $this->assertLessThanOrEqual($t['max'], $perModule[$t['module_index']] ?? 0);
        }
        $this->assertArrayNotHasKey(12, $perModule->all()); // capstone is not in the blueprint

        // Starting again resumes the open attempt
        $this->postJson("/api/courses/$slug/certification/attempts", [], $headers)->assertOk()->assertJsonPath('resumed', true)->assertJsonPath('data.id', $attemptId);

        // First attempt fails: 40 wrong answers, and the 10 unanswered questions also count as wrong
        $wrong = $this->attemptAnswers($attemptId, false);
        $this->postJson("/api/certification/attempts/$attemptId/answers", ['answers' => array_slice($wrong, 0, 40, true) + ['999999' => 'A']], $headers)
            ->assertOk()
            ->assertJsonPath('data.answered_count', 40)
            ->assertJsonPath('data.ignored_question_ids', [999999]);
        $this->postJson("/api/certification/attempts/$attemptId/complete", [], $headers)
            ->assertOk()
            ->assertJsonPath('data.score', 0)
            ->assertJsonPath('data.passed', false)
            ->assertJsonPath('data.certificate', null);

        // A retry uses every question left unseen by the first attempt (66-question pool, 50 used)
        $retry = $this->postJson("/api/courses/$slug/certification/attempts", [], $headers)->assertCreated();
        $retryId = $retry->json('data.id');
        $firstIds = collect(array_keys($wrong))->map(fn ($id) => (int) $id);
        $this->assertCount(16, collect($retry->json('data.questions'))->pluck('question_id')->diff($firstIds));

        // The retry passes and issues a certificate
        $answers = $this->attemptAnswers($retryId, true);
        $this->postJson("/api/certification/attempts/$retryId/answers", ['answers' => $answers], $headers)->assertOk()->assertJsonPath('data.answered_count', 50);
        $result = $this->postJson("/api/certification/attempts/$retryId/complete", [], $headers)
            ->assertOk()
            ->assertJsonPath('already_completed', false)
            ->assertJsonPath('data.score', 100)
            ->assertJsonPath('data.passed', true)
            ->assertJsonCount(11, 'data.topic_results');
        $token = $result->json('data.certificate.certificate_token');
        $this->assertNotNull($token);
        $this->assertNotNull($result->json('data.questions.0.explanation'));

        $this->postJson("/api/certification/attempts/$retryId/complete", [], $headers)->assertOk()->assertJsonPath('already_completed', true)->assertJsonPath('data.certificate.certificate_token', $token);
        $this->postJson("/api/certification/attempts/$retryId/answers", ['answers' => [array_key_first($answers) => 'A']], $headers)->assertStatus(409);

        // Certificate shows up in the existing certificate APIs
        $this->getJson('/api/certificate', $headers)->assertOk()->assertJsonPath('count', 1);
        $this->getJson("/api/certificate/verify/$token")->assertOk();

        // Once certified, the assessment cannot be started again
        $this->postJson("/api/courses/$slug/certification/attempts", [], $headers)
            ->assertStatus(409)
            ->assertJsonPath('code', 'already_certified')
            ->assertJsonPath('attempt_id', $retryId);
        $this->getJson("/api/courses/$slug/assessment/blueprint", $headers)->assertJsonPath('data.eligibility.blocked_reason', 'already_certified');

        $this->getJson('/api/certification/attempts', $headers)->assertOk()->assertJsonPath('count', 2);
        $this->getJson("/api/certification/attempts/$attemptId", $headers)->assertOk()->assertJsonPath('data.status', 'completed');

        // Attempts are private to their owner
        $this->app['auth']->forgetGuards();
        $this->getJson("/api/certification/attempts/$attemptId", $this->bearer($this->makeStudent()))->assertNotFound();
    }

    public function test_competency_profile_next_steps_badges_and_passport(): void
    {
        $student = $this->makeStudent();
        $headers = $this->bearer($student);

        // Nothing started: suggest Level 1
        $this->getJson('/api/me/next-steps', $headers)->assertOk()->assertJsonPath('data.0.type', 'start_course')->assertJsonPath('data.0.course.slug', self::SLUG);

        $this->passModule($headers, 1);

        $profile = $this->getJson('/api/me/competency-profile', $headers)->assertOk()->assertJsonPath('count', 1)->json('data.0');
        $areas = collect($profile['areas'])->keyBy('area');
        $this->assertSame(100, $areas['Role Awareness']['score']);
        $this->assertSame('strength', $areas['Role Awareness']['status']);
        $this->assertSame('not_assessed', $areas['Terminology']['status']);
        $this->assertSame(['Role Awareness'], $profile['strengths']);

        $this->getJson('/api/me/next-steps', $headers)->assertOk()->assertJsonPath('data.0.type', 'continue_module')->assertJsonPath('data.0.module_index', 2);
        $this->getJson('/api/me/competency-profile?course=nope', $headers)->assertNotFound();

        // Fail module 2 so its area shows as a development need with a revise step
        $module2 = Training::where('slug', self::SLUG)->first()->modules()->where('module_index', 2)->first();
        $wrong = $module2->questions->mapWithKeys(fn ($q) => [(string) $q->id => $q->correct_answer === 'A' ? 'B' : 'A'])->all();
        $this->postJson('/api/courses/' . self::SLUG . '/modules/2/submit-quiz', ['answers' => $wrong], $headers)->assertOk();
        $this->getJson('/api/me/next-steps', $headers)->assertJsonFragment(['type' => 'revise', 'competency_area' => 'Mass & Balance Concepts']);

        // Complete every module, then certify
        foreach (range(2, 12) as $i) {
            $this->passModule($headers, $i);
        }
        $this->getJson('/api/me/next-steps', $headers)->assertJsonPath('data.0.type', 'certification');
        $this->getJson('/api/me/badges', $headers)->assertJsonPath('count', 1);

        $this->postJson('/api/courses/' . self::SLUG . '/acknowledge', ['accepted' => true], $headers)->assertOk();
        $attemptId = $this->postJson('/api/courses/' . self::SLUG . '/certification/attempts', [], $headers)->json('data.id');
        $answers = CertificationAttemptItem::where('certification_attempt_id', $attemptId)->with('question')->get()
            ->mapWithKeys(fn ($i) => [(string) $i->training_question_id => array_search($i->question->correct_answer, $i->options_mapping, true)])->all();
        $this->postJson("/api/certification/attempts/$attemptId/answers", ['answers' => $answers], $headers)->assertOk();
        $this->postJson("/api/certification/attempts/$attemptId/complete", [], $headers)->assertJsonPath('data.passed', true);

        $this->getJson('/api/me/next-steps', $headers)->assertJsonPath('data.0.type', 'next_level_coming_soon')->assertJsonPath('data.0.title', 'Next: Intermediate Certificate');
        $this->getJson('/api/me/badges', $headers)->assertJsonPath('count', 2)->assertJsonPath('data.1.name', 'Level 1 - Foundation Certificate Complete');

        $this->getJson('/api/me/career-passport', $headers)
            ->assertOk()
            ->assertJsonPath('data.pathways.0.levels.0.status', 'certified')
            ->assertJsonPath('data.pathways.0.levels.1.status', 'coming_soon')
            ->assertJsonCount(12, 'data.completed_modules')
            ->assertJsonCount(1, 'data.assessment_history')
            ->assertJsonCount(1, 'data.certificates')
            ->assertJsonCount(2, 'data.badges');

        // The roadmap API can target the new pathway by free text
        $this->postJson('/api/roadmap', ['destination' => 'load control', 'hours_per_week' => 6], $headers)
            ->assertCreated()
            ->assertJsonPath('data.destination.slug', 'aircraft-load-control')
            ->assertJsonPath('data.progress.percent', 100);
    }

    public function test_question_feedback(): void
    {
        $headers = $this->bearer($this->makeStudent());
        $qid = TrainingQuestion::first()->id;

        $this->postJson("/api/questions/$qid/feedback", ['type' => 'unclear_question', 'comment' => 'Option C is ambiguous'], $headers)
            ->assertCreated()
            ->assertJsonPath('data.status', 'open');
        $this->postJson("/api/questions/$qid/feedback", ['type' => 'spam'], $headers)->assertStatus(422);
        $this->postJson('/api/questions/999999/feedback', ['type' => 'typo'], $headers)->assertNotFound();
    }

    public function test_enterprise_assignments_are_tenant_isolated(): void
    {
        $tenant = Tenant::create(['name' => 'SkyHandling', 'slug' => 'skyhandling']);
        $other = Tenant::create(['name' => 'Other Air', 'slug' => 'other-air']);
        $student = $this->makeStudent(['tenant_id' => $tenant->id, 'department' => 'Ramp']);
        $headers = $this->bearer($student);
        $training = Training::where('slug', self::SLUG)->first();
        $module1 = $training->modules()->where('module_index', 1)->first();

        $moduleTask = LearningAssignment::create([
            'tenant_id' => $tenant->id, 'training_module_id' => $module1->id, 'title' => 'Load control role briefing',
            'is_mandatory' => true, 'requires_acknowledgement' => true, 'version' => 'v2', 'due_date' => now()->addDays(10),
            'recurrence_months' => 12, 'source_document_ref' => 'GOM 4.2',
        ]);
        LearningAssignment::create(['tenant_id' => $tenant->id, 'department' => 'Ramp', 'training_id' => $training->id, 'title' => 'Level 1 for ramp', 'due_date' => now()->subDay()]);
        LearningAssignment::create(['tenant_id' => $tenant->id, 'department' => 'Cargo', 'training_id' => $training->id, 'title' => 'Cargo only']);
        LearningAssignment::create(['tenant_id' => $other->id, 'training_id' => $training->id, 'title' => 'Other tenant']);

        $list = $this->getJson('/api/me/assignments', $headers)
            ->assertOk()
            ->assertJsonPath('count', 2)
            ->assertJsonPath('summary.overdue', 1)
            ->assertJsonPath('summary.pending_acknowledgement', 1);
        $this->assertEqualsCanonicalizing(['Load control role briefing', 'Level 1 for ramp'], collect($list->json('data'))->pluck('title')->all());

        $this->passModule($headers, 1);
        $this->postJson("/api/me/assignments/{$moduleTask->id}/acknowledge", ['accepted' => true], $headers)
            ->assertOk()
            ->assertJsonPath('data.status', 'completed')
            ->assertJsonPath('data.acknowledgement.acknowledged', true);

        // Recurrent training expires after the cycle
        $this->travel(13)->months();
        $this->getJson('/api/me/assignments', $headers)->assertJsonPath('summary.expired', 1);

        $hidden = LearningAssignment::where('title', 'Other tenant')->first();
        $this->postJson("/api/me/assignments/{$hidden->id}/acknowledge", ['accepted' => true], $headers)->assertNotFound();

        $this->app['auth']->forgetGuards(); // the guard caches the previous user within one test
        $this->getJson('/api/me/assignments', $this->bearer($this->makeStudent()))->assertOk()->assertJsonPath('count', 0);
    }
}
