<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CourseCmsController extends Controller
{
    /**
     * GET /api/admin/course-cms/questions — Browse question library.
     */
    public function questions(Request $request): JsonResponse
    {
        $query = CertificateQuestion::with(['training:id,name,slug', 'contributor:id,name']);

        if ($request->filled('training_id')) {
            $query->where('training_id', $request->get('training_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        $questions = $query->orderByDesc('id')->paginate((int) $request->get('per_page', 20));

        return response()->json(['success' => true, 'data' => $questions], 200);
    }

    /**
     * PATCH /api/admin/course-cms/questions/{id}/status — Update question status.
     */
    public function updateQuestionStatus(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
        ]);

        $question = CertificateQuestion::findOrFail($id);
        $question->update([
            'status' => $validated['status'],
            'is_active' => $validated['status'] === 'published',
        ]);

        return response()->json(['success' => true, 'data' => $question], 200);
    }
}
