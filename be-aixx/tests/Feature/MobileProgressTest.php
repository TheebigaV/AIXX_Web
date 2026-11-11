<?php

namespace Tests\Feature;

use App\Models\Student;
use App\Models\Training;
use App\Models\TrainingModule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class MobileProgressTest extends TestCase
{
    use RefreshDatabase;

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
        return [
            'Authorization' => 'Bearer ' . $student->createToken('mobile')->plainTextToken,
            'Accept' => 'application/json',
        ];
    }

    // Modules without CMS questions use 30 placeholder questions (ids moduleIndex*100 + 1..30) whose correct answer is B.
    protected function answers(int $percent, int $moduleIndex = 1): array
    {
        $correct = (int) round($percent * 30 / 100);
        $answers = [];
        for ($i = 1; $i <= 30; $i++) {
            $answers[(string) ($moduleIndex * 100 + $i)] = $i <= $correct ? 'B' : 'A';
        }
        return $answers;
    }

    public function test_me_includes_avatar_url_and_put_me_updates_profile(): void
    {
        $student = $this->makeStudent();
        $headers = $this->bearer($student);

        $this->getJson('/api/me', $headers)->assertOk()->assertJsonPath('profile.avatar_url', null);

        $this->putJson('/api/me', ['full_name' => 'Jane Smith', 'phone' => '+94770000000', 'country' => 'Sri Lanka'], $headers)
            ->assertOk()
            ->assertJsonPath('profile.full_name', 'Jane Smith')
            ->assertJsonPath('profile.phone', '+94770000000')
            ->assertJsonPath('profile.country', 'Sri Lanka');

        $this->putJson('/api/me', ['email' => 'hacker@example.com'], $headers)->assertOk();
        $this->assertNotSame('hacker@example.com', $student->fresh()->email);

        $this->putJson('/api/me', ['full_name' => ''], $headers)->assertStatus(422);
    }

    public function test_unauthenticated_requests_get_json_401(): void
    {
        $this->getJson('/api/me')->assertStatus(401)->assertJson(['message' => 'Unauthenticated.']);
        $this->getJson('/api/me/module-results')->assertStatus(401);
    }

    public function test_bearer_quiz_progress_is_pass_only_and_keeps_best_score(): void
    {
        $student = $this->makeStudent();
        $headers = $this->bearer($student);
        $url = '/api/courses/ai-foundation/modules/1/submit-quiz';

        // Fail: saved, but not completed
        $this->postJson($url, ['answers' => $this->answers(50)], $headers)
            ->assertOk()
            ->assertJson(['passed' => false, 'progress_saved' => true, 'is_completed' => false, 'best_score' => 50]);

        $this->getJson('/api/courses/ai-foundation/contents', $headers)
            ->assertJsonPath('course.completed_modules_count', 0)
            ->assertJsonPath('course.progress_percentage', 0)
            ->assertJsonPath('modules.0.is_completed', false);

        // Pass with 80
        $this->postJson($url, ['answers' => $this->answers(80)], $headers)
            ->assertJson(['passed' => true, 'is_completed' => true, 'best_score' => 80]);

        // Lower pass and a fail afterwards keep best score and completion
        $this->postJson($url, ['answers' => $this->answers(70)], $headers)->assertJson(['best_score' => 80]);
        $this->postJson($url, ['answers' => $this->answers(20)], $headers)
            ->assertJson(['passed' => false, 'is_completed' => true, 'best_score' => 80]);

        $this->getJson('/api/courses/ai-foundation/contents', $headers)
            ->assertJsonPath('course.completed_modules_count', 1)
            ->assertJsonPath('course.progress_percentage', 20)
            ->assertJsonPath('modules.0.is_completed', true)
            ->assertJsonPath('modules.0.score', 80);

        $this->getJson('/api/me/module-results', $headers)
            ->assertOk()
            ->assertJsonPath('count', 1)
            ->assertJsonPath('data.0.course_slug', 'ai-foundation')
            ->assertJsonPath('data.0.module_index', 1)
            ->assertJsonPath('data.0.module_title', 'Module 1: Foundations & Core Concepts')
            ->assertJsonPath('data.0.best_score', 80)
            ->assertJsonPath('data.0.last_score', 20)
            ->assertJsonPath('data.0.attempts', 4)
            ->assertJsonPath('data.0.passed', true);

        $this->getJson('/api/me/module-results?course=other-course', $headers)->assertJsonPath('count', 0);
    }

    public function test_module_results_titles_match_contents_for_cms_courses(): void
    {
        $course = Training::create(['name' => 'Real Course', 'slug' => 'real-course', 'type' => 'courses']);
        TrainingModule::create(['training_id' => $course->id, 'module_index' => 1, 'title' => 'Intro to Real', 'is_published' => true]);
        $student = $this->makeStudent([
            'enrolled_courses' => [[
                'course_id' => 'AIXX-real-course',
                'modules_progress' => [1 => ['score' => 90, 'passed' => true]],
            ]],
        ]);
        $headers = $this->bearer($student);

        $this->getJson('/api/courses/real-course/contents', $headers)->assertJsonPath('modules.0.title', 'Intro to Real');
        $this->getJson('/api/me/module-results', $headers)
            ->assertOk()
            ->assertJsonPath('data.0.module_title', 'Intro to Real');
    }

    public function test_x_student_token_header_still_works_without_registration_id(): void
    {
        $student = $this->makeStudent();
        $other = $this->makeStudent(['registration_id' => null]);

        $this->postJson('/api/courses/ai-foundation/modules/2/submit-quiz', ['answers' => $this->answers(90, 2)], [
            'X-Student-Token' => $student->uuid,
        ])->assertOk()->assertJson(['progress_saved' => true, 'is_completed' => true]);

        $this->getJson('/api/courses/ai-foundation/contents', ['X-Student-Token' => $student->uuid])
            ->assertJsonPath('course.completed_modules_count', 1);

        $this->assertNull($other->fresh()->enrolled_courses);
    }

    public function test_anonymous_submit_quiz_grades_without_saving(): void
    {
        $this->postJson('/api/courses/ai-foundation/modules/1/submit-quiz', ['answers' => $this->answers(90)])
            ->assertOk()
            ->assertJson(['passed' => true, 'progress_saved' => false, 'best_score' => null]);
    }

    public function test_placeholder_module_only_accepts_b_and_scores_over_all_30_questions(): void
    {
        $url = '/api/courses/ai-foundation/modules/2/submit-quiz';
        $cycling = [];
        foreach (range(1, 30) as $i) {
            $cycling[(string) (200 + $i)] = ['A', 'B', 'C', 'D'][($i - 1) % 4];
        }

        $this->postJson($url, ['answers' => $cycling])
            ->assertOk()
            ->assertJson(['correct_count' => 8, 'total_questions' => 30, 'score' => 27, 'passed' => false]);

        // One correct answer is 1/30, not 100%
        $this->postJson($url, ['answers' => ['201' => 'B']])
            ->assertJson(['correct_count' => 1, 'total_questions' => 30, 'score' => 3, 'passed' => false]);
    }

    public function test_cms_module_is_graded_against_its_own_questions_only(): void
    {
        $course = Training::create(['name' => 'Real Course', 'slug' => 'real-course', 'type' => 'courses']);
        $module = TrainingModule::create(['training_id' => $course->id, 'module_index' => 1, 'title' => 'Intro']);
        $q1 = $module->questions()->create(['question' => 'Q1', 'options' => ['a', 'b', 'c', 'd'], 'correct_answer' => 'C']);
        $q2 = $module->questions()->create(['question' => 'Q2', 'options' => ['a', 'b', 'c', 'd'], 'correct_answer' => 'A']);

        $other = TrainingModule::create(['training_id' => $course->id, 'module_index' => 2, 'title' => 'Other']);
        $foreign = $other->questions()->create(['question' => 'X', 'options' => ['a', 'b'], 'correct_answer' => 'B']);

        $url = '/api/courses/real-course/modules/1/submit-quiz';

        $this->postJson($url, ['answers' => [$q1->id => 'C', $q2->id => 'B', $foreign->id => 'B']])
            ->assertOk()
            ->assertJson(['correct_count' => 1, 'total_questions' => 2, 'score' => 50, 'passed' => false])
            ->assertJsonCount(2, 'results');

        // A plain list is matched to the module's questions by position
        $this->postJson($url, ['answers' => ['C', 'A']])
            ->assertJson(['correct_count' => 2, 'total_questions' => 2, 'score' => 100, 'passed' => true]);
    }

    public function test_completing_a_passed_assessment_twice_returns_the_stored_result(): void
    {
        $student = $this->makeStudent();
        $headers = $this->bearer($student);
        $training = Training::create(['name' => 'Cert Course', 'slug' => 'cert-course', 'type' => 'courses']);
        \App\Models\CertificateQuestion::create([
            'training_id' => $training->id,
            'question' => 'Pick a', 'options' => ['a', 'b'], 'correct_answer_index' => 0, 'is_active' => true,
        ]);

        $start = $this->postJson('/api/assessment/attempts', ['training_id' => $training->id], $headers)->assertCreated();
        $attemptId = $start->json('attempt_id');
        $question = $start->json('questions.0');
        $this->postJson("/api/assessment/attempts/{$attemptId}/answers", [
            'attempt_question_id' => $question['attempt_question_id'],
            'selected_option' => array_search('a', $question['options'], true),
        ], $headers)->assertOk();

        $first = $this->postJson("/api/assessment/attempts/{$attemptId}/complete", [], $headers)
            ->assertOk()
            ->assertJson(['score' => 100, 'passed' => true, 'already_completed' => false]);
        $this->assertStringStartsWith('http', $first->json('certificate.verify_url'));

        $this->postJson("/api/assessment/attempts/{$attemptId}/complete", [], $headers)
            ->assertOk()
            ->assertJson([
                'score' => 100,
                'passed' => true,
                'correct_count' => 1,
                'already_completed' => true,
                'certificate' => $first->json('certificate'),
                'aiks' => $first->json('aiks'),
                'question_breakdown' => $first->json('question_breakdown'),
            ]);
        $this->assertSame(1, $student->aiksSnapshots()->count());
    }
}
