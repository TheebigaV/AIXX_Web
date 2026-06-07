<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Return all active products for the public API.
     */
    public function index(): JsonResponse
    {
        $products = Product::with(['category', 'mainProductImage'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'category_id' => $product->category_id,
                    'is_active' => $product->is_active,
                    'main_product_image' => $product->main_product_image,
                    'sub_product_images' => $product->sub_product_images,
                    'created_at' => $product->created_at,
                    'updated_at' => $product->updated_at,
                ];
            });
        return response()->json(['data' => $products]);
    }

    /**
     * Get product by slug
     */
    public function show($slug): JsonResponse
    {
        $product = Product::with(['category', 'mainProductImage'])
            ->where('slug', $slug)
            ->first();

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'category_id' => $product->category_id,
            'is_active' => $product->is_active,
            'main_product_image' => $product->main_product_image,
            'sub_product_images' => $product->sub_product_images,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ]);
    }
}
?>
