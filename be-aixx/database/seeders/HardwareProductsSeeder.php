<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class HardwareProductsSeeder extends Seeder
{
    public function run()
    {
        // Create or get the category
        $category = Category::firstOrCreate(
            ['name' => 'Hardware for AI & AI Embedded Hardware'],
            ['slug' => Str::slug('Hardware for AI & AI Embedded Hardware'), 'description' => 'AI hardware integration services', 'is_active' => true]
        );

        // Dell AI Computers product
        Product::firstOrCreate(
            ['name' => 'Dell AI Computers'],
            [
                'slug' => Str::slug('Dell AI Computers'),
                'category_id' => $category->id,
                'description' => 'High‑performance Dell workstations optimized for AI workloads.',
                'is_active' => true,
                'image_path' => '/images/products/dell_ai.jpg',
            ]
        );

        // Nokia Embedded Hardware product
        Product::firstOrCreate(
            ['name' => 'Nokia Embedded Hardware'],
            [
                'slug' => Str::slug('Nokia Embedded Hardware'),
                'category_id' => $category->id,
                'description' => 'Rugged Nokia edge devices for AI‑enabled industrial automation.',
                'is_active' => true,
                'image_path' => '/images/products/nokia_ai.jpg',
            ]
        );
    }
}
