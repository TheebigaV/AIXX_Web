<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $entities = ['users', 'roles', 'categories', 'banners', 'enquiries', 'settings'];
        $actions = ['view', 'viewany', 'create', 'update', 'delete'];
        
        $permissions = ['dashboard-view'];
        
        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                $permissions[] = $entity . '-' . $action;
            }
        }

        // Add some legacy/frontend specific ones just in case
        $permissions[] = 'users-view';
        $permissions[] = 'roles-view';
        $permissions[] = 'categories-view';
        $permissions[] = 'enquiries-view';

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $role = Role::updateOrCreate(['name' => 'Super Admin']);
        $role->givePermissionTo(Permission::all());

        // Assign to first user
        $user = User::where('email', 'admin@example.com')->first();
        if ($user) {
            $user->assignRole($role);
        }
    }
}
