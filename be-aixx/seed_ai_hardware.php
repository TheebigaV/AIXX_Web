<?php

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

$categoryName = "Hardware for AI & AI Embedded Hardware";
$category = Category::firstOrCreate(
    ['name' => $categoryName],
    [
        'slug' => Str::slug($categoryName),
        'description' => 'Empower your next-generation projects with our premium hardware solutions. We are proud to sell and support Dell AI computers and Nokia embedded hardware tailored for demanding AI workloads.',
        'is_active' => true,
    ]
);

$product1Name = "Dell AI Computers";
Product::firstOrCreate(
    ['name' => $product1Name],
    [
        'slug' => Str::slug($product1Name),
        'category_id' => $category->id,
        'description' => 'Premium Dell AI computers built for demanding workloads.',
        'is_active' => true,
    ]
);

$product2Name = "Nokia Embedded Hardware";
Product::firstOrCreate(
    ['name' => $product2Name],
    [
        'slug' => Str::slug($product2Name),
        'category_id' => $category->id,
        'description' => 'Rugged and efficient Nokia embedded hardware for AI edge computing.',
        'is_active' => true,
    ]
);

echo "Successfully seeded Category and Products!\n";
