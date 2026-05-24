<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Resources\Guest\Product\ProductCollection;
use App\Http\Resources\Guest\Product\ProductResource;
use App\Models\Product;
use App\Services\Guest\ProductService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

/**
 *
 */
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
     */
    public function index(Request $request): ProductCollection
{
    \Log::info('ProductController index called with parameters:', $request->all());

    $products = $this->productService->paginate(
        $request->get('per_page', 15),
        [
            'id',
            'name',
            'slug',
            'is_active',
            'category_id',
            'description'
        ]
    );

    \Log::info('ProductController returning products count: ' . $products->count());
    return new ProductCollection($products);
}
    /**
     * Get all products without pagination.
     *
     * @param Request $request
     * @return ProductCollection
     */
    public function all(Request $request): ProductCollection
    {
        return new ProductCollection($this->productService->all(
            [
                'id',
                'name',
                'slug',
                'is_active',
                'category_id',
                'description'
            ],
            $request // ← PASS THE REQUEST TO THE SERVICE
        ));
    }

    /**
     * @param Request $request
     * @param int $count
     * @return ProductCollection
     */
    public function getRandom(Request $request, int $count): ProductCollection
    {
        return new ProductCollection(
            $this->productService->getRandom(
                $count,
                [ 'id',
                    'name',
                    'slug',
                    'is_active',
                    'category_id',
                    'description']
            )
        );
    }

    /**
     * @param string $product
     * @return ProductResource
     */
    public function show(string $product): ProductResource
    {
        $product = $this->productService->findBySlug($product);

        if (!$product) {
            abort(404, 'Product not found');
        }
        return new ProductResource($product);
    }
}
