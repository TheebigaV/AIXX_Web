<?php

namespace App\Services\Admin;

use App\Models\Product;
use App\Repositories\Admin\ProductRepository;
use App\Types;
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
    private DocumentService $documentService;

    /**
     * @param ProductRepository $productRepository
     * @param DocumentService $documentService
     */
    public function __construct(ProductRepository $productRepository, DocumentService $documentService)
    {
        $this->productRepository = $productRepository;
        $this->documentService = $documentService;
    }

    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $itemPerPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->productRepository->paginate($itemPerPage, $columns);
    }

    /**
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->productRepository->all($columns);
    }

    /**
     * @param array $data
     * @return Product
     */
    public function create(array $data): Product
    {
        $data['slug'] = Str::slug($data['name']);
        $product = $this->productRepository->create($data);
        if ($data['main_product_image']) {
            $data['type'] = Types::MainProdctImage;
            $data['image'] = $data['main_product_image'];
            $this->documentService->create(Product::class, $product->id, $data);
        }
        if (!empty($data['sub_product_images']) && is_array($data['sub_product_images'])) {
            foreach ($data['sub_product_images'] as $image) {
                $subData = [
                    'type' => Types::SubProductImage, // corrected spelling
                    Types::SubProductImage => $image
                ];
                $this->documentService->create(Product::class, $product->id, $subData);
            }
        }
        return $product;
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
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        $data['slug'] = Str::slug($data['name']);
        if (isset($data['main_product_image'])) {
            $product = $this->productRepository->find($id);
            $product->mainProductImage->delete();
            $data['type'] = Types::MainProdctImage;
            $data['image'] = $data['main_product_image'];
            $this->documentService->create(Product::class, $id, $data);
        }
        if (!empty($data['sub_product_images']) && is_array($data['sub_product_images'])) {
            foreach ($data['sub_product_images'] as $image) {
                $subData = [
                    'type' => Types::SubProductImage, // corrected spelling
                    Types::SubProductImage => $image
                ];
                $this->documentService->create(Product::class, $id, $subData);
            }
        }

        return $this->productRepository->update($id, $data);
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->productRepository->delete($id); // forceDelete inside repository
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
