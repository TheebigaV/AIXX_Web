<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ambassador;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AmbassadorController extends Controller
{
    /**
     * GET /api/admin/ambassadors — List all ambassadors.
     */
    public function index(Request $request): JsonResponse
    {
        $ambassadors = Ambassador::with('student:id,full_name,email')
            ->withCount('referrals')
            ->withSum('commissions', 'amount')
            ->orderByDesc('created_at')
            ->paginate((int) $request->get('per_page', 15));

        return response()->json(['success' => true, 'data' => $ambassadors], 200);
    }

    /**
     * PATCH /api/admin/ambassadors/{id}/status — Update ambassador status.
     */
    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'active', 'suspended'])],
        ]);

        $ambassador = Ambassador::findOrFail($id);
        $ambassador->update($validated);

        return response()->json(['success' => true, 'data' => $ambassador], 200);
    }

    /**
     * PATCH /api/admin/ambassadors/{id}/commission — Update commission rate.
     */
    public function updateCommission(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'commission_rate' => 'required|numeric|min:0|max:100',
        ]);

        $ambassador = Ambassador::findOrFail($id);
        $ambassador->update($validated);

        return response()->json(['success' => true, 'data' => $ambassador], 200);
    }

    /**
     * POST /api/admin/ambassadors/{id}/payout — Trigger payout.
     */
    public function payout(int $id): JsonResponse
    {
        $ambassador = Ambassador::findOrFail($id);

        $pending = $ambassador->commissions()->where('status', 'pending')->get();
        $total = $pending->sum('amount');

        if ($total <= 0) {
            return response()->json(['success' => false, 'message' => 'No pending commissions to pay out.'], 400);
        }

        $ambassador->commissions()->where('status', 'pending')->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Paid out {$total} across {$pending->count()} commission(s).",
            'amount_paid' => (float) $total,
        ], 200);
    }
}
