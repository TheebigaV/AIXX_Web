<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Document\DeleteDocumentRequest;
use App\Http\Requests\Admin\Product\StoreProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Http\Requests\Admin\Product\DeleteProductRequest;
use App\Http\Resources\Admin\Product\ProductCollection;
use App\Http\Resources\Admin\Product\ProductResource;
use App\Models\Product;
use App\Services\Admin\ProductService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * @var ProductService
     */
    private ProductService $productService;

    /**
     * @param ProductService $productService
     */
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a paginated list of products.
     *
     * @param Request $request
     * @return ProductCollection
     * @throws AuthorizationException
     */
    public function index(Request $request): ProductCollection
    {
        $this->authorize('viewAny', [Product::class]);

        return new ProductCollection($this->productService->paginate(
            $request->get('per_page', 15),
            [
                'id',
                'name',
                'slug',
                'is_active',
                'category_id',
                'description'
            ]
        ));
    }

    /**
     * Get all products without pagination.
     *
     * @param Request $request
     * @return ProductCollection
     * @throws AuthorizationException
     */
    public function all(Request $request): ProductCollection
    {
        $this->authorize('viewAny', [Product::class]);
        return new ProductCollection($this->productService->all(
            [
                'id',
                'name',
                'slug',
                'is_active',
                'category_id',
                'description'
            ]
        ));
    }

    /**
     * Store a new product.
     *
     * @param StoreProductRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $this->authorize('create', [Product::class]);
        $product = $this->productService->create($request->validated());
        return response()->json([
            'message' => 'Product created successfully',
            'product' => new ProductResource($product),
        ], 201);
    }

    /**
     * Display a specific product.
     *
     * @param string $product
     * @return ProductResource
     * @throws AuthorizationException
     */
    public function show(string $product): ProductResource
    {
        $product = $this->productService->find($product);
        $this->authorize('view', [$product]);
        return new ProductResource($product);
    }

    /**
     * Update a specific product.
     *
     * @param UpdateProductRequest $request
     * @param string $product
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(UpdateProductRequest $request, string $product): JsonResponse
    {
        $existingProduct = $this->productService->find($product);
        $this->authorize('update', [$existingProduct]);
        $this->productService->update($product, $request->validated());

        return response()->json([
            'message' => 'Product updated successfully',
        ], 200);
    }

    /**
     * Delete a specific product.
     *
     * @param DeleteProductRequest $request
     * @param string $product
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function destroy(DeleteProductRequest $request, string $product): JsonResponse
    {
        $existingProduct = $this->productService->find($product);
        $this->authorize('delete', [$existingProduct]);
        $this->productService->delete($product);
        return response()->json([
            'message' => 'Product deleted successfully',
        ], 200);
    }

    /**
     * @param DeleteDocumentRequest $request
     * @param string $produtId
     * @param string $imageId
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function destotyImage(DeleteDocumentRequest $request, string $produtId, string $imageId): JsonResponse
    {
        $produt = $this->productService->find($produtId);
        $this->authorize('update', $produt);
        $this->productService->destotyImage($imageId);
        return response()->json([
            'message' => 'product image deleted successfully'
        ]);
    }

}
