<?php

namespace App\Services;

use App\Models\ModuleContent;
use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Stores a scenario illustration on the public disk and points the scenario's
 * image_url at it, removing the image it replaces. Shared by the admin upload
 * endpoint and the bulk import command.
 */
class ScenarioImageService
{
    public const MAX_BYTES = 5 * 1024 * 1024;

    /** @return string The public URL of the stored image. */
    public function attach(ModuleContent $content, int $number, UploadedFile|File $image): string
    {
        $scenarios = $content->scenarios ?? [];
        if (!isset($scenarios[$number - 1])) {
            throw new \OutOfRangeException("Scenario {$number} does not exist for this module.");
        }

        $disk = Storage::disk('public');
        $path = $disk->putFile("curriculum/scenarios/module-{$content->training_module_id}", $image);
        $previous = $scenarios[$number - 1]['image_path'] ?? null;

        $scenarios[$number - 1]['image_url'] = $disk->url($path);
        $scenarios[$number - 1]['image_path'] = $path;
        $content->update(['scenarios' => $scenarios]);

        if ($previous && $previous !== $path) {
            $disk->delete($previous);
        }

        return $scenarios[$number - 1]['image_url'];
    }
}
