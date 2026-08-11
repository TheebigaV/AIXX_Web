<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleUserSeeder::class,
            UsersTableSeeder::class,
            RoleAndPermissionSeeder::class,
            RolesTableSeeder::class,
            HardwareProductsSeeder::class,
            AIProductsSeeder::class,
            AiDataSeeder::class,
            BannerSeeder::class,
            CategorySeeder::class,
            CustomerSeeder::class,
            DocumentSeeder::class,
            ProjectSeeder::class,
            SettingsTableSeeder::class,
            AiTrainingSeeder::class,
            CertificateQuestionsSeeder::class,
        ]);
    }
}
