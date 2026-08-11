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
        $entities = ['users', 'roles', 'categories', 'banners', 'settings', 'training', 'products', 'inquiries'];
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

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdmin = Role::updateOrCreate(['name' => 'Super Admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $superAdminAixx = Role::updateOrCreate(['name' => 'Super Admin (AIXX)']);
        $superAdminAixx->givePermissionTo(Permission::all());

        $subAdminAixx = Role::updateOrCreate(['name' => 'Sub Admin (AIXX)']);
        $subAdminAixx->givePermissionTo(Permission::all());

        $corporateAdmin = Role::updateOrCreate(['name' => 'Corporate Admin']);
        $corporateAdmin->givePermissionTo(Permission::all());

        // Assign to all admin users
        foreach (['admin@example.com', 'admin@gmail.com'] as $email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $user->assignRole($superAdmin);
            }
        }
    }
}
