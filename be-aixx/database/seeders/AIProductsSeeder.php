<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\Document;
use App\Types;
use Illuminate\Support\Str;

class AIProductsSeeder extends Seeder
{
    public function run()
    {
        // Ensure a base category exists for these products
        $category = Category::firstOrCreate(
            ['name' => 'AI Hardware & Solutions'],
            ['slug' => Str::slug('AI Hardware & Solutions'), 'description' => 'Advanced AI hardware and computing solutions.', 'is_active' => true]
        );

        $products = [
            [
                'name' => 'AI Hardware Integration',
                'description' => 'We design and implement AI-driven solutions by integrating advanced hardware components to improve performance, scalability, and efficiency.',
                'image' => 'products/ai_hardware_integration.png'
            ],
            [
                'name' => 'AI Computing Systems',
                'description' => 'High-performance AI workstations and enterprise computing platforms optimized for machine learning, data analytics, and intelligent automation.',
                'image' => 'products/ai_computing_systems.png'
            ],
            [
                'name' => 'Hardware Optimization',
                'description' => 'Custom hardware enhancements including memory (RAM), storage (SSD), and specialized processing components to support AI applications.',
                'image' => 'products/hardware_optimization.png'
            ],
            [
                'name' => 'Edge AI Solutions',
                'description' => 'Smart devices and embedded AI systems capable of real-time data processing and intelligent decision-making.',
                'image' => 'products/edge_ai_solutions.png'
            ],
            [
                'name' => 'Emerging Technologies',
                'description' => 'Research and implementation of next-generation computing technologies, including advanced AI hardware architectures and innovative processing solutions.',
                'image' => 'products/emerging_technologies.png'
            ],
        ];

        foreach ($products as $item) {
            $product = Product::updateOrCreate(
                ['name' => $item['name']],
                [
                    'slug' => Str::slug($item['name']),
                    'category_id' => $category->id,
                    'description' => $item['description'],
                    'is_active' => true,
                ]
            );

            // Create or update the main product image
            $product->mainProductImage()->updateOrCreate(
                ['type' => Types::MainProductImage],
                [
                    'file_name' => $item['image'],
                    'type' => Types::MainProductImage,
                    'user_id' => 1,
                ]
            );
        }
    }
}
