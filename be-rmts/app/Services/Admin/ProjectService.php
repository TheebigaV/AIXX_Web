<?php

namespace App\Services\Admin;

use App\Models\Product;
use App\Models\Project;
use App\Repositories\Admin\ProjectRepository;
use App\Types;
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
     * @var DocumentService
     */
    private DocumentService $documentService;

    /**
     * @param ProjectRepository $projectRepository
     * @param DocumentService $documentService
     */
    public function __construct(ProjectRepository $projectRepository, DocumentService $documentService)
    {
        $this->projectRepository = $projectRepository;
        $this->documentService = $documentService;
    }


    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function paginate(int $itemPerPage = 15, array $columns = ['*']): \Illuminate\Pagination\LengthAwarePaginator
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
     * @param array $data
     * @return Project
     */
    public function create(array $data): Project
    {

        $data['slug'] = Str::slug($data['title']);
        $project = $this->projectRepository->create($data);
        if ($data['thumbnail_image']) {
            $data['type'] = Types::ThumbNailImage;
            $data['image'] = $data['thumbnail_image'];
            $this->documentService->create(Project::class, $project->id, $data);
        }
        if(!empty($data['images'])){
            foreach ($data['images'] as $image) {
                $data['type'] = Types::Image;
                $data['image'] = $image;
                $this->documentService->create(Project::class, $project->id, $data);
            }
        }

        return $project;
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
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        $data['slug'] = Str::slug($data['title']);
        $project =$this->projectRepository->update($id, $data);
        if (isset($data['thumbnail_image'])) {
            $product = $this->projectRepository->find($id);
            $product->mainProductImage->delete();
            $subData = [
                'type' => Types::ThumbNailImage,
                Types::ThumbNailImage => $data['thumbnail_image']
            ];
            $this->documentService->create(Project::class, $id, $subData);
        }
        if(!empty($data['images'])){
            foreach ($data['images'] as $image) {
                $data['type'] = Types::Image;
                $data['image'] = $image;
                $this->documentService->create(Project::class, $id, $data);
            }
        }
        return $project;
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->projectRepository->delete($id);
    }

    /**
     * @param string $id
     * @return bool
     */
    public function destotyImage(string $id): bool
    {
        return $this->documentService->delete($id);
    }

}
