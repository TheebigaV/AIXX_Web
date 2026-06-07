<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
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

    /**
     * Store a newly created product.
     */
    public function store(Request $request): JsonResponse
    {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category_id' => 'nullable|exists:categories,id',
                'is_active' => 'required|boolean',
                'image' => 'nullable|image|max:2048',
                // Sub product images array
                'sub_product_images' => 'nullable|array',
                'sub_product_images.*' => 'image|max:2048',
            ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            // Create Document entry for main product image
            $filename = basename($path);
            // We'll create the product first without image_path then attach the image
        }

        $validated['slug'] = Str::slug($validated['name']);
        $product = Product::create($validated);

        // Store main image if uploaded
        if (isset($path)) {
            $product->mainProductImage()->create([
                'file_name' => 'products/' . $filename,
                'type' => \App\Types::MainProductImage,
                'user_id' => auth()->id(),
            ]);
        }

        // Store sub product images if any
        if ($request->hasFile('sub_product_images')) {
            foreach ($request->file('sub_product_images') as $file) {
                $subPath = $file->store('products/sub', 'public');
                $subFilename = basename($subPath);
                // Assuming a relationship subProductImages()
                if (method_exists($product, 'subProductImages')) {
                    $product->subProductImages()->create([
                        'file_name' => 'products/sub/' . $subFilename,
                        'type' => \App\Types::SubProductImage,
                        'user_id' => auth()->id(),
                    ]);
                }
            }
        }

        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show($id): JsonResponse
    {
        $product = Product::with(['category', 'mainProductImage', 'subProductImages'])->findOrFail($id);
        return response()->json($product);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::findOrFail($id);
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'category_id' => 'nullable|exists:categories,id',
                'is_active' => 'sometimes|boolean',
                'image' => 'nullable|image|max:2048',
                // Sub images validation
                'sub_product_images' => 'nullable|array',
                'sub_product_images.*' => 'image|max:2048',
            ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $filename = basename($path);
        }

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $product->update($validated);

        // Update main image if new uploaded
        if (isset($path)) {
            // Delete old main image if exists
            $product->mainProductImage()->delete();
            $product->mainProductImage()->create([
                'file_name' => 'products/' . $filename,
                'type' => \App\Types::MainProductImage,
                'user_id' => auth()->id(),
            ]);
        }

        // Add new sub images if provided
        if ($request->hasFile('sub_product_images')) {
            foreach ($request->file('sub_product_images') as $file) {
                $subPath = $file->store('products/sub', 'public');
                $subFilename = basename($subPath);
                if (method_exists($product, 'subProductImages')) {
                    $product->subProductImages()->create([
                        'file_name' => 'products/sub/' . $subFilename,
                        'type' => \App\Types::SubProductImage,
                        'user_id' => auth()->id(),
                    ]);
                }
            }
        }
        return response()->json($product);
    }

    /**
     * Remove the specified product.
     */
    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
?>
