<?php

namespace App\Console\Commands;

use App\Models\CertificationAttemptItem;
use App\Models\TrainingQuestion;
use App\Services\LearnerProgressService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Loads a course's MCQ bank from CSV. Each row updates the matching question in
 * place (same module, same text ignoring quote style, case and spacing; otherwise
 * the same position in the module), so question ids and learner history are kept.
 * Rows that match nothing are added. Questions missing from the CSV are reported, not deleted.
 *
 * Columns: module_number, question_number, question_text, option_a..option_d
 * (option_e/option_f optional), correct_answer, explanation, competency.
 */
class ImportCurriculumMcqs extends Command
{
    protected $signature = 'curriculum:import-mcqs
        {file : Path to the CSV file}
        {--course=aircraft-load-control-level-1 : Course slug}
        {--dry-run : Validate and show what would change without saving}';

    protected $description = 'Create or update a course\'s MCQ bank from a CSV file';

    protected const REQUIRED = ['module_number', 'question_number', 'question_text', 'option_a', 'option_b', 'correct_answer'];

    protected const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];

    public function handle(LearnerProgressService $progress): int
    {
        $training = $progress->findCourse((string) $this->option('course'));
        if (!$training) {
            $this->error("Course '{$this->option('course')}' not found.");
            return self::FAILURE;
        }

        try {
            $rows = $this->readRows((string) $this->argument('file'));
        } catch (\RuntimeException $e) {
            $this->error($e->getMessage());
            return self::FAILURE;
        }

        $modules = $training->modules()->with(['questions' => fn ($q) => $q->orderBy('id')])->get()->keyBy('module_index');
        $errors = [];
        $plan = [];
        $claimed = [];

        foreach ($rows as $line => $row) {
            $module = $modules->get((int) $row['module_number']);
            if (!$module) {
                $errors[] = "Line {$line}: module {$row['module_number']} does not exist in this course.";
                continue;
            }

            $options = collect(self::LETTERS)->map(fn ($l) => trim((string) ($row["option_{$l}"] ?? '')))->filter(fn ($o) => $o !== '')->values()->all();
            $correct = strtoupper(trim($row['correct_answer']));
            if (count($options) < 2) {
                $errors[] = "Line {$line}: at least two options are required.";
                continue;
            }
            $correctIndex = array_search(strtolower($correct), self::LETTERS, true);
            if ($correctIndex === false || $correctIndex >= count($options)) {
                $errors[] = "Line {$line}: correct_answer '{$row['correct_answer']}' does not point to a filled option.";
                continue;
            }

            $text = $this->normalize($row['question_text']);
            $existing = $module->questions->first(fn ($q) => !isset($claimed[$q->id]) && $this->normalize($q->question) === $text);
            if ($existing) {
                $claimed[$existing->id] = true;
            }

            $plan[] = [
                'line' => $line,
                'position' => (int) $row['question_number'],
                'module' => $module,
                'question' => $existing,
                'values' => [
                    'question' => trim($row['question_text']),
                    'options' => $options,
                    'correct_answer' => $correct,
                    'explanation' => trim((string) ($row['explanation'] ?? '')) ?: null,
                    'competency_tag' => trim((string) ($row['competency'] ?? $row['competency_tag'] ?? '')) ?: null,
                ],
            ];
        }

        if ($errors) {
            foreach ($errors as $e) {
                $this->error($e);
            }
            $this->error('Nothing was imported.');
            return self::FAILURE;
        }

        // Rows whose text changed fall back to the question at the same position, once all exact matches are taken.
        foreach ($plan as $i => $p) {
            $candidate = $p['question'] ? null : ($p['position'] > 0 ? $p['module']->questions->values()->get($p['position'] - 1) : null);
            if ($candidate && !isset($claimed[$candidate->id])) {
                $plan[$i]['question'] = $candidate;
                $claimed[$candidate->id] = true;
            }
        }

        $counts = ['created' => 0, 'updated' => 0, 'unchanged' => 0];
        $reordered = [];
        foreach ($plan as $p) {
            $q = $p['question'];
            if (!$q) {
                $counts['created']++;
                continue;
            }
            $changed = collect($p['values'])->filter(fn ($v, $k) => $q->{$k} !== $v)->keys();
            $counts[$changed->isEmpty() ? 'unchanged' : 'updated']++;
            if ($changed->intersect(['options', 'correct_answer'])->isNotEmpty()) {
                $reordered[] = $q->id;
            }
        }

        $missing = $modules->flatMap(fn ($m) => $m->questions)->reject(fn ($q) => isset($claimed[$q->id]));
        $affected = $reordered ? CertificationAttemptItem::whereIn('training_question_id', $reordered)->distinct()->count('certification_attempt_id') : 0;

        $this->table(['Rows', 'Created', 'Updated', 'Unchanged', 'Not in CSV'], [[count($plan), $counts['created'], $counts['updated'], $counts['unchanged'], $missing->count()]]);
        foreach ($missing as $q) {
            $this->warn("Not in CSV (kept): question #{$q->id} in module {$modules->firstWhere('id', $q->training_module_id)?->module_index}");
        }
        if ($affected) {
            $this->warn("{$affected} existing certification attempt(s) include questions whose options changed; their stored answer letters now refer to the new option order.");
        }

        if ($this->option('dry-run')) {
            $this->info('Dry run: nothing saved.');
            return self::SUCCESS;
        }

        DB::transaction(function () use ($plan) {
            foreach ($plan as $p) {
                $p['question']
                    ? $p['question']->update($p['values'])
                    : TrainingQuestion::create($p['values'] + ['training_module_id' => $p['module']->id]);
            }
        });

        $this->info("Imported {$training->name}: {$counts['created']} created, {$counts['updated']} updated, {$counts['unchanged']} unchanged.");

        return self::SUCCESS;
    }

    /** @return array<int, array<string, string>> Rows keyed by CSV line number. */
    protected function readRows(string $file): array
    {
        if (!is_file($file) || !($handle = fopen($file, 'r'))) {
            throw new \RuntimeException("Cannot read {$file}.");
        }

        $header = fgetcsv($handle);
        if (!$header) {
            throw new \RuntimeException('The CSV file is empty.');
        }
        $header = array_map(fn ($h) => strtolower(trim(preg_replace('/^\xEF\xBB\xBF/', '', (string) $h))), $header);
        $missing = array_diff(self::REQUIRED, $header);
        if ($missing) {
            throw new \RuntimeException('Missing CSV column(s): ' . implode(', ', $missing) . '.');
        }

        $rows = [];
        $line = 1;
        while (($cells = fgetcsv($handle)) !== false) {
            $line++;
            if (count(array_filter($cells, fn ($c) => trim((string) $c) !== '')) === 0) {
                continue;
            }
            $rows[$line] = array_combine($header, array_pad(array_slice($cells, 0, count($header)), count($header), ''));
        }
        fclose($handle);

        if (!$rows) {
            throw new \RuntimeException('The CSV file has no question rows.');
        }

        return $rows;
    }

    /** Text comparison that ignores quote style, case and spacing. */
    protected function normalize(string $text): string
    {
        $text = str_replace(['“', '”', '„', '‘', '’', '‚'], ['"', '"', '"', "'", "'", "'"], $text);

        return mb_strtolower(trim(preg_replace('/\s+/u', ' ', $text)));
    }
}
