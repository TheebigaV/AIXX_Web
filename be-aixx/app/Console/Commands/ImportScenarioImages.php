<?php

namespace App\Console\Commands;

use App\Services\LearnerProgressService;
use App\Services\ScenarioImageService;
use Illuminate\Console\Command;
use Illuminate\Http\File;

/**
 * Attaches a folder of scenario illustrations to a course's lessons.
 * Files are named module-NN-figure-K.(png|jpg|jpeg|webp|svg); figure K becomes the
 * image of scenario K in module NN. Re-running replaces the previous image.
 */
class ImportScenarioImages extends Command
{
    protected $signature = 'curriculum:import-scenario-images
        {dir : Folder containing module-NN-figure-K image files}
        {--course=aircraft-load-control-level-1 : Course slug}
        {--lang=en : Lesson language to attach the images to}
        {--dry-run : Check the files and show the mapping without saving}';

    protected $description = 'Bulk-attach scenario images to a course\'s module lessons';

    protected const PATTERN = '/^module-(\d+)-figure-(\d+)\.(png|jpe?g|webp|svg)$/i';

    public function handle(LearnerProgressService $progress, ScenarioImageService $images): int
    {
        $dir = rtrim((string) $this->argument('dir'), '/\\');
        if (!is_dir($dir)) {
            $this->error("Folder not found: {$dir}");
            return self::FAILURE;
        }

        $training = $progress->findCourse((string) $this->option('course'));
        if (!$training) {
            $this->error("Course '{$this->option('course')}' not found.");
            return self::FAILURE;
        }

        $lang = (string) $this->option('lang');
        $modules = $training->modules()->with('contents')->get()->keyBy('module_index');
        $rows = [];
        $failed = 0;

        foreach (collect(scandir($dir))->sort()->values() as $name) {
            $file = $dir . DIRECTORY_SEPARATOR . $name;
            if (!is_file($file)) {
                continue;
            }
            if (!preg_match(self::PATTERN, $name, $m)) {
                $this->warn("Skipped {$name}: name is not module-NN-figure-K.<png|jpg|webp|svg>.");
                continue;
            }

            [$moduleIndex, $number] = [(int) $m[1], (int) $m[2]];
            $content = $modules->get($moduleIndex)?->contents->firstWhere('lang', $lang);
            $problem = match (true) {
                !$content => "module {$moduleIndex} has no '{$lang}' lesson",
                !isset(($content->scenarios ?? [])[$number - 1]) => "module {$moduleIndex} has no scenario {$number}",
                filesize($file) > ScenarioImageService::MAX_BYTES => 'file is larger than 5 MB',
                strtolower($m[3]) !== 'svg' && @getimagesize($file) === false => 'file is not a valid image',
                default => null,
            };

            if ($problem) {
                $failed++;
                $rows[] = [$name, $moduleIndex, $number, "FAILED: {$problem}"];
                continue;
            }

            $url = $this->option('dry-run') ? '(dry run)' : $images->attach($content, $number, new File($file));
            $rows[] = [$name, $moduleIndex, $number, $url];
        }

        if (!$rows) {
            $this->error('No module-NN-figure-K images found.');
            return self::FAILURE;
        }

        $this->table(['File', 'Module', 'Scenario', 'Image URL'], $rows);
        $done = count($rows) - $failed;
        $this->info(($this->option('dry-run') ? 'Dry run: would attach ' : 'Attached ') . "{$done} image(s), {$failed} failed.");

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
