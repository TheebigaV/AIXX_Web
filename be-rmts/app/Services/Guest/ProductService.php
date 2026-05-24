<?php

namespace App\Services\Guest;

use App\Models\Product;
use App\Repositories\Guest\ProductRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

/**
 *
 */
class ProductService
{
    /**
     * @var ProductRepository
     */
    private ProductRepository $productRepository;

    /**
     * @param ProductRepository $productRepository
     */
    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    // Remove the all() method entirely, or modify it:

public function all(array $columns = ['*']): Collection
{
    // This will apply filters and return all results (not paginated)
    return $this->productRepository->filters($columns);
    Log::info("columns : ", ['columns ' => $columns]);
}

public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
{
    return $this->productRepository->paginate($perPage, $columns);
}

    public function getRandom(int $count, array $columns = ['*']): Collection
    {
        return $this->productRepository->getRandom($count, $columns);
    }

    /**
     * @param string $id
     * @return Product|null
     */
    public function find(string $id): ?Product
    {
        return $this->productRepository->find($id);
    }

    /**
     * @param string $slug
     * @return Product|null
     */
    public function findBySlug(string $slug): ?Product
    {
        return $this->productRepository->findBy('slug', $slug);
    }
}
