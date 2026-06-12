<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Banner;

class BannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a sample banner for testing
        Banner::create([
            'title_1' => 'Intelligent Solutions for Tomorrow',
            'title_2' => 'Driving Intelligent Digital Transformation',
            'subtitle' => 'We deliver AI-powered innovation and modern solutions that help businesses grow, adapt, and succeed.',
            'link' => null,
            'is_active' => true,
        ]);

        $this->command->info('Sample banner created successfully!');
        $this->command->info('You can now test the dynamic banner system.');
    }
}
