<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'], // Unique field to avoid duplicates
            [
                'name' => 'Admin',
                'password' => Hash::make('12345678'), // Secure password
                'email_verified_at' => now(),
            ]
        );
    }
}
