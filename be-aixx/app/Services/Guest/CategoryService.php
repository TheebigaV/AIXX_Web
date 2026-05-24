<?php

namespace App\Services\Guest;

use App\Models\Category;
use App\Repositories\Guest\CategoryRepository;
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

    /**
     * @param CategoryRepository $categoryRepository
     */
    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
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
     * @param string $id
     * @return Category|null
     */
    public function find(string $id): ?Category
    {
        return $this->categoryRepository->find($id);
    }

    /**
     * @param string $slug
     * @return Category|null
     */
    public function findBySlug(string $slug): ?Category
    {
        return $this->categoryRepository->findBy('slug', $slug);
    }
}
