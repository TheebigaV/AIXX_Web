<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Models\Training;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    /**
     * GET /api/survey — List available surveys.
     */
    public function index(): JsonResponse
    {
        $surveys = Survey::where('is_active', true)
            ->with('training:id,name,slug')
            ->get()
            ->map(fn (Survey $s) => [
                'id' => $s->id,
                'title' => $s->title,
                'training' => $s->training?->name,
                'training_id' => $s->training_id,
                'questions' => $s->questions,
            ]);

        return response()->json(['success' => true, 'count' => $surveys->count(), 'data' => $surveys], 200);
    }

    /**
     * POST /api/survey/{courseId}/submit — Submit course-completion survey.
     */
    public function submit(int $courseId, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'answers' => 'required|array',
        ]);

        $training = Training::findOrFail($courseId);
        $survey = $this->resolveSurvey($training);

        if (!$survey) {
            return response()->json(['success' => false, 'message' => 'No survey is configured for this course.'], 404);
        }

        $response = SurveyResponse::updateOrCreate(
            ['survey_id' => $survey->id, 'student_id' => $request->user()->id],
            ['answers' => $validated['answers'], 'submitted_at' => now()]
        );

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your feedback!',
            'submitted_at' => $response->submitted_at->toIso8601String(),
        ], 200);
    }

    /**
     * GET /api/survey/{courseId}/status — Check survey completion status.
     */
    public function status(int $courseId, Request $request): JsonResponse
    {
        $training = Training::findOrFail($courseId);
        $survey = $this->resolveSurvey($training);

        if (!$survey) {
            return response()->json(['success' => true, 'has_survey' => false, 'completed' => false], 200);
        }

        $response = SurveyResponse::where('survey_id', $survey->id)
            ->where('student_id', $request->user()->id)
            ->first();

        return response()->json([
            'success' => true,
            'has_survey' => true,
            'completed' => (bool) $response,
            'submitted_at' => $response?->submitted_at?->toIso8601String(),
        ], 200);
    }

    protected function resolveSurvey(Training $training): ?Survey
    {
        return Survey::where('is_active', true)
            ->where(function ($q) use ($training) {
                $q->where('training_id', $training->id)->orWhereNull('training_id');
            })
            ->orderByRaw('training_id IS NULL')
            ->first();
    }
}
