<?php
namespace App\Services\Guest;

use App\Models\Project;
use App\Repositories\Guest\ProjectRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

/**
 *
 */
class ProjectService
{
    /**
     * @var ProjectRepository
     */
    private ProjectRepository $projectRepository;

    /**
     * @param ProjectRepository $projectRepository
     */
    public function __construct(ProjectRepository $projectRepository)
    {
        $this->projectRepository = $projectRepository;
    }

    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $itemPerPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->projectRepository->paginate($itemPerPage, $columns);
    }

    /**
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->projectRepository->all($columns);
    }

    /**
     * @param string $id
     * @return Project|null
     */
    public function find(string $id): ?Project
    {
        return $this->projectRepository->find($id);
    }

    /**
     * @param string $slug
     * @return Project|null
     */
    public function findBySlug(string $slug): ?Project
    {
        return $this->projectRepository->findBy('slug', $slug);
    }

    /**
     * @param int $count
     * @param array $columns
     * @return Collection
     */
    public function random(int $count = 3, array $columns = ['*']): Collection
    {
        return $this->projectRepository->getRandom($count, $columns);
    }


}
