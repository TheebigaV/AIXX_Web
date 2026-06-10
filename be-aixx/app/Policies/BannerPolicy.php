<?php

namespace App\Policies;

use App\Models\Banner;
use App\Models\User;

class BannerPolicy
{
    public function before($user, $ability)
    {
        if ($user) return true;
        return false;
    }

    public function viewAny(User $user): bool { return true; }
    public function view(User $user, Banner $banner): bool { return true; }
    public function create(User $user): bool { return true; }
    public function update(User $user, Banner $banner): bool { return true; }
    public function delete(User $user, Banner $banner): bool { return true; }
}
