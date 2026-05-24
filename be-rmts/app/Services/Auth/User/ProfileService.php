<?php

namespace App\Services\Auth\User;

use App\Repositories\Auth\User\ProfileRepository;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProfileService
{
    private ProfileRepository $profileRepository;

    public function __construct(ProfileRepository $profileRepository)
    {
        $this->profileRepository = $profileRepository;
    }


    public function getProfile(): ?User
    {
        $id = Auth::id();
        return $this->profileRepository->find($id);
    }
}
