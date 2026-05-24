<?php

namespace App\Policies;

use App\Models\RoleAndPermission\Role;
use App\Models\User;
use Illuminate\Support\Str;

/**
 *
 */
class RolePolicy
{
    /**
     * @param $user
     * @param $ability
     * @return false|void
     */
    public function before($user, $ability)
    {
        $ability = 'roles-' . Str::slug($ability, '-');
        if (!$user->hasPermissionTo($ability)) {
            return false;
        }
    }

    /**
     * Determine whether the user can view any roles.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the role.
     */
    public function view(User $user, Role $role): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create roles.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the role.
     */
    public function update(User $user, Role $role): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the role.
     */
    public function delete(User $user, Role $role): bool
    {
        return true;
    }
}
