<?php

namespace App\Policies;

use App\Models\Setting;
use App\Models\User;

class SettingPolicy
{
    public function before($user, $ability)
    {
        if ($user) return true;
        return false;
    }

    public function viewAny(User $user): bool { return true; }
    public function view(User $user, Setting $setting): bool { return true; }
    public function create(User $user): bool { return true; }
    public function update(User $user, Setting $setting): bool { return true; }
    public function delete(User $user, Setting $setting): bool { return true; }
}
