<?php

namespace Tests\Feature;

use App\Models\ModuleContent;
use App\Models\Training;
use App\Models\TrainingModule;
use Database\Seeders\AircraftLoadControlSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** curriculum:import-mcqs and curriculum:import-scenario-images against the seeded Load Control course. */
class CurriculumImportTest extends TestCase
{
    use RefreshDatabase;

    protected string $dir;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AircraftLoadControlSeeder::class);
        $this->dir = storage_path('framework/testing/curriculum-import-' . uniqid());
        File::makeDirectory($this->dir, 0755, true);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->dir);
        parent::tearDown();
    }

    protected function module(int $index): TrainingModule
    {
        return Training::where('slug', 'aircraft-load-control-level-1')->first()->modules()->where('module_index', $index)->first();
    }

    protected function csv(array $rows): string
    {
        $path = $this->dir . '/mcqs.csv';
        $handle = fopen($path, 'w');
        fwrite($handle, "\xEF\xBB\xBF");
        fputcsv($handle, ['course', 'module_number', 'question_number', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explanation', 'competency', 'image_url']);
        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }
        fclose($handle);

        return $path;
    }

    public function test_mcq_import_updates_questions_in_place(): void
    {
        $questions = $this->module(1)->questions()->orderBy('id')->get();
        $first = $questions[0];
        $second = $questions[1];
        $original = $first->correct_answer;
        $correctText = $first->options[ord($original) - ord('A')];
        $others = array_values(array_filter($first->options, fn ($o) => $o !== $correctText));
        $target = $original === 'C' ? 'D' : 'C';
        $reordered = $others;
        array_splice($reordered, ord($target) - ord('A'), 0, [$correctText]);
        $total = \App\Models\TrainingQuestion::count();

        $path = $this->csv([
            // Same question, options rebalanced so the right answer is now C
            ['Load Control', 1, 1, $first->question, ...array_merge($reordered, [$target, 'New explanation', 'New tag', ''])],
            // Text differs only by curly quotes and spacing: still the same question
            ['Load Control', 1, 2, '  ' . str_replace('Why', '“Why”', $second->question), ...array_merge($second->options, [$second->correct_answer, $second->explanation, $second->competency_tag, ''])],
            // Changed wording falls back to the question at the same position
            ['Load Control', 1, 3, 'Reworded question three?', 'w', 'x', 'y', 'z', 'D', '', '', ''],
        ]);

        $this->artisan('curriculum:import-mcqs', ['file' => $path, '--dry-run' => true])->assertSuccessful();
        $this->assertSame($original, $first->fresh()->correct_answer);

        $this->artisan('curriculum:import-mcqs', ['file' => $path])
            ->expectsOutputToContain('0 created, 3 updated, 0 unchanged')
            ->assertSuccessful();

        $first->refresh();
        $this->assertSame($target, $first->correct_answer);
        $this->assertSame($correctText, $first->options[ord($target) - ord('A')]);
        $this->assertSame('New tag', $first->competency_tag);
        $this->assertStringContainsString('“Why”', $second->fresh()->question);
        $this->assertSame('Reworded question three?', $questions[2]->fresh()->question);
        $this->assertSame($total, \App\Models\TrainingQuestion::count());

        // Re-running the seeder afterwards does not duplicate questions
        $this->seed(AircraftLoadControlSeeder::class);
        $this->assertSame($total, \App\Models\TrainingQuestion::count());
    }

    public function test_mcq_import_rejects_invalid_rows_without_saving(): void
    {
        $first = $this->module(1)->questions()->orderBy('id')->first();
        $original = $first->correct_answer;
        $path = $this->csv([
            ['Load Control', 1, 1, $first->question, 'a', 'b', 'c', 'd', $original === 'B' ? 'C' : 'B', '', '', ''],
            ['Load Control', 1, 2, 'Only two options', 'a', 'b', '', '', 'D', '', '', ''],
            ['Load Control', 99, 1, 'No such module', 'a', 'b', 'c', 'd', 'A', '', '', ''],
        ]);

        $this->artisan('curriculum:import-mcqs', ['file' => $path])
            ->expectsOutputToContain('Line 3: correct_answer')
            ->expectsOutputToContain('Line 4: module 99 does not exist')
            ->assertFailed();

        $this->assertSame($original, $first->fresh()->correct_answer);
    }

    public function test_the_provided_load_control_csv_imports_cleanly(): void
    {
        $csv = base_path('load-control-mcqs-and-images/mcqs.csv');
        if (!is_file($csv)) {
            $this->markTestSkipped('mcqs.csv is not present.');
        }

        $this->artisan('curriculum:import-mcqs', ['file' => $csv])->assertSuccessful();

        $answers = \App\Models\TrainingQuestion::whereIn('training_module_id', Training::where('slug', 'aircraft-load-control-level-1')->first()->modules()->pluck('id'))
            ->pluck('correct_answer')->countBy()->sortKeys()->all();
        $this->assertSame(['A' => 18, 'B' => 18, 'C' => 18, 'D' => 18], $answers);
    }

    public function test_scenario_images_are_attached_by_file_name(): void
    {
        Storage::fake('public');
        // 1x1 PNG, so the test does not need the GD extension
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        foreach (['module-01-figure-1.png', 'module-01-figure-2.png', 'module-02-figure-1.png', 'module-01-figure-9.png'] as $name) {
            file_put_contents("{$this->dir}/{$name}", $png);
        }
        file_put_contents($this->dir . '/notes.txt', 'ignored');

        $this->artisan('curriculum:import-scenario-images', ['dir' => $this->dir, '--dry-run' => true])->assertFailed();
        $this->assertNull(ModuleContent::where('training_module_id', $this->module(1)->id)->first()->scenarios[0]['image_url']);

        File::delete($this->dir . '/module-01-figure-9.png');
        $this->artisan('curriculum:import-scenario-images', ['dir' => $this->dir])
            ->expectsOutputToContain('Attached 3 image(s), 0 failed.')
            ->assertSuccessful();

        $scenarios = ModuleContent::where('training_module_id', $this->module(1)->id)->first()->scenarios;
        $this->assertStringContainsString('/storage/curriculum/scenarios/module-', $scenarios[0]['image_url']);
        Storage::disk('public')->assertExists($scenarios[0]['image_path']);
        Storage::disk('public')->assertExists($scenarios[1]['image_path']);

        // Re-running replaces the old file
        $old = $scenarios[0]['image_path'];
        $this->artisan('curriculum:import-scenario-images', ['dir' => $this->dir])->assertSuccessful();
        Storage::disk('public')->assertMissing($old);

        $this->getJson('/api/courses/aircraft-load-control-level-1/modules/1/scenarios')
            ->assertOk()
            ->assertJsonPath('data.scenarios.1.image_url', ModuleContent::where('training_module_id', $this->module(1)->id)->first()->scenarios[1]['image_url']);
    }
}
