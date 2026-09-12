<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Ambassador;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AmbassadorController extends Controller
{
    /**
     * POST /api/ambassador/enrol — Self-enrol as an ambassador.
     */
    public function enrol(Request $request): JsonResponse
    {
        $student = $request->user();

        $ambassador = Ambassador::firstOrCreate(
            ['student_id' => $student->id],
            [
                'referral_code' => $this->generateReferralCode($student),
                'status' => 'pending',
                'commission_rate' => 10.00,
                'joined_at' => now(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => $ambassador->wasRecentlyCreated
                ? 'You have successfully enrolled as an ambassador. Your application is pending review.'
                : 'You are already enrolled as an ambassador.',
            'data' => $this->present($ambassador),
        ], $ambassador->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * GET /api/ambassador/me — Get ambassador profile.
     */
    public function me(Request $request): JsonResponse
    {
        $ambassador = Ambassador::where('student_id', $request->user()->id)->first();

        if (!$ambassador) {
            return response()->json(['success' => false, 'message' => 'You are not enrolled as an ambassador yet.'], 404);
        }

        return response()->json(['success' => true, 'data' => $this->present($ambassador)], 200);
    }

    /**
     * GET /api/ambassador/me/commissions — Get ambassador commission ledger.
     */
    public function commissions(Request $request): JsonResponse
    {
        $ambassador = Ambassador::where('student_id', $request->user()->id)->first();

        if (!$ambassador) {
            return response()->json(['success' => false, 'message' => 'You are not enrolled as an ambassador yet.'], 404);
        }

        $commissions = $ambassador->commissions()->orderByDesc('id')->get();

        return response()->json([
            'success' => true,
            'summary' => [
                'total_earned' => (float) $commissions->sum('amount'),
                'total_pending' => (float) $commissions->where('status', 'pending')->sum('amount'),
                'total_paid' => (float) $commissions->where('status', 'paid')->sum('amount'),
            ],
            'data' => $commissions->map(fn ($c) => [
                'id' => $c->id,
                'amount' => (float) $c->amount,
                'currency' => $c->currency,
                'source' => $c->source,
                'status' => $c->status,
                'earned_at' => $c->earned_at?->toIso8601String(),
                'paid_at' => $c->paid_at?->toIso8601String(),
            ]),
        ], 200);
    }

    /**
     * GET /api/ambassador/me/referrals — Get ambassador referrals.
     */
    public function referrals(Request $request): JsonResponse
    {
        $ambassador = Ambassador::where('student_id', $request->user()->id)->first();

        if (!$ambassador) {
            return response()->json(['success' => false, 'message' => 'You are not enrolled as an ambassador yet.'], 404);
        }

        $referrals = $ambassador->referrals()->with('referredStudent:id,full_name,email')->orderByDesc('id')->get();

        return response()->json([
            'success' => true,
            'summary' => [
                'total' => $referrals->count(),
                'converted' => $referrals->where('status', 'converted')->count(),
                'pending' => $referrals->where('status', 'pending')->count(),
            ],
            'data' => $referrals->map(fn ($r) => [
                'id' => $r->id,
                'referred_name' => $r->referredStudent?->full_name,
                'referred_email' => $r->referred_email,
                'status' => $r->status,
                'converted_at' => $r->converted_at?->toIso8601String(),
            ]),
        ], 200);
    }

    protected function generateReferralCode($student): string
    {
        do {
            $code = 'AIXX-' . strtoupper(Str::random(6));
        } while (Ambassador::where('referral_code', $code)->exists());

        return $code;
    }

    protected function present(Ambassador $ambassador): array
    {
        return [
            'referral_code' => $ambassador->referral_code,
            'status' => $ambassador->status,
            'commission_rate' => (float) $ambassador->commission_rate,
            'joined_at' => $ambassador->joined_at?->toIso8601String(),
        ];
    }
}
