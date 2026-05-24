<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Document\DeleteDocumentRequest;
use App\Http\Requests\Admin\Project\StoreProjectRequest;
use App\Http\Requests\Admin\Project\UpdateProjectRequest;
use App\Http\Resources\Admin\Project\ProjectCollection;
use App\Http\Resources\Admin\Project\ProjectResource;
use App\Models\Project;
use App\Services\Admin\ProjectService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 *
 */
class ProjectController extends Controller
{
    /**
     * @var ProjectService
     */
    private ProjectService $projectService;

    /**
     * @param ProjectService $projectService
     */
    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * @param Request $request
     * @return ProjectCollection
     * @throws AuthorizationException
     */
    public function index(Request $request): ProjectCollection
    {
        $this->authorize('viewAny', Project::class);
        return new ProjectCollection(
            $this->projectService->paginate(
                $request->get('per_page', 15),
                ['id', 'title', 'date', 'slug', 'description', 'is_active']
            )
        );
    }

    /**
     * @param Request $request
     * @return ProjectCollection
     * @throws AuthorizationException
     */
    public function all(Request $request): ProjectCollection
    {
        $this->authorize('viewAny', Project::class);
        return new ProjectCollection(
            $this->projectService->all(
                ['id', 'date', 'title', 'slug', 'description', 'is_active']
            )
        );
    }


    /**
     * @param StoreProjectRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $this->authorize('create', Project::class);
        $project = $this->projectService->create($request->validated());
        return response()->json([
            'message' => 'Project created successfully',
            'banner' => new ProjectResource($project),
        ], 201);
    }

    /**
     * @param string $project
     * @return ProjectResource
     * @throws AuthorizationException
     */
    public function show(string $project)
    {

        $project = $this->projectService->find($project);
        $this->authorize('view', $project);
        return new ProjectResource($project);
    }

    /**
     * @param UpdateProjectRequest $request
     * @param string $id
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(UpdateProjectRequest $request, string $id): JsonResponse
    {

        $project = $this->projectService->find($id);
        $this->authorize('update', $project);
        $this->projectService->update($id, $request->validated());
        return response()->json([
            'message' => 'Project updated successfully'
        ]);

    }

    /**
     * @param string $id
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function destroy(string $id): JsonResponse
    {
        $project = $this->projectService->find($id);
        $this->authorize('delete', $project);
        $this->projectService->delete($id);
        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }

    /**
     * @param DeleteDocumentRequest $request
     * @param string $projectId
     * @param string $imageId
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function destotyImage(DeleteDocumentRequest $request, string $projectId, string $imageId): JsonResponse
    {
        $project = $this->projectService->find($projectId);
        $this->authorize('update', $project);
        $this->projectService->destotyImage($imageId);
        return response()->json([
            'message' => 'Project image deleted successfully'
        ]);
    }
}
