<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contributor;
use Illuminate\Http\JsonResponse;

class ContributorController extends Controller
{
    /**
     * GET /api/admin/contributors — List contributors.
     */
    public function index(): JsonResponse
    {
        $contributors = Contributor::withCount('certificateQuestions')->orderBy('name')->get();

        return response()->json(['success' => true, 'data' => $contributors], 200);
    }

    /**
     * GET /api/admin/contributors/{id} — Get single contributor profile.
     */
    public function show(int $id): JsonResponse
    {
        $contributor = Contributor::withCount('certificateQuestions')
            ->with(['certificateQuestions' => fn ($q) => $q->latest()->limit(10)])
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => $contributor], 200);
    }
}
