<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiksController extends Controller
{
    /**
     * GET /api/aiks/latest — Get the latest AIKS profile.
     */
    public function latest(Request $request): JsonResponse
    {
        $snapshot = $request->user()->aiksSnapshots()->first();

        if (!$snapshot) {
            return response()->json([
                'success' => true,
                'data' => ['score' => 0, 'level' => 'Unrated', 'breakdown' => null, 'created_at' => null],
            ], 200);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'score' => $snapshot->score,
                'level' => $snapshot->level,
                'breakdown' => $snapshot->breakdown,
                'created_at' => $snapshot->created_at->toIso8601String(),
            ],
        ], 200);
    }

    /**
     * GET /api/aiks/history — Get AIKS progression history.
     */
    public function history(Request $request): JsonResponse
    {
        $snapshots = $request->user()->aiksSnapshots()
            ->paginate(20)
            ->through(fn ($s) => [
                'score' => $s->score,
                'level' => $s->level,
                'source' => $s->source,
                'created_at' => $s->created_at->toIso8601String(),
            ]);

        return response()->json(['success' => true, 'data' => $snapshots], 200);
    }
}
