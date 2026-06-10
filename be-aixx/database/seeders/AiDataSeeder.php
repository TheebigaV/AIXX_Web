<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AiDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AiTrainingSeeder::class,
            AiCategorySeeder::class,
            AiProductSeeder::class,
        ]);
    }
}
