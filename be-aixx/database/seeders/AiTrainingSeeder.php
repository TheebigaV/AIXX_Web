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

            // E-Learning Modules
            [
                'name' => 'Enterprise AI & Productivity',
                'description' => 'Master enterprise-grade AI tools to optimize workflows and drive organizational efficiency.',
                'type' => 'elearning',
                'duration' => '2h 15m',
                'sub_modules' => "4 Topics: Copilot, ChatGPT Enterprise, Workflow Solutions, Automation",
                'is_active' => true,
            ],
            [
                'name' => 'Generative AI Masterclass',
                'description' => 'Comprehensive deep dive into LLMs, advanced prompt engineering, and GenAI applications.',
                'type' => 'elearning',
                'duration' => '4h 30m',
                'sub_modules' => "6 Topics: LLMs, OpenAI APIs, Claude, Midjourney, Advanced Prompting, RAG Systems",
                'is_active' => true,
            ],
            [
                'name' => 'Machine Learning Foundations',
                'description' => 'Understand the architectural concepts of ML and neural networks for real-world modeling.',
                'type' => 'elearning',
                'duration' => '3h 45m',
                'sub_modules' => "5 Topics: TensorFlow, PyTorch, Scikit-learn, Neural Networks, Predictive Modeling",
                'is_active' => true,
            ],

            // Free Certificates & Knowledge Programs
            [
                'name' => 'Free AI Knowledge Certificate Program',
                'description' => 'Global AI Literacy initiative offering a 100% free online assessment, study materials, and verifiable digital certificate.',
                'type' => 'free_courses',
                'duration' => 'Self-Paced (20 Questions Assessment)',
                'sub_modules' => "Module 1: Prompt Engineering & LLM Architecture\nModule 2: Generative Models & RAG Systems\nModule 3: AI Automation & Enterprise Workflows\nModule 4: Responsible AI, Copyright & Governance",
                'domestic_fee' => 'Free ($0.00)',
                'international_fee' => 'Free ($0.00)',
                'highlights' => "100% Free Access & Digital Badge\n20 MCQ Assessment & Instant Grading\nLinkedIn Shareable Verified Credential",
                'is_active' => true,
            ],
            [
                'name' => 'Free AI Fundamentals Certificate',
                'description' => 'Foundational certificate program covering core AI principles, machine learning basics, and everyday workplace productivity.',
                'type' => 'free_courses',
                'duration' => 'Self-Paced',
                'sub_modules' => "AI Concepts & Terminology\nWorkplace Automation Essentials\nPrompting Best Practices",
                'domestic_fee' => 'Free ($0.00)',
                'international_fee' => 'Free ($0.00)',
                'highlights' => "Foundational AI Assessment\nFree Study Guide Included\nInstant Digital Certificate",
                'is_active' => true,
            ],

            // Courses are seeded via seed_course_catalog.php

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

            // AI-Hot News
            [
                'name' => 'The State of Quantum Security',
                'description' => 'A newsletter detailing how enterprises are preparing for post-quantum cryptography.',
                'type' => 'newsletters',
                'duration' => '5 min read',
                'highlights' => 'TRENDING',
                'is_active' => true,
            ],
            [
                'name' => 'OpenAI unveils GPT-4o with major upgrades',
                'description' => 'OpenAI has officially announced the release of GPT-4o, bringing significant improvements to its flagship AI model. The new update focuses on enhancing multimodal capabilities, allowing the AI to process audio, vision, and text inputs seamlessly and in real-time. This leap forward promises to revolutionize how developers integrate AI into their applications, offering unprecedented speed and contextual understanding. Enterprises are eagerly anticipating the productivity boosts this new architecture will deliver.',
                'highlights' => 'BREAKING',
                'duration' => '2 hours ago',
                'sub_modules' => '/images/gallery/news1.png',
                'type' => 'newsletters',
                'is_active' => true,
            ],
            [
                'name' => 'NVIDIA launches next-gen AI chips for enterprises',
                'description' => 'In a highly anticipated keynote, NVIDIA unveiled its next generation of AI accelerators specifically designed for enterprise data centers. These new chips boast a massive increase in parallel processing power and energy efficiency, aiming to drastically reduce the cost of training large language models. Industry analysts suggest this hardware release will further cement NVIDIA\'s dominant position in the AI hardware market while accelerating enterprise adoption of localized AI solutions.',
                'highlights' => 'TRENDING',
                'duration' => '4 hours ago',
                'sub_modules' => '/images/gallery/news2.png',
                'type' => 'newsletters',
                'is_active' => true,
            ],
            [
                'name' => 'AI regulation: What businesses need to know',
                'description' => 'As governments worldwide begin to implement comprehensive regulatory frameworks for artificial intelligence, businesses are facing new compliance challenges. The latest legislative proposals focus heavily on transparency, data privacy, and ethical AI deployment. Companies utilizing automated decision-making systems will need to adhere to strict auditing requirements. Legal experts advise organizations to establish internal AI governance boards immediately to ensure they stay ahead of the rapidly evolving regulatory landscape.',
                'highlights' => 'INSIGHT',
                'duration' => '6 hours ago',
                'sub_modules' => '/images/gallery/news3.png',
                'type' => 'newsletters',
                'is_active' => true,
            ]
        ];

        foreach ($trainings as $training) {
            $training['slug'] = Str::slug($training['name']);
            Training::updateOrCreate(['slug' => $training['slug']], $training);
        }
    }
}
