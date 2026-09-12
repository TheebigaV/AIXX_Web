<?php

namespace App\Services;

use App\Models\AiksSnapshot;
use App\Models\Student;

/**
 * Computes the AI Knowledge Scale (AIKS) profile for a student from their
 * assessment performance history.
 */
class AiksService
{
    protected const LEVELS = [
        ['max' => 40, 'label' => 'Novice'],
        ['max' => 60, 'label' => 'Beginner'],
        ['max' => 75, 'label' => 'Intermediate'],
        ['max' => 90, 'label' => 'Advanced'],
        ['max' => 100, 'label' => 'Expert'],
    ];

    public function levelForScore(int $score): string
    {
        foreach (self::LEVELS as $band) {
            if ($score <= $band['max']) {
                return $band['label'];
            }
        }

        return 'Expert';
    }

    /**
     * Record a new AIKS snapshot for a student after a scored event (e.g. a
     * completed assessment attempt), blended with their recent history.
     */
    public function recordSnapshot(Student $student, int $latestScore, string $source, ?int $sourceId = null): AiksSnapshot
    {
        $recentScores = $student->aiksSnapshots()->limit(4)->pluck('score')->push($latestScore);
        $blendedScore = (int) round($recentScores->avg());

        return $student->aiksSnapshots()->create([
            'score' => $blendedScore,
            'level' => $this->levelForScore($blendedScore),
            'breakdown' => [
                'latest_score' => $latestScore,
                'blended_from' => $recentScores->count(),
            ],
            'source' => $source . ($sourceId ? "#{$sourceId}" : ''),
        ]);
    }
}
