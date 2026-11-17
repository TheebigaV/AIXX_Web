<?php

namespace Tests\Feature;

use App\Models\LearningPath;
use App\Models\Student;
use App\Models\Training;
use App\Models\TrainingModule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Tests\TestCase;

class MobileRoadmapTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow('2026-11-16 09:00:00'); // a Monday

        // "AI Engineer": course A (2 published CMS modules) then course B (default 5 modules) = 7 modules
        $a = Training::create(['name' => 'Python for AI', 'slug' => 'python-for-ai', 'type' => 'courses', 'is_active' => true]);
        TrainingModule::create(['training_id' => $a->id, 'module_index' => 1, 'title' => 'Python Basics', 'is_published' => true]);
        TrainingModule::create(['training_id' => $a->id, 'module_index' => 2, 'title' => 'NumPy & Pandas', 'is_published' => true]);
        TrainingModule::create(['training_id' => $a->id, 'module_index' => 3, 'title' => 'Draft', 'is_published' => false]);
        $b = Training::create(['name' => 'Machine Learning', 'slug' => 'machine-learning', 'type' => 'courses', 'is_active' => true]);

        $path = LearningPath::create(['name' => 'AI Engineer', 'description' => 'Build and deploy ML systems']);
        $path->trainings()->attach([$b->id => ['sort_order' => 2], $a->id => ['sort_order' => 1]]);

        LearningPath::create(['name' => 'Business Leader', 'description' => 'AI strategy for executives']);
        LearningPath::create(['name' => 'Hidden Engineer', 'is_active' => false]);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
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

    public function test_destinations_are_searchable_and_report_size(): void
    {
        $this->getJson('/api/roadmap/destinations')->assertOk()->assertJsonPath('count', 2);

        $this->getJson('/api/roadmap/destinations?q=engineer')
            ->assertOk()
            ->assertJsonPath('count', 1)
            ->assertJsonPath('data.0.name', 'AI Engineer')
            ->assertJsonPath('data.0.courses_count', 2)
            ->assertJsonPath('data.0.modules_count', 7)
            ->assertJsonPath('data.0.estimated_hours', 28);
    }

    public function test_store_builds_paced_roadmap_from_free_text_destination(): void
    {
        $headers = $this->bearer($this->makeStudent());

        $res = $this->postJson('/api/roadmap', ['destination' => 'ai engineer', 'hours_per_week' => 8], $headers)
            ->assertCreated()
            ->assertJsonPath('data.destination.name', 'AI Engineer')
            ->assertJsonPath('data.load.modules_per_week', 2)
            ->assertJsonPath('data.start_date', '2026-11-16')
            ->assertJsonPath('data.total_weeks', 4)
            ->assertJsonPath('data.estimated_completion_date', '2026-12-13')
            ->assertJsonPath('data.progress.total_modules', 7)
            ->assertJsonPath('data.next.course_slug', 'python-for-ai')
            ->assertJsonPath('data.next.title', 'Python Basics')
            // course order follows sort_order, not attach order
            ->assertJsonPath('data.steps.0.course.slug', 'python-for-ai')
            ->assertJsonPath('data.steps.0.status', 'in_progress')
            ->assertJsonPath('data.steps.0.modules.0.status', 'current')
            ->assertJsonPath('data.steps.1.course.slug', 'machine-learning')
            ->assertJsonPath('data.steps.1.total_modules', 5);

        $weeks = collect($res->json('data.steps'))->flatMap(fn ($s) => collect($s['modules'])->pluck('week'))->all();
        $this->assertSame([1, 1, 2, 2, 3, 3, 4], $weeks);
        $this->assertSame('2026-11-22', $res->json('data.steps.0.modules.0.due_date'));

        $this->getJson('/api/roadmap', $headers)->assertOk()->assertJsonPath('data.total_weeks', 4);
    }

    public function test_passed_modules_are_not_scheduled(): void
    {
        $student = $this->makeStudent(['enrolled_courses' => [[
            'course_id' => 'AIXX-python-for-ai',
            'modules_progress' => ['1' => ['passed' => true, 'score' => 90, 'best_score' => 90, 'completed_at' => '2026-11-10']],
        ]]]);

        $this->postJson('/api/roadmap', ['destination' => 'ai-engineer', 'hours_per_week' => 8], $this->bearer($student))
            ->assertCreated()
            ->assertJsonPath('data.steps.0.modules.0.status', 'completed')
            ->assertJsonPath('data.steps.0.modules.0.week', null)
            ->assertJsonPath('data.steps.0.modules.0.best_score', 90)
            ->assertJsonPath('data.steps.0.modules.1.status', 'current')
            ->assertJsonPath('data.steps.0.modules.1.week', 1)
            ->assertJsonPath('data.total_weeks', 3)
            ->assertJsonPath('data.progress.completed_modules', 1)
            ->assertJsonPath('data.progress.percent', 14);
    }

    public function test_load_change_replans_and_overdue_is_flagged(): void
    {
        $headers = $this->bearer($this->makeStudent());
        $this->postJson('/api/roadmap', ['destination' => 'AI Engineer', 'hours_per_week' => 8], $headers)->assertCreated();

        // Three weeks later with nothing done: weeks 1–3 (6 modules) are overdue
        Carbon::setTestNow('2026-12-07 09:00:00');
        $this->getJson('/api/roadmap', $headers)
            ->assertOk()
            ->assertJsonPath('data.progress.overdue_modules', 6)
            ->assertJsonPath('data.progress.on_track', false)
            ->assertJsonPath('data.steps.0.modules.0.status', 'overdue');

        // Lower the load to 4h/week: re-planned from today, one module per week
        $this->patchJson('/api/roadmap/load', ['hours_per_week' => 4], $headers)
            ->assertOk()
            ->assertJsonPath('data.start_date', '2026-12-07')
            ->assertJsonPath('data.total_weeks', 7)
            ->assertJsonPath('data.progress.on_track', true)
            ->assertJsonPath('data.estimated_completion_date', '2027-01-24');
    }

    public function test_errors_and_auth(): void
    {
        $headers = $this->bearer($this->makeStudent());

        $this->getJson('/api/roadmap', $headers)->assertNotFound();
        $this->patchJson('/api/roadmap/load', ['hours_per_week' => 5], $headers)->assertNotFound();

        $this->postJson('/api/roadmap', ['destination' => 'astronaut', 'hours_per_week' => 5], $headers)
            ->assertStatus(422)
            ->assertJsonCount(2, 'suggestions');
        $this->postJson('/api/roadmap', ['destination' => 'AI Engineer', 'hours_per_week' => 0], $headers)->assertStatus(422);

        $this->postJson('/api/roadmap', ['destination' => 'AI Engineer', 'hours_per_week' => 5], $headers)->assertCreated();
        $this->deleteJson('/api/roadmap', [], $headers)->assertOk();
        $this->getJson('/api/roadmap', $headers)->assertNotFound();
    }

    public function test_roadmap_requires_auth(): void
    {
        $this->getJson('/api/roadmap')->assertStatus(401);
        $this->patchJson('/api/roadmap/load', ['hours_per_week' => 5])->assertStatus(401);
        $this->postJson('/api/roadmap', ['destination' => 'AI Engineer', 'hours_per_week' => 5])->assertStatus(401);
    }
}
