<?php

namespace App\Services\Admin;

use App\Models\Training;
use App\Repositories\Admin\TrainingRepository;
use App\Types;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class TrainingService
{
    private TrainingRepository $trainingRepository;
    private DocumentService $documentService;

    public function __construct(TrainingRepository $trainingRepository, DocumentService $documentService)
    {
        $this->trainingRepository = $trainingRepository;
        $this->documentService = $documentService;
    }

    public function paginate(int $itemPerPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->trainingRepository->paginate($itemPerPage, $columns);
    }

    public function all(array $columns = ['*']): Collection
    {
        return $this->trainingRepository->all($columns);
    }

    public function create(array $data): Training
    {
        $data['slug'] = Str::slug($data['name']);
        $training = $this->trainingRepository->create($data);
        if (isset($data['image'])) {
            $data['type'] = Types::Image;
            $this->documentService->create(Training::class, $training->id, $data);
        }
        return $training;
    }

    public function find(string $id): ?Training
    {
        return $this->trainingRepository->find($id);
    }

    public function update(string $id, array $data): bool
    {
        if (isset($data['image'])) {
            $training = $this->trainingRepository->find($id);
            if ($training->image) {
                $training->image->delete();
            }
            $data['type'] = Types::Image;
            $this->documentService->create(Training::class, $training->id, $data);
        }
        $data['slug'] = Str::slug($data['name']);
        return $this->trainingRepository->update($id, $data);
    }

    public function delete(string $id): bool
    {
        return $this->trainingRepository->delete($id);
    }
}
