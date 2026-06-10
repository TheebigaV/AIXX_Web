<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AiProductSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('slug', 'ai-cloud-infrastructure')->first();
        $categoryId = $category ? $category->id : null;

        $products = [
            [
                'name' => 'AIXX Tensor Node V1',
                'description' => 'Enterprise-grade server node equipped with the latest Tensor Processing Units.',
                'is_active' => true,
                'category_id' => $categoryId,
            ],
            [
                'name' => 'Quantum SDK Pro',
                'description' => 'Software development kit for building quantum-ready applications.',
                'is_active' => true,
                'category_id' => $categoryId,
            ],
            [
                'name' => 'Neural Edge Gateway',
                'description' => 'High-efficiency edge gateway designed for low-latency AI inference.',
                'is_active' => true,
                'category_id' => $categoryId,
            ]
        ];

        foreach ($products as $product) {
            $product['slug'] = Str::slug($product['name']);
            Product::firstOrCreate(['slug' => $product['slug']], $product);
        }
    }
}
