<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\AmbassadorReferral;
use App\Models\PaymentTransaction;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    /**
     * POST /api/payments/webhook — Process MariBank payment webhook.
     */
    public function handle(Request $request): JsonResponse
    {
        if (!$this->verifySignature($request)) {
            return response()->json(['message' => 'Invalid webhook signature.'], 401);
        }

        $validated = $request->validate([
            'event_id' => 'required|string',
            'event_type' => 'required|string',
            'status' => 'required|string',
            'amount' => 'nullable|numeric',
            'currency' => 'nullable|string|max:3',
            'student_email' => 'nullable|email',
        ]);

        $student = !empty($validated['student_email'])
            ? Student::where('email', $validated['student_email'])->first()
            : null;

        $transaction = PaymentTransaction::updateOrCreate(
            ['provider' => 'maribank', 'external_id' => $validated['event_id']],
            [
                'event_type' => $validated['event_type'],
                'student_id' => $student?->id,
                'amount' => $validated['amount'] ?? null,
                'currency' => $validated['currency'] ?? null,
                'status' => $validated['status'],
                'payload' => $request->all(),
            ]
        );

        if ($validated['status'] === 'succeeded' && $student) {
            $this->processSuccessfulPayment($transaction, $student);
        }

        Log::info('MariBank webhook processed', ['event_id' => $validated['event_id'], 'status' => $validated['status']]);

        return response()->json(['message' => 'Webhook processed successfully.'], 200);
    }

    protected function verifySignature(Request $request): bool
    {
        $secret = config('services.maribank.webhook_secret');

        // If no secret is configured (e.g. local/dev), skip verification rather than blocking the flow.
        if (empty($secret)) {
            return true;
        }

        return hash_equals($secret, (string) $request->header('X-Webhook-Secret'));
    }

    protected function processSuccessfulPayment(PaymentTransaction $transaction, Student $student): void
    {
        $referral = AmbassadorReferral::where('referred_student_id', $student->id)
            ->where('status', 'pending')
            ->with('ambassador')
            ->first();

        if (!$referral || !$referral->ambassador) {
            return;
        }

        $referral->update(['status' => 'converted', 'converted_at' => now()]);

        $ambassador = $referral->ambassador;
        $amount = (float) ($transaction->amount ?? 0);
        $commissionAmount = round($amount * ((float) $ambassador->commission_rate / 100), 2);

        if ($commissionAmount > 0) {
            $ambassador->commissions()->create([
                'amount' => $commissionAmount,
                'currency' => $transaction->currency ?? 'USD',
                'source' => 'course_purchase',
                'status' => 'pending',
                'earned_at' => now(),
            ]);
        }

        $transaction->update(['ambassador_id' => $ambassador->id]);
    }
}
