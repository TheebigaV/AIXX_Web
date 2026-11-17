<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\CourseProfile;
use App\Models\ModuleContent;
use App\Models\QuestionFeedback;
use App\Models\TrainingQuestion;
use App\Services\LearnerProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Content languages and learner feedback on questions (feeds question analytics). */
class LearningContentController extends Controller
{
    public const LANGUAGE_NAMES = [
        'en' => 'English', 'si' => 'Sinhala', 'ta' => 'Tamil', 'ms' => 'Malay', 'id' => 'Indonesian',
        'th' => 'Thai', 'vi' => 'Vietnamese', 'zh' => 'Chinese', 'hi' => 'Hindi', 'ar' => 'Arabic',
    ];

    public const FEEDBACK_TYPES = ['incorrect_answer', 'unclear_question', 'typo', 'outdated', 'too_difficult', 'other'];

    public function __construct(protected LearnerProgressService $progress)
    {
    }

    /** GET /api/languages?course={slug} — Languages that curriculum content is available in. */
    public function languages(Request $request): JsonResponse
    {
        $slug = $request->query('course');
        $training = $slug ? $this->progress->findCourse($slug) : null;
        if ($slug && !$training) {
            return response()->json(['success' => false, 'message' => 'Course not found.'], 404);
        }

        $codes = CourseProfile::when($training, fn ($q) => $q->where('training_id', $training->id))->pluck('lang')
            ->merge(ModuleContent::when($training, fn ($q) => $q->whereHas('module', fn ($m) => $m->where('training_id', $training->id)))->pluck('lang'))
            ->push('en')
            ->unique()
            ->sort()
            ->values();

        return response()->json([
            'success' => true,
            'default' => 'en',
            'data' => $codes->map(fn ($c) => ['code' => $c, 'name' => self::LANGUAGE_NAMES[$c] ?? strtoupper($c)])->values(),
            'note' => 'Pass ?lang={code} to curriculum endpoints; missing translations fall back to English. Key aviation terms stay in English.',
        ]);
    }

    /** POST /api/questions/{id}/feedback — Report a problem with an MCQ. */
    public function questionFeedback(int $id, Request $request): JsonResponse
    {
        $question = TrainingQuestion::find($id);
        if (!$question) {
            return response()->json(['success' => false, 'message' => 'Question not found.'], 404);
        }

        $validated = $request->validate([
            'type' => 'required|string|in:' . implode(',', self::FEEDBACK_TYPES),
            'comment' => 'nullable|string|max:2000',
        ]);

        $feedback = QuestionFeedback::create([
            'student_id' => $request->user()->id,
            'training_question_id' => $question->id,
            'type' => $validated['type'],
            'comment' => $validated['comment'] ?? null,
            'status' => 'open',
        ]);

        return response()->json(['success' => true, 'message' => 'Thanks — your feedback was sent to the content team.', 'data' => [
            'id' => $feedback->id,
            'question_id' => $question->id,
            'type' => $feedback->type,
            'status' => $feedback->status,
        ]], 201);
    }
}
