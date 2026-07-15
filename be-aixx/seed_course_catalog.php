<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Training;
use Illuminate\Support\Str;

// Clear existing courses in DB to prevent conflicts
Training::where('type', 'courses')->delete();

$courses = [
    [
        'name' => 'AI Basics for Productivity',
        'type' => 'courses',
        'description' => 'Master fundamental AI tools and workflows to automate daily tasks, generate content, and double your personal productivity.',
        'duration' => '3 - 4 Months',
        'sub_modules' => "Introduction to Generative AI & Large Language Models\nMastering ChatGPT & Gemini for Daily Tasks\nPrompt Engineering Basics & Practical Templates\nAutomating Workflows with AI & Everyday Apps",
        'domestic_fee' => '$2,000.00',
        'international_fee' => '$1,500.00',
        'highlights' => "Personalized productivity templates\nPrompt optimization cheatsheet\nHands-on workflow automation",
        'is_active' => true,
    ],
    [
        'name' => 'Artificial Intelligence (AI) for Boosting Productivity',
        'type' => 'courses',
        'description' => 'A fast-paced guide to leveraging pre-built AI assistants, templates, and systems to streamline operations and enhance work efficiency.',
        'duration' => '6 - 8 Months',
        'sub_modules' => "AI Assistant Landscape & Productivity Foundations\nEmail & Communication Automation Systems\nDocument Summarization, Processing, & Data Extraction\nAutomating Meeting Transcripts & Creating Action Items",
        'domestic_fee' => '$300.00',
        'international_fee' => '$225.00',
        'highlights' => "Quick-start template library\nIntegration guides for popular tools\nReal-world productivity audits",
        'is_active' => true,
    ],
    [
        'name' => 'Introduction to AI and Machine Learning',
        'type' => 'courses',
        'description' => 'Learn the core concepts of artificial intelligence, supervised vs. unsupervised learning, and build your first predictive models.',
        'duration' => '4 - 6 Months',
        'sub_modules' => "Fundamentals of Artificial Intelligence & Mathematical Concepts\nSupervised vs. Unsupervised Learning Paradigms\nLinear Regression & Classification Algorithms\nModel Evaluation, Feature Selection, & Hands-on Labs",
        'domestic_fee' => '$320.00',
        'international_fee' => '$240.00',
        'highlights' => "Foundational ML theory\nHands-on dataset modeling\nCode-along lab sessions",
        'is_active' => true,
    ],
    [
        'name' => 'Introduction to Artificial Intelligence and Machine Learning',
        'type' => 'courses',
        'description' => 'Gain foundational theoretical and practical knowledge of machine learning algorithms, deep neural networks, and their industry applications.',
        'duration' => '6 - 8 Months',
        'sub_modules' => "Advanced Algorithms & Statistical Analysis\nFoundations of Artificial Neural Networks (ANNs)\nIntroduction to Deep Learning & Backpropagation\nReal-world Industry Case Studies & Deployment Patterns",
        'domestic_fee' => '$235.00',
        'international_fee' => '$176.25',
        'highlights' => "In-depth model evaluations\nIntroduction to Deep Learning\nReal-world corporate case studies",
        'is_active' => true,
    ],
    [
        'name' => 'Harnessing Generative Artificial Intelligence',
        'type' => 'courses',
        'description' => 'An advanced masterclass on fine-tuning LLMs, retrieval-augmented generation (RAG), and building production-ready generative AI solutions.',
        'duration' => '8 - 10 Months',
        'sub_modules' => "Attention Mechanism & Transformer Architectures\nFine-Tuning & Customizing Large Language Models (LLMs)\nBuilding Retrieval-Augmented Generation (RAG) Pipelines\nVector Databases, Semantic Search, & Embeddings\nDeploying GenAI Apps, Scalability, & Ethical Security",
        'domestic_fee' => '$3,000.00',
        'international_fee' => '$2,250.00',
        'highlights' => "End-to-end RAG architecture design\nLLM fine-tuning techniques\nEnterprise-grade security guidelines",
        'is_active' => true,
    ],
    [
        'name' => 'Introduction to Generative Artificial Intelligence (AI)',
        'type' => 'courses',
        'description' => 'Understand the fundamentals of generative models (ChatGPT, Midjourney, etc.), prompt engineering best practices, and ethical implications.',
        'duration' => '6 - 8 Months',
        'sub_modules' => "The Landscape of Generative AI Models (Text, Images, Audio)\nAI Art, Graphic Design & Image Generation Tools (Midjourney, DALL-E)\nPractical Prompt Engineering Tricks & Best Practices\nResponsible AI Design, Copyright, & Safety Guidelines",
        'domestic_fee' => '$700.00',
        'international_fee' => '$525.00',
        'highlights' => "Multi-modal model exploration\nAdvanced prompt engineering tricks\nResponsible AI design guidelines",
        'is_active' => true,
    ],
    [
        'name' => 'AI for Business Leaders',
        'type' => 'courses',
        'description' => 'A comprehensive guide to implementing AI strategies in enterprise environments without writing code.',
        'duration' => '6 - 8 Months',
        'sub_modules' => "AI-Driven Business Strategy & Frameworks\nDeploying No-code AI Tools in Enterprise\nChange Management, Staff Training & AI Governance\nCalculating ROI & Metrics for Business AI Initiatives",
        'domestic_fee' => '$400.00',
        'international_fee' => '$300.00',
        'highlights' => "Executive implementation templates\nEnterprise AI roadmap guides\nReal-world deployment audits",
        'is_active' => true,
    ],
    [
        'name' => 'Generative AI Masterclass',
        'type' => 'courses',
        'description' => 'Learn how to build, fine-tune, and deploy advanced generative AI models from scratch.',
        'duration' => '12 - 15 Months',
        'sub_modules' => "Deep Dive into LLM Architecture & Mechanics\nSupervised Fine-Tuning (SFT) & RLHF Strategies\nEnterprise Deployment, Scaling, & Vector Search integration\nMulti-Modal GenAI (Audio, Video, Code) & RAG Systems",
        'domestic_fee' => '$2,800.00',
        'international_fee' => '$2,100.00',
        'highlights' => "Direct mentorship sessions\nGPU-powered learning labs\nAdvanced model optimization techniques",
        'is_active' => true,
    ],
    [
        'name' => 'Prompt Engineering Masterclass',
        'type' => 'courses',
        'description' => 'The practice of designing effective prompts to improve the quality, accuracy, and relevance of AI-generated responses.',
        'duration' => '4 - 6 Months',
        'sub_modules' => "Zero-shot, Few-shot & Chain-of-Thought Prompting\nContext Window Optimization & System Instructions\nPrompt Injection Defenses & Handling Hallucinations",
        'domestic_fee' => '$500.00',
        'international_fee' => '$375.00',
        'highlights' => "Advanced prompts repository\nAnti-hallucination checklists\nMulti-model optimization guides",
        'is_active' => true,
    ],
    [
        'name' => 'AI for Developers & Data Analytics',
        'type' => 'courses',
        'description' => 'The use of AI tools and techniques to enhance software development, automate tasks, analyze data, and generate valuable insights for decision-making.',
        'duration' => '9 - 12 Months',
        'sub_modules' => "Integrating AI Coding Assistants (GitHub Copilot, Cursor)\nAutomated Code Refactoring, Debugging & Testing with AI\nAI-Powered Data Cleaning, Wrangling & Visualization\nBuilding Predictive Analytics Models & Automated Reporting",
        'domestic_fee' => '$640.00',
        'international_fee' => '$480.00',
        'highlights' => "Developer-first code environments\nData science dashboard tools\nAutomation script catalogs",
        'is_active' => true,
    ],
    [
        'name' => 'Agentic AI Systems',
        'type' => 'courses',
        'description' => 'AI systems that can autonomously plan, make decisions, and perform tasks to achieve specific goals with minimal human intervention.',
        'duration' => '9 - 12 Months',
        'sub_modules' => "Introduction to Autonomous Agents & Reasoning Loops\nPlanning, Memory Systems & Reflection Frameworks\nExternal Tool Integrations (Web Search, APIs, Databases)\nBuilding Multi-Agent Collaborative Systems (LangGraph, CrewAI)",
        'domestic_fee' => '$1,200.00',
        'international_fee' => '$900.00',
        'highlights' => "State-of-the-art agent labs\nProduction-ready codebases\nAutonomus system blueprints",
        'is_active' => true,
    ],
    [
        'name' => 'Quantum Computing for AI – Fundamentals',
        'type' => 'courses',
        'description' => 'The study of using quantum computing principles to enhance AI by enabling faster processing and solving complex problems beyond the capability of traditional computers.',
        'duration' => '18 - 24 Months',
        'sub_modules' => "Principles of Quantum Mechanics: Qubits, Superposition & Entanglement\nDesigning Quantum Circuits & Quantum Gates\nHybrid Classical-Quantum Architectures & Variational Algorithms\nQuantum Machine Learning (QML) Foundations & Future Outlook",
        'domestic_fee' => '$1,800.00',
        'international_fee' => '$1,350.00',
        'highlights' => "Access to quantum simulators\nCutting-edge algorithms research\nHybrid classical-quantum designs",
        'is_active' => true,
    ],
];

foreach ($courses as $course) {
    $course['slug'] = Str::slug($course['name']);
    Training::updateOrCreate(['slug' => $course['slug']], $course);
}

echo "Seeded " . count($courses) . " courses\n";
