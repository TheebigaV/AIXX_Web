<?php

namespace Tests\Feature;

use App\Models\Student;
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

    // Unknown question ids fall back to simulated grading: A-D correct, anything else wrong.
    protected function answers(int $correct, int $total = 10): array
    {
        $answers = [];
        for ($i = 0; $i < $total; $i++) {
            $answers["q{$i}"] = $i < $correct ? 'A' : 'Z';
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
        $this->postJson($url, ['answers' => $this->answers(5)], $headers)
            ->assertOk()
            ->assertJson(['passed' => false, 'progress_saved' => true, 'is_completed' => false, 'best_score' => 50]);

        $this->getJson('/api/courses/ai-foundation/contents', $headers)
            ->assertJsonPath('course.completed_modules_count', 0)
            ->assertJsonPath('course.progress_percentage', 0)
            ->assertJsonPath('modules.0.is_completed', false);

        // Pass with 80
        $this->postJson($url, ['answers' => $this->answers(8)], $headers)
            ->assertJson(['passed' => true, 'is_completed' => true, 'best_score' => 80]);

        // Lower pass and a fail afterwards keep best score and completion
        $this->postJson($url, ['answers' => $this->answers(7)], $headers)->assertJson(['best_score' => 80]);
        $this->postJson($url, ['answers' => $this->answers(2)], $headers)
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
            ->assertJsonPath('data.0.best_score', 80)
            ->assertJsonPath('data.0.last_score', 20)
            ->assertJsonPath('data.0.attempts', 4)
            ->assertJsonPath('data.0.passed', true);

        $this->getJson('/api/me/module-results?course=other-course', $headers)->assertJsonPath('count', 0);
    }

    public function test_x_student_token_header_still_works_without_registration_id(): void
    {
        $student = $this->makeStudent();
        $other = $this->makeStudent(['registration_id' => null]);

        $this->postJson('/api/courses/ai-foundation/modules/2/submit-quiz', ['answers' => $this->answers(9)], [
            'X-Student-Token' => $student->uuid,
        ])->assertOk()->assertJson(['progress_saved' => true, 'is_completed' => true]);

        $this->getJson('/api/courses/ai-foundation/contents', ['X-Student-Token' => $student->uuid])
            ->assertJsonPath('course.completed_modules_count', 1);

        $this->assertNull($other->fresh()->enrolled_courses);
    }

    public function test_anonymous_submit_quiz_grades_without_saving(): void
    {
        $this->postJson('/api/courses/ai-foundation/modules/1/submit-quiz', ['answers' => $this->answers(9)])
            ->assertOk()
            ->assertJson(['passed' => true, 'progress_saved' => false, 'best_score' => null]);
    }
}
