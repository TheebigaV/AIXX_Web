<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:students,email',
            'password' => 'required|string|min:8',
        ]);

        $uuid = (string) Str::uuid();

        $student = Student::create([
            'uuid' => $uuid,
            'full_name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $registrationId = 'AIXX-STU-' . $student->id;
        $student->update(['registration_id' => $registrationId]);

        return response()->json([
            'message' => 'Registration successful!',
            'uuid' => $uuid,
            'registration_id' => $registrationId,
            'full_name' => $student->full_name,
            'email' => $student->email,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $student = Student::where('email', $validated['email'])->first();

        if (!$student || !Hash::check($validated['password'], $student->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $student->update(['last_login_at' => Carbon::now()]);

        return response()->json([
            'message' => 'Login successful!',
            'token' => $student->uuid,
            'name' => $student->name,
            'email' => $student->email,
            'registration_id' => $student->registration_id,
            'last_login_at' => $student->last_login_at?->toIso8601String(),
        ], 200);
    }

    public function verifyToken(Request $request)
    {
        $uuid = $request->query('token');

        if (!$uuid) {
            return response()->json(['message' => 'Token parameter is missing.'], 400);
        }

        $student = Student::where('uuid', $uuid)->first();

        if (!$student) {
            return response()->json(['message' => 'Invalid or expired session token.'], 404);
        }

        return response()->json([
            'message' => 'Token verified successfully.',
            'name' => $student->name,
            'email' => $student->email,
            'registration_id' => $student->registration_id,
            'last_login_at' => $student->last_login_at?->toIso8601String(),
        ], 200);
    }
}
