<?php

namespace App\Policies;

use App\Models\Banner;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Str;

/**
 *
 */
class BannerPolicy
{
    /**
     * @param $user
     * @param $ability
     * @return false|void
     */
    public function before($user, $ability)
    {
        $ability = 'banners-' . Str::slug($ability, '-');
        if (!$user->hasPermissionTo($ability)) {
            return false;
        }
    }
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Banner $banner): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Banner $banner): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Banner $banner): bool
    {
        return true;
    }

}
