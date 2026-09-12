<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateAttempt;
use App\Models\Student;
use App\Models\Training;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    /**
     * POST /api/admin/certificate/issue — Manually issue certificate.
     */
    public function issue(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'training_id' => 'required|exists:trainings,id',
            'score' => 'nullable|integer|min:0|max:100',
        ]);

        $student = Student::findOrFail($validated['student_id']);
        $training = Training::findOrFail($validated['training_id']);

        $attempt = CertificateAttempt::updateOrCreate(
            ['student_id' => $student->id, 'training_id' => $training->id, 'is_completed' => true],
            [
                'score' => $validated['score'] ?? 100,
                'passed' => true,
                'completed_at' => now(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Certificate issued successfully.',
            'data' => [
                'attempt_id' => $attempt->id,
                'certificate_token' => $attempt->certificate_token,
                'issued_at' => $attempt->issued_at?->toIso8601String(),
            ],
        ], 201);
    }

    /**
     * PATCH /api/admin/certificate/{id}/revoke — Revoke a certificate.
     */
    public function revoke(int $id): JsonResponse
    {
        $attempt = CertificateAttempt::findOrFail($id);
        $attempt->update(['revoked_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Certificate revoked.'], 200);
    }
}
