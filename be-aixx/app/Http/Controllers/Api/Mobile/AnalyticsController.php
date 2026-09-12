<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    /**
     * POST /api/analytics/events — Ingest client events (web/flutter).
     */
    public function ingest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'events' => 'required|array|min:1|max:100',
            'events.*.event_name' => 'required|string|max:255',
            'events.*.platform' => 'nullable|string|max:50',
            'events.*.payload' => 'nullable|array',
            'events.*.occurred_at' => 'nullable|date',
        ]);

        $studentId = optional($request->user('student'))->id;
        $now = now();

        $rows = collect($validated['events'])->map(fn (array $event) => [
            'student_id' => $studentId,
            'event_name' => $event['event_name'],
            'platform' => $event['platform'] ?? 'flutter',
            'payload' => isset($event['payload']) ? json_encode($event['payload']) : null,
            'occurred_at' => $event['occurred_at'] ?? $now,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        AnalyticsEvent::insert($rows);

        return response()->json([
            'success' => true,
            'ingested' => count($rows),
        ], 201);
    }
}
