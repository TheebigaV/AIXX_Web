<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\CertificateAttempt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    /**
     * GET /api/certificate — List issued certificates.
     */
    public function index(Request $request): JsonResponse
    {
        $certificates = CertificateAttempt::where('student_id', $request->user()->id)
            ->where('passed', true)
            ->whereNull('revoked_at')
            ->with('training:id,name,slug')
            ->orderByDesc('issued_at')
            ->get()
            ->map(fn (CertificateAttempt $a) => $this->present($a));

        return response()->json(['success' => true, 'count' => $certificates->count(), 'data' => $certificates], 200);
    }

    /**
     * GET /api/certificate/{id} — Get single certificate details.
     */
    public function show(int $id, Request $request): JsonResponse
    {
        $attempt = CertificateAttempt::where('student_id', $request->user()->id)
            ->where('passed', true)
            ->with('training:id,name,slug')
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => $this->present($attempt)], 200);
    }

    /**
     * GET /api/certificate/verify/{token} — (Public) Verify a certificate.
     */
    public function verify(string $token): JsonResponse
    {
        $attempt = CertificateAttempt::where('certificate_token', $token)
            ->with(['training:id,name,slug', 'student:id,full_name,registration_id'])
            ->first();

        if (!$attempt || !$attempt->isValidCertificate()) {
            return response()->json(['success' => false, 'valid' => false, 'message' => 'Certificate not found or invalid.'], 404);
        }

        return response()->json([
            'success' => true,
            'valid' => true,
            'data' => [
                'certificate_token' => $attempt->certificate_token,
                'holder_name' => $attempt->student?->full_name,
                'registration_id' => $attempt->student?->registration_id,
                'course' => $attempt->training?->name,
                'score' => $attempt->score,
                'issued_at' => $attempt->issued_at?->toIso8601String(),
            ],
        ], 200);
    }

    protected function present(CertificateAttempt $attempt): array
    {
        return [
            'id' => $attempt->id,
            'certificate_token' => $attempt->certificate_token,
            'course' => $attempt->training?->name,
            'course_slug' => $attempt->training?->slug,
            'score' => $attempt->score,
            'issued_at' => $attempt->issued_at?->toIso8601String(),
            'verify_url' => "/api/certificate/verify/{$attempt->certificate_token}",
        ];
    }
}
