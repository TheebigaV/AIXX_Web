<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with(['category', 'mainProductImage', 'subProductImages'])
            ->orderBy('id', 'desc')
            ->paginate(request()->get('per_page', 10));

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
            'sub_product_images' => 'nullable|array',
            'sub_product_images.*' => 'image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $image = $validated['image'] ?? null;
        unset($validated['image']);

        $product = Product::create($validated);

        // Store main image if uploaded
        if ($image && $request->hasFile('image')) {
            try {
                $path = $image->store('products', 'public');

                // Delete existing main image if any
                $product->mainProductImage()->delete();

                // Use morphOne relationship directly
                \App\Models\Document::create([
                    'file_name' => $path,
                    'type' => \App\Types::MainProductImage,
                    'user_id' => auth()->id(),
                    'documentable_type' => get_class($product),
                    'documentable_id' => $product->id,
                ]);
            } catch (\Exception $e) {
                \Log::error('Failed to store main product image: ' . $e->getMessage());
            }
        }

        // Store sub product images if any
        if ($request->hasFile('sub_product_images')) {
            try {
                foreach ($request->file('sub_product_images') as $file) {
                    $subPath = $file->store('products/sub', 'public');

                    \App\Models\Document::create([
                        'file_name' => $subPath,
                        'type' => \App\Types::SubProductImage,
                        'user_id' => auth()->id(),
                        'documentable_type' => get_class($product),
                        'documentable_id' => $product->id,
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('Failed to store sub product images: ' . $e->getMessage());
            }
        }

        return response()->json($product, 201);
    }

    public function show(string $id): JsonResponse
    {
        $product = Product::with(['category', 'mainProductImage', 'subProductImages'])->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'sometimes|boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $image = $validated['image'] ?? null;
        unset($validated['image']);

        $product->update($validated);

        if ($image) {
            try {
                $path = $image->store('products', 'public');

                // Delete existing main image
                $product->mainProductImage()->delete();

                // Create new image
                \App\Models\Document::create([
                    'file_name' => $path,
                    'type' => \App\Types::MainProductImage,
                    'user_id' => auth()->id(),
                    'documentable_type' => get_class($product),
                    'documentable_id' => $product->id,
                ]);
            } catch (\Exception $e) {
                \Log::error('Failed to update product image: ' . $e->getMessage());
            }
        }

        return response()->json($product);
    }

    public function destroy(string $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
