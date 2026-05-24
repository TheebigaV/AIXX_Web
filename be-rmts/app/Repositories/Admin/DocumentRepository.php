<?php

namespace App\Repositories\Admin;

use App\Models\Document;
use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentRepository extends BaseRepository
{
    /**
     * @param Document $model
     */
    public function __construct(Document $model)
    {
        $this->setModel($model);
    }

    /**
     * @param array $data
     * @return Document
     */
    public function create(array $data): Document
    {
        $document = $this->model->create([
            'documentable_type' => $data['class'],
            'documentable_id' => $data['id'],
            'user_id' => $data['user_id'],
            'type' => $data['type'],
        ]);

        $model = $data['model'];
        $type = $data['type'];
        $file = $data[$type];

        $key = Str::plural($type) . '/' . Str::plural($model) . '/' . $data['id'] . '_' . round(microtime(true) * 1000) . '.' . $file->getClientOriginalExtension();

        $document->file_name = $key;
        $document->save();

        $result = Storage::disk('public')->put($key, file_get_contents($file));
        if ($result === false) {
            Log::error('Public storage put failed', ['key' => $key, 'file' => $file]);
        } else {
            Log::info('Public storage put successful', ['key' => $key]);
        }
        return $document;
    }

}
