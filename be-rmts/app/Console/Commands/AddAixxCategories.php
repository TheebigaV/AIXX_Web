<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Category;
use Illuminate\Support\Str;

class AddAixxCategories extends Command
{
    protected $signature = 'app:add-aixx-categories';
    protected $description = 'Add new AIXX categories';

    public function handle()
    {
        $categories = [
            [
                'name' => 'Artificial Intelligence',
                'description' => 'Next-generation artificial intelligence solutions powering automation, decision-making, and intelligent processes.',
            ],
            [
                'name' => 'Quantum Technology',
                'description' => 'Harnessing quantum mechanics to deliver high-performance computing, security, and next-generation processing.',
            ],
            [
                'name' => 'Cyber Security',
                'description' => 'Ensuring robust threat detection, digital asset protection, and cyber-resilience across operations.',
            ],
            [
                'name' => 'E-commerce & Payments',
                'description' => 'Sleek and secure digital commerce, transaction processing, and payment system integration.',
            ],
            [
                'name' => 'Autonomous Mobility',
                'description' => 'AI-driven autonomous navigation, vehicle intelligence, and smart transport solutions.',
            ],
            [
                'name' => 'Airport Technology',
                'description' => 'Smart aviation systems, baggage tracking, check-in automation, and optimized airport terminal operations.',
            ],
            [
                'name' => 'Decision Support Systems',
                'description' => 'Analytical and data-driven systems that help organizational leaders make intelligent decisions in real time.',
            ],
            [
                'name' => 'Logistics & Transport',
                'description' => 'Intelligent routing, fleet management, and supply chain logistics powered by advanced analytics.',
            ],
            [
                'name' => 'AI & Quantum - Supply Chain & Logistics',
                'description' => 'Advanced AI and Quantum solutions optimizing supply chain operations, logistics routing, and predictive inventory management.',
            ],
            [
                'name' => 'AI & Quantum - Data Science & Analytics',
                'description' => 'Next-generation data science and analytics powered by AI and quantum computing for unparalleled business insights.',
            ],
            [
                'name' => 'AI & Quantum - Managing Ageing Population',
                'description' => 'Innovative technologies leveraging AI and Quantum systems to improve healthcare, mobility, and support for the ageing population.',
            ],
            [
                'name' => 'Seminars, Workshops, Courses, Skill Training & Certification',
                'description' => "• Applying for above\n• Content\n• Trainers\n• Fee\n• Job Opportunities & Application Submission",
            ],
            [
                'name' => 'News Letters',
                'description' => "• Trending\n• Latest Innovation\n• Use Case",
            ]
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'description' => $cat['description'],
                    'is_active' => true,
                ]
            );
        }

        $this->info('Categories added successfully.');
    }
}
