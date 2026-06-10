<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AiCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Artificial Intelligence',
                'description' => 'Advanced AI solutions including machine learning, deep learning, and generative AI models tailored for enterprise applications.',
                'is_active' => true,
            ],
            [
                'name' => 'Quantum Technology',
                'description' => 'Cutting-edge quantum computing infrastructure and services for solving complex optimization and cryptographic problems.',
                'is_active' => true,
            ],
            [
                'name' => 'Cyber security',
                'description' => 'Next-generation AI-powered cybersecurity frameworks to detect, prevent, and mitigate digital threats in real-time.',
                'is_active' => true,
            ],
            [
                'name' => 'Ecommerce and payments',
                'description' => 'Intelligent e-commerce platforms and secure, frictionless digital payment gateways leveraging predictive analytics.',
                'is_active' => true,
            ],
            [
                'name' => 'Autonomous mobility',
                'description' => 'Self-driving algorithms and smart vehicle infrastructure supporting the next generation of autonomous transport.',
                'is_active' => true,
            ],
            [
                'name' => 'Decision support systems',
                'description' => 'Data-driven decision support tools utilizing AI to provide actionable insights for complex business strategies.',
                'is_active' => true,
            ],
            [
                'name' => 'Logistics and transports',
                'description' => 'Smart logistics and transportation management systems optimized by machine learning for maximum efficiency.',
                'is_active' => true,
            ],
            [
                'name' => 'AI Quantum - Supply Chain and Logistics',
                'description' => 'A synergistic approach combining AI and quantum computing to revolutionize global supply chain and logistics networks.',
                'is_active' => true,
            ]
        ];

        foreach ($categories as $category) {
            $category['slug'] = Str::slug($category['name']);
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
