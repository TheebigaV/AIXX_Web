<?php

namespace Database\Seeders;

use App\Models\RoleAndPermission\Role;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin'],
            ['name' => 'Super Admin (AIXX)'],
            ['name' => 'Sub Admin (AIXX)'],
            ['name' => 'Corporate Admin'],
            ['name' => 'Content Manager'],
            ['name' => 'Support'],
            ['name' => 'Viewer'],
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(['name' => $roleData['name']], $roleData);
        }
    }
}
