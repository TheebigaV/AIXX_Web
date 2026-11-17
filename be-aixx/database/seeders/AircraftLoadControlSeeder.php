<?php

namespace Database\Seeders;

use App\Models\AssessmentBlueprint;
use App\Models\CourseProfile;
use App\Models\KnowledgeCheck;
use App\Models\LearningPath;
use App\Models\ModuleContent;
use App\Models\PathwayLevel;
use App\Models\Training;
use App\Models\TrainingModule;
use App\Models\TrainingQuestion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Seeds "Level 1 Certificate in Aircraft Load Control Fundamentals" from the
 * AIXX master curriculum (database/data/aircraft_load_control_level1.json):
 * 12 modules with lesson cards, terminology, scenarios, knowledge checks,
 * summaries and the 72-question mapped MCQ bank, plus the certification
 * blueprint, pathway levels and an "Aircraft Load Control" learning path.
 *
 * Idempotent: re-running updates the same records.
 *   php artisan db:seed --class=AircraftLoadControlSeeder
 */
class AircraftLoadControlSeeder extends Seeder
{
    public const DATA_FILE = 'data/aircraft_load_control_level1.json';

    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path(self::DATA_FILE)), true, flags: JSON_THROW_ON_ERROR);
        $c = $data['course'];

        DB::transaction(function () use ($data, $c) {
            $training = Training::withTrashed()->updateOrCreate(['slug' => $c['slug']], [
                'name' => $c['name'],
                'type' => $c['type'],
                'description' => $c['boundary_statement'],
                'duration' => $c['duration'],
                'sub_modules' => collect($data['modules'])->pluck('title')->implode("\n"),
                'highlights' => "12 self-paced modules\nKnowledge checks with explanations\n72 mapped MCQs\nCompetency profile & career roadmap",
                'is_active' => true,
            ]);
            if ($training->trashed()) {
                $training->restore();
            }

            CourseProfile::updateOrCreate(['training_id' => $training->id, 'lang' => 'en'], [
                'target_learner' => $c['target_learner'],
                'delivery' => $c['delivery'],
                'boundary_statement' => $c['boundary_statement'],
                'safety_boundary' => $c['safety_boundary'],
                'outcomes' => $c['outcomes'],
                'competency_areas' => $data['competency_areas'],
                'version' => $c['version'],
                'effective_date' => $c['effective_date'],
            ]);

            AssessmentBlueprint::updateOrCreate(['training_id' => $training->id], $data['blueprint']);

            PathwayLevel::updateOrCreate(['pathway_slug' => $c['pathway_slug'], 'level' => $c['level']], [
                'pathway_name' => $c['pathway'],
                'level_name' => $c['level_name'],
                'description' => 'Foundation knowledge of aircraft load control.',
                'training_id' => $training->id,
            ]);
            foreach ($data['next_levels'] as $next) {
                PathwayLevel::firstOrCreate(['pathway_slug' => $c['pathway_slug'], 'level' => $next['level']], [
                    'pathway_name' => $c['pathway'],
                    'level_name' => $next['level_name'],
                    'description' => $next['description'],
                    'training_id' => null,
                ]);
            }

            $path = LearningPath::updateOrCreate(['slug' => $c['pathway_slug']], [
                'name' => 'Aircraft Load Control',
                'description' => 'Aircraft load control professional development pathway: load controller, weight and balance, ground operations.',
                'is_active' => true,
            ]);
            $path->trainings()->syncWithoutDetaching([$training->id => ['sort_order' => $c['level']]]);

            foreach ($data['modules'] as $m) {
                $this->seedModule($training, $m, $c);
            }
        });
    }

    protected function seedModule(Training $training, array $m, array $c): void
    {
        $module = TrainingModule::updateOrCreate(
            ['training_id' => $training->id, 'module_index' => $m['module_index']],
            [
                'title' => $m['title'],
                // Plain-text notes keep the existing /modules/{i} and /contents endpoints meaningful.
                'study_notes' => collect($m['cards'])
                    ->map(fn ($card) => trim(($card['heading'] ? $card['heading'] . "\n" : '') . $card['body']))
                    ->implode("\n\n"),
                'is_published' => true,
            ]
        );

        $cards = $m['cards'];
        $cards[] = ['heading' => 'Operational boundary', 'body' => $m['operational_boundary'] . '. ' . $c['boundary_statement'], 'type' => 'warning'];

        ModuleContent::updateOrCreate(['training_module_id' => $module->id, 'lang' => 'en'], [
            'study_time' => $m['study_time'],
            'assessment_approach' => $m['assessment_approach'],
            'operational_boundary' => $m['operational_boundary'],
            'competency_area' => $m['competency_area'],
            'objectives' => $m['objectives'],
            'terminology' => $m['terminology'],
            'cards' => $cards,
            'scenarios' => collect($m['scenarios'])->values()->map(fn ($s, $i) => [
                'title' => 'Scenario ' . ($i + 1),
                'description' => $s,
                'image_url' => null,
            ])->all(),
            'summary' => $m['summary'],
            'version' => $c['version'],
            'effective_date' => $c['effective_date'],
        ]);

        foreach ($m['knowledge_checks'] as $i => $kc) {
            KnowledgeCheck::updateOrCreate(
                ['training_module_id' => $module->id, 'lang' => 'en', 'sort_order' => $i + 1],
                ['question' => $kc['question'], 'suggested_answer' => $kc['suggested_answer']]
            );
        }

        foreach ($m['mcqs'] as $q) {
            TrainingQuestion::updateOrCreate(
                ['training_module_id' => $module->id, 'question' => $q['question']],
                [
                    'options' => $q['options'],
                    'correct_answer' => $q['correct_answer'],
                    'explanation' => $q['explanation'],
                    'competency_tag' => $q['competency_tag'],
                ]
            );
        }
    }
}
