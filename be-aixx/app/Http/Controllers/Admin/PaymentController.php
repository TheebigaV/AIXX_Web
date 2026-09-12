<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * GET /api/admin/payments — View payment reconciliation list.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PaymentTransaction::with(['student:id,full_name,email', 'ambassador:id,referral_code']);

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        $payments = $query->orderByDesc('created_at')->paginate((int) $request->get('per_page', 20));

        return response()->json(['success' => true, 'data' => $payments], 200);
    }
}
