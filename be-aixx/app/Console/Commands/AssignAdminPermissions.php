<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class AssignAdminPermissions extends Command
{
    protected $signature = 'admin:assign-permissions {email=admin@example.com}';
    protected $description = 'Assign all admin permissions to a user';

    public function handle()
    {
        $email = $this->argument('email');

        // Reset cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create all inquiry permissions
        $permissions = [
            'inquiries-view',
            'inquiries-viewany',
            'inquiries-create',
            'inquiries-update',
            'inquiries-delete',
            'dashboard-view',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }

        // Get or create Super Admin role
        $role = Role::updateOrCreate(['name' => 'Super Admin']);
        $role->givePermissionTo(Permission::all());

        // Find user and assign role
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->assignRole($role);
            $this->info("✓ Assigned Super Admin role and all permissions to {$email}");
        } else {
            $this->error("✗ User with email {$email} not found");
        }
    }
}
