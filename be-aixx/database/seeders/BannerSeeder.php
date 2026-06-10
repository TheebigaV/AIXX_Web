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
            'title_1' => 'Powering the North',
            'title_2' => 'Over 20 Years',
            'subtitle' => 'Trusted Electrical & Electronics Services covering 90% of the Northern Province.',
            'link' => null,
            'is_active' => true,
        ]);

        $this->command->info('Sample banner created successfully!');
        $this->command->info('You can now test the dynamic banner system.');
    }
}
