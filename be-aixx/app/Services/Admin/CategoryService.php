<?php

namespace App\Services\Admin;

use App\Models\Banner;
use App\Models\Category;
use App\Repositories\Admin\CategoryRepository;
use App\Types;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

/**
 *
 */
class CategoryService
{
    /**
     * @var CategoryRepository
     */
    private CategoryRepository $categoryRepository;
    private DocumentService $documentService;

    /**
     * @param CategoryRepository $categoryRepository
     * @param DocumentService $documentService
     */
    public function __construct(CategoryRepository $categoryRepository, DocumentService $documentService)
    {
        $this->categoryRepository = $categoryRepository;
        $this->documentService = $documentService;
    }

    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $itemPerPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->categoryRepository->paginate($itemPerPage, $columns);
    }

    /**
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->categoryRepository->all($columns);
    }

    /**
     * @param array $data
     * @return Category
     */
    public function create(array $data): Category
    {
        $data['slug'] = Str::slug($data['name']);
        $category = $this->categoryRepository->create($data);
        $data['type'] = Types::Image;
        $this->documentService->create(Category::class, $category->id, $data);
        return $category;
    }

    /**
     * @param string $id
     * @return Category|null
     */
    public function find(string $id): ?Category
    {
        return $this->categoryRepository->find($id);
    }

    /**
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        if (isset($data['image'])) {
            $banner = $this->categoryRepository->find($id);
            $banner->image->delete();
            $data['type'] = Types::Image;
            $this->documentService->create(Category::class, $banner->id, $data);
        }
        $data['slug'] = Str::slug($data['name']);
        return $this->categoryRepository->update($id, $data);
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->categoryRepository->delete($id);
    }

}
