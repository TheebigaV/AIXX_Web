<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Training\StoreTrainingRequest;
use App\Http\Requests\Admin\Training\UpdateTrainingRequest;
use App\Http\Resources\Admin\Training\TrainingResource;
use App\Http\Resources\Admin\Training\TrainingCollection;
use App\Models\Training;
use App\Services\Admin\TrainingService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainingController extends Controller
{
    private TrainingService $trainingService;

    public function __construct(TrainingService $trainingService)
    {
        $this->trainingService = $trainingService;
    }

    public function index(Request $request): TrainingCollection
    {
        $this->authorize('viewany', [Training::class]);
        return new TrainingCollection(
            $this->trainingService->paginate(
                $request->get('per_page', 15),
                ['id', 'name', 'slug', 'type', 'description', 'is_active']
            )
        );
    }

    public function all(Request $request): TrainingCollection
    {
        $this->authorize('viewany', [Training::class]);
        return new TrainingCollection(
            $this->trainingService->all(
                ['id', 'name', 'slug', 'type', 'description', 'is_active']
            )
        );
    }

    public function store(StoreTrainingRequest $request): JsonResponse
    {
        $this->authorize('create', [Training::class]);
        $training = $this->trainingService->create($request->validated());
        return response()->json([
            'message' => 'Training created successfully',
            'training' => new TrainingResource($training),
        ], 201);
    }

    public function show(string $training): TrainingResource
    {
        $trainingModel = $this->trainingService->find($training);
        $this->authorize('view', [$trainingModel]);
        return new TrainingResource($trainingModel);
    }

    public function update(UpdateTrainingRequest $request, string $training): JsonResponse
    {
        $this->authorize('update', [$this->trainingService->find($training)]);
        $this->trainingService->update($training, $request->validated());
        return response()->json([
            'message' => 'Training updated successfully',
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $training = $this->trainingService->find($id);
        $this->authorize('delete', $training);
        $this->trainingService->delete($id);
        return response()->json([
            'message' => 'Training deleted successfully'
        ]);
    }
}
