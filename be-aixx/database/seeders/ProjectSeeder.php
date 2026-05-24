<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample projects with different states

        // Recent visible projects
        Project::factory()
            ->count(10)
            ->visible()
            ->recent()
            ->create();

        // Upcoming visible projects
        Project::factory()
            ->count(5)
            ->visible()
            ->upcoming()
            ->create();

        // Hidden projects
        Project::factory()
            ->count(3)
            ->hidden()
            ->create();

        // Rich content projects
        Project::factory()
            ->count(5)
            ->visible()
            ->rich()
            ->create();

        // Minimal content projects
        Project::factory()
            ->count(3)
            ->visible()
            ->minimal()
            ->create();

        // Some deleted projects for testing soft deletes
        $deletedProjects = Project::factory()
            ->count(2)
            ->create();

        $deletedProjects->each(function ($project) {
            $project->delete();
        });

        $this->command->info('Projects seeded successfully!');
        $this->command->info('Total projects created: ' . Project::withTrashed()->count());
        $this->command->info('Visible projects: ' . Project::where('is_active', true)->count());
        $this->command->info('Hidden projects: ' . Project::where('is_active', false)->count());
        $this->command->info('Deleted projects: ' . Project::onlyTrashed()->count());
    }
}
