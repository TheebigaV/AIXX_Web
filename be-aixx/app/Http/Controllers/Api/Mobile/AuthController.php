<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Ambassador;
use App\Models\AmbassadorReferral;
use App\Models\Student;
use App\Notifications\MobileOtpNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/auth/register — Register a new alumni.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:students,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:255',
            'referral_code' => 'nullable|string|max:50',
        ]);

        $student = Student::create([
            'uuid' => (string) Str::uuid(),
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'country' => $validated['country'] ?? null,
            'otp_code' => $this->generateOtp(),
            'otp_expires_at' => Carbon::now()->addMinutes(10),
        ]);

        $student->update(['registration_id' => 'AIXX-ALM-' . $student->id]);

        if (!empty($validated['referral_code'])) {
            $ambassador = Ambassador::where('referral_code', $validated['referral_code'])
                ->where('status', 'active')
                ->first();

            if ($ambassador) {
                AmbassadorReferral::create([
                    'ambassador_id' => $ambassador->id,
                    'referred_student_id' => $student->id,
                    'referred_email' => $student->email,
                    'status' => 'pending',
                ]);
            }
        }

        $student->notify(new MobileOtpNotification($student->otp_code, 'verification'));

        return response()->json([
            'message' => 'Registration successful! Please verify your email with the OTP we sent you.',
            'email' => $student->email,
            'registration_id' => $student->registration_id,
        ], 201);
    }

    /**
     * POST /api/auth/verify-otp — Verify registration OTP.
     */
    public function verifyOtp(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
        ]);

        $student = Student::where('email', $validated['email'])->first();

        $this->assertValidOtp($student, $validated['otp']);

        $student->update([
            'email_verified_at' => Carbon::now(),
            'otp_code' => null,
            'otp_expires_at' => null,
            'last_login_at' => Carbon::now(),
        ]);

        $token = $student->createToken('mobile')->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully.',
            'token' => $token,
            'student' => $this->profile($student),
        ], 200);
    }

    /**
     * POST /api/auth/resend-otp — Resend the OTP.
     */
    public function resendOtp(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $student = Student::where('email', $validated['email'])->first();

        if (!$student) {
            return response()->json(['message' => 'No account found with that email.'], 404);
        }

        if ($student->email_verified_at) {
            return response()->json(['message' => 'This account is already verified.'], 409);
        }

        $student->update([
            'otp_code' => $this->generateOtp(),
            'otp_expires_at' => Carbon::now()->addMinutes(10),
        ]);

        $student->notify(new MobileOtpNotification($student->otp_code, 'verification'));

        return response()->json(['message' => 'A new OTP has been sent to your email.'], 200);
    }

    /**
     * POST /api/auth/login — Login an alumni.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $student = Student::where('email', $validated['email'])->first();

        if (!$student || empty($student->password) || !Hash::check($validated['password'], $student->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$student->email_verified_at) {
            return response()->json([
                'message' => 'Please verify your email before logging in.',
                'requires_verification' => true,
                'email' => $student->email,
            ], 403);
        }

        $student->update(['last_login_at' => Carbon::now()]);

        $token = $student->createToken('mobile')->plainTextToken;

        return response()->json([
            'message' => 'Login successful!',
            'token' => $token,
            'student' => $this->profile($student),
        ], 200);
    }

    /**
     * POST /api/auth/forgot-password — Request a password reset link (OTP based for mobile).
     */
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $student = Student::where('email', $validated['email'])->first();

        // Always respond the same way to avoid leaking which emails are registered.
        if ($student) {
            $student->update([
                'otp_code' => $this->generateOtp(),
                'otp_expires_at' => Carbon::now()->addMinutes(10),
            ]);

            $student->notify(new MobileOtpNotification($student->otp_code, 'password_reset'));
        }

        return response()->json([
            'message' => 'If an account exists for that email, a password reset code has been sent.',
        ], 200);
    }

    /**
     * POST /api/auth/reset-password — Reset password using the OTP.
     */
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $student = Student::where('email', $validated['email'])->first();

        $this->assertValidOtp($student, $validated['otp']);

        $student->update([
            'password' => Hash::make($validated['password']),
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        return response()->json(['message' => 'Password reset successful. You can now log in.'], 200);
    }

    /**
     * POST /api/auth/logout — Logout the alumni.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.'], 200);
    }

    /**
     * GET /api/me — Get full alumni profile, entitlements, and AIKS.
     */
    public function me(Request $request)
    {
        $student = $request->user();

        return response()->json([
            'profile' => $this->profile($student),
            'entitlements' => [
                'enrolled_courses' => $student->enrolled_courses ?? [],
                'is_ambassador' => $student->ambassador()->exists(),
            ],
            'aiks' => optional($student->aiksSnapshots()->first())->only(['score', 'level', 'created_at']),
        ], 200);
    }

    /**
     * PATCH /api/me/preferences — Update user preferences.
     */
    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'preferences' => 'required|array',
        ]);

        $student = $request->user();
        $student->update([
            'preferences' => array_merge($student->preferences ?? [], $validated['preferences']),
        ]);

        return response()->json([
            'message' => 'Preferences updated successfully.',
            'preferences' => $student->fresh()->preferences,
        ], 200);
    }

    protected function generateOtp(): string
    {
        return (string) random_int(100000, 999999);
    }

    protected function assertValidOtp(?Student $student, string $otp): void
    {
        if (!$student || !$student->otp_code) {
            throw ValidationException::withMessages(['otp' => ['Invalid or expired code.']]);
        }

        if (!hash_equals((string) $student->otp_code, (string) $otp)) {
            throw ValidationException::withMessages(['otp' => ['Invalid or expired code.']]);
        }

        if (!$student->otp_expires_at || Carbon::now()->greaterThan($student->otp_expires_at)) {
            throw ValidationException::withMessages(['otp' => ['This code has expired. Please request a new one.']]);
        }
    }

    protected function profile(Student $student): array
    {
        return [
            'id' => $student->id,
            'uuid' => $student->uuid,
            'registration_id' => $student->registration_id,
            'full_name' => $student->full_name,
            'email' => $student->email,
            'phone' => $student->phone,
            'country' => $student->country,
            'gender' => $student->gender,
            'company_name' => $student->company_name,
            'academic_institution' => $student->academic_institution,
            'email_verified_at' => $student->email_verified_at?->toIso8601String(),
            'preferences' => $student->preferences ?? [],
            'last_login_at' => $student->last_login_at?->toIso8601String(),
        ];
    }
}
