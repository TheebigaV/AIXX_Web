<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Resources\Guest\Project\ProjectResource;
use App\Http\Resources\Guest\Project\ProjectCollection;
use App\Models\Project;
use App\Services\Guest\ProjectService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

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
     */
    public function index(Request $request): ProjectCollection
    {

        return new ProjectCollection(
            $this->projectService->paginate(
                $request->get('per_page', 15),
                ['id', 'title', 'date', 'slug', 'description','is_active']
            )
        );
    }

    /**
     * @param Request $request
     * @return ProjectCollection
     */
    public function all(Request $request): ProjectCollection
    {
        return new ProjectCollection(
            $this->projectService->all(
                ['id', 'title', 'date', 'slug', 'description','is_active']
            )
        );
    }

    public function getRandom(Request $request): ProjectCollection
    {
        return new ProjectCollection(
            $this->projectService->random(
                $request->get('per_page', 15),
                ['id', 'title', 'date', 'slug', 'description',]
            )
        );
    }

    /**
     * @param string $project
     * @return ProjectResource
     */
    public function show(string $project): ProjectResource
    {
        $project = $this->projectService->findBySlug($project);
        if (!$project) {
            abort(404, 'Project not found');
        }
        return new ProjectResource($project);
    }


}
