<?php

namespace App\Http\Controllers\Auth;

use App\Services\Auth\User\ProfileService;
use App\Http\Controllers\Controller;
use App\Http\Resources\Auth\User\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    private ProfileService $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    public function getProfile(Request $request)
    {
        $user = $this->profileService->getProfile();
        return response()->json([
            'message' => 'User fetched successfully',
            'user'    => new ProfileResource($user),
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => new ProfileResource($user->fresh()),
        ], 200);
    }
}

