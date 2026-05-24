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
            'title1' => 'Powering the North',
            'title2' => 'Over 20 Years',
            'subtitle' => 'Trusted Electrical & Electronics Services covering 90% of the Northern Province.',
            'image' => null, // You can add a default image path here if needed
        ]);

        $this->command->info('Sample banner created successfully!');
        $this->command->info('You can now test the dynamic banner system.');
    }
}
