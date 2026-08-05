<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;


class SetupPermissionsController extends Controller
{
    public function setup(Request $request)
    {
        // Reset cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create all permissions
        $entities = ['users', 'roles', 'categories', 'banners', 'settings', 'training', 'products', 'inquiries'];
        $actions = ['view', 'viewany', 'create', 'update', 'delete'];

        $permissions = ['dashboard-view'];

        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                $permissions[] = $entity . '-' . $action;
            }
        }

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }

        // Create Super Admin role
        $role = Role::updateOrCreate(['name' => 'Super Admin']);
        $role->givePermissionTo(Permission::all());

        // Assign to authenticated user or admin accounts
        $users = array_filter([
            auth()->user(),
            User::where('email', 'admin@example.com')->first(),
            User::where('email', 'admin@gmail.com')->first(),
        ]);

        foreach ($users as $user) {
            $user->assignRole($role);
        }

        return response()->json([
            'success' => true,
            'message' => "All permissions assigned to admin accounts",
            'permissions_count' => count($permissions),
        ]);

        return response()->json([
            'success' => false,
            'error' => 'No user found to assign permissions',
        ], 404);
    }

    public function setupNoAuth()
    {
        // No auth required - for initial setup only
        return $this->setup(request());
    }
}
