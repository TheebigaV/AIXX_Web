<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    /**
     * Return all active products for the public API.
     */
    public function index(): Response
    {
        $products = Product::where('is_active', true)
            ->with('category')
            ->get();
        return response()->json($products);
    }
}
?>
