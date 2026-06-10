<?php

namespace Database\Seeders;

use App\Models\Training;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AiTrainingSeeder extends Seeder
{
    public function run(): void
    {
        $trainings = [
            // Seminars
            [
                'name' => 'Future of AI in Enterprise',
                'description' => 'A high-level seminar discussing the impact of AI on global markets and enterprise operations over the next decade.',
                'type' => 'seminars',
                'is_active' => true,
            ],
            [
                'name' => 'Quantum Computing Breakthroughs 2026',
                'description' => 'Seminar featuring leading researchers sharing the latest milestones in quantum supremacy.',
                'type' => 'seminars',
                'is_active' => true,
            ],
            
            // Workshops
            [
                'name' => 'Quantum Machine Learning Basics',
                'description' => 'Introduction to the intersection of quantum computing and machine learning. Hands-on exercises included.',
                'type' => 'workshops',
                'is_active' => true,
            ],
            [
                'name' => 'Prompt Engineering for Developers',
                'description' => 'A practical workshop on optimizing prompts for LLMs to build reliable AI-powered applications.',
                'type' => 'workshops',
                'is_active' => true,
            ],

            // Courses
            [
                'name' => 'AI for Business Leaders',
                'description' => 'A comprehensive guide to implementing AI strategies in enterprise environments without writing code.',
                'type' => 'courses',
                'is_active' => true,
            ],
            [
                'name' => 'Generative AI Masterclass',
                'description' => 'Learn how to build, fine-tune, and deploy advanced generative AI models from scratch.',
                'type' => 'courses',
                'is_active' => true,
            ],

            // Skill Training & Certification
            [
                'name' => 'Certified Corporate AI Officer (CCAIO)',
                'description' => 'Executive-level certification for leading AI strategy, governance, and enterprise-wide integration.',
                'type' => 'certification',
                'is_active' => true,
            ],
            [
                'name' => 'Certified AI Ethics & Governance Professional',
                'description' => 'Comprehensive training on implementing ethical frameworks and compliance in AI systems.',
                'type' => 'certification',
                'is_active' => true,
            ],
            [
                'name' => 'Advanced Diploma in Quantum Computing Solutions',
                'description' => 'In-depth program covering quantum algorithms and their real-world applications in business.',
                'type' => 'certification',
                'is_active' => true,
            ],
            [
                'name' => 'Certified Machine Learning Architect (CMLA)',
                'description' => 'Technical certification for designing and scaling robust machine learning pipelines.',
                'type' => 'certification',
                'is_active' => true,
            ],

            // Latest Technology News
            [
                'name' => 'The State of Quantum Security',
                'description' => 'A newsletter detailing how enterprises are preparing for post-quantum cryptography.',
                'type' => 'newsletters',
                'is_active' => true,
            ]
        ];

        foreach ($trainings as $training) {
            $training['slug'] = Str::slug($training['name']);
            Training::firstOrCreate(['slug' => $training['slug']], $training);
        }
    }
}
