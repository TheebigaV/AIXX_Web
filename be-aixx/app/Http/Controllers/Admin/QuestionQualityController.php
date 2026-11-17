<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificationAttempt;
use App\Models\CertificationAttemptItem;
use App\Models\QuestionFeedback;
use App\Models\Training;
use App\Models\TrainingQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Content governance: review learner feedback on questions and monitor item
 * performance (difficulty, discrimination, feedback rate) from certification attempts.
 */
class QuestionQualityController extends Controller
{
    public const STATUSES = ['open', 'reviewed', 'resolved', 'dismissed'];

    /** GET /api/admin/question-feedback?status=&type=&training_id= */
    public function feedback(Request $request): JsonResponse
    {
        $page = QuestionFeedback::query()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->query('status')))
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->query('type')))
            ->when($request->filled('training_id'), fn ($q) => $q->whereIn(
                'training_question_id',
                TrainingQuestion::whereHas('module', fn ($m) => $m->where('training_id', $request->integer('training_id')))->select('id')
            ))
            ->latest('id')
            ->paginate((int) $request->get('per_page', 20));

        $questions = TrainingQuestion::with('module:id,training_id,module_index,title')
            ->whereIn('id', $page->getCollection()->pluck('training_question_id'))->get()->keyBy('id');
        $students = \App\Models\Student::whereIn('id', $page->getCollection()->pluck('student_id'))->get(['id', 'full_name', 'registration_id'])->keyBy('id');

        $page->setCollection($page->getCollection()->map(fn (QuestionFeedback $f) => [
            'id' => $f->id,
            'type' => $f->type,
            'comment' => $f->comment,
            'status' => $f->status,
            'created_at' => $f->created_at?->toIso8601String(),
            'student' => $students->get($f->student_id)?->only(['id', 'full_name', 'registration_id']),
            'question' => ($q = $questions->get($f->training_question_id)) ? [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $q->options,
                'correct_answer' => $q->correct_answer,
                'competency_tag' => $q->competency_tag,
                'training_id' => $q->module?->training_id,
                'module_index' => $q->module?->module_index,
            ] : null,
        ]));

        return response()->json(['success' => true, 'data' => $page]);
    }

    /** PATCH /api/admin/question-feedback/{id} — {status: open|reviewed|resolved|dismissed} */
    public function updateFeedback(int $id, Request $request): JsonResponse
    {
        $feedback = QuestionFeedback::findOrFail($id);
        $data = $request->validate(['status' => 'required|in:' . implode(',', self::STATUSES)]);
        $feedback->update($data);

        return response()->json(['success' => true, 'data' => $feedback->only(['id', 'type', 'comment', 'status'])]);
    }

    /**
     * GET /api/admin/trainings/{id}/question-analytics — Per-question statistics from completed
     * certification attempts. Difficulty = share answered correctly; discrimination = correct rate in the
     * top 27% of attempts minus the bottom 27%. Flags highlight items to review.
     */
    public function analytics(int $id): JsonResponse
    {
        $training = Training::findOrFail($id);

        $attempts = CertificationAttempt::where('training_id', $training->id)->where('status', 'completed')->orderByDesc('score')->get(['id', 'score']);
        $groupSize = (int) max(1, round($attempts->count() * 0.27));
        $upper = $attempts->take($groupSize)->pluck('id');
        $lower = $attempts->reverse()->take($groupSize)->pluck('id');

        $items = CertificationAttemptItem::whereIn('certification_attempt_id', $attempts->pluck('id'))->get(['certification_attempt_id', 'training_question_id', 'is_correct']);
        $byQuestion = $items->groupBy('training_question_id');
        $feedback = QuestionFeedback::selectRaw('training_question_id, count(*) as total, sum(case when status = ? then 1 else 0 end) as open_count', ['open'])
            ->groupBy('training_question_id')->get()->keyBy('training_question_id');

        $rate = fn ($rows) => $rows->count() ? round($rows->where('is_correct', true)->count() / $rows->count(), 2) : null;

        $questions = TrainingQuestion::whereHas('module', fn ($q) => $q->where('training_id', $training->id))
            ->with('module:id,module_index')
            ->get()
            ->map(function (TrainingQuestion $q) use ($byQuestion, $upper, $lower, $feedback, $rate, $attempts) {
                $rows = $byQuestion->get($q->id, collect());
                $difficulty = $rate($rows);
                $upperRate = $rate($rows->whereIn('certification_attempt_id', $upper));
                $lowerRate = $rate($rows->whereIn('certification_attempt_id', $lower));
                $discrimination = ($upperRate !== null && $lowerRate !== null && $attempts->count() >= 2) ? round($upperRate - $lowerRate, 2) : null;
                $fb = $feedback->get($q->id);

                $flags = [];
                if ($difficulty !== null && $rows->count() >= 5) {
                    if ($difficulty >= 0.9) $flags[] = 'too_easy';
                    if ($difficulty <= 0.3) $flags[] = 'too_hard';
                    if ($discrimination !== null && $discrimination < 0.2) $flags[] = 'low_discrimination';
                }
                if ($fb && $fb->open_count > 0) $flags[] = 'open_feedback';

                return [
                    'question_id' => $q->id,
                    'module_index' => $q->module->module_index,
                    'question' => $q->question,
                    'competency_tag' => $q->competency_tag,
                    'times_used' => $rows->count(),
                    'difficulty' => $difficulty,
                    'discrimination' => $discrimination,
                    'feedback_count' => (int) ($fb->total ?? 0),
                    'open_feedback_count' => (int) ($fb->open_count ?? 0),
                    'flags' => $flags,
                ];
            })
            ->sortBy([['module_index', 'asc'], ['question_id', 'asc']])
            ->values();

        return response()->json(['success' => true, 'data' => [
            'training' => ['id' => $training->id, 'name' => $training->name, 'slug' => $training->slug],
            'completed_attempts' => $attempts->count(),
            'average_score' => $attempts->count() ? (int) round($attempts->avg('score')) : null,
            'pass_rate' => $attempts->count() ? (int) round(CertificationAttempt::whereIn('id', $attempts->pluck('id'))->where('passed', true)->count() * 100 / $attempts->count()) : null,
            'flagged_questions' => $questions->filter(fn ($q) => $q['flags'])->count(),
            'questions' => $questions,
        ]]);
    }
}
