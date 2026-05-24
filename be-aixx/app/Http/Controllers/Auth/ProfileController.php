<?php

namespace App\Http\Controllers\Auth;

use App\Services\Auth\User\ProfileService;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\User\UserResource;
use App\Http\Resources\Auth\User\ProfileResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    private ProfileService $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }


    public function getProfile(Request $request){

        $user =  $this->profileService->getProfile();
        return response()->json([
            'message' => 'User fetched successfully',
            'user' => new ProfileResource($user),
        ], 201);
    }
}
