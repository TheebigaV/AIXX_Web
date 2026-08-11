<?php

use App\Models\Training;

$cards = [
    [
        'name' => 'AI FREE COURSE',
        'slug' => 'ai-free-course',
        'description' => 'Start learning AI for FREE today!',
        'type' => 'homepage_cards',
        'is_active' => true,
    ],
    [
        'name' => 'SOURCE YOUR AI TALENT HERE',
        'slug' => 'source-your-ai-talent-here',
        'description' => 'Find top AI talent for your team.',
        'type' => 'homepage_cards',
        'is_active' => true,
    ],
    [
        'name' => 'AI SINGAPORE',
        'slug' => 'ai-singapore',
        'description' => 'Stay updated with the latest AI developments.',
        'type' => 'homepage_cards',
        'is_active' => true,
    ],
    [
        'name' => 'AI & JOB LOSS-SINGAPORE',
        'slug' => 'ai-and-job-loss-singapore',
        'description' => 'Understand the impact. Upskill. Adapt. Thrive.',
        'type' => 'homepage_cards',
        'is_active' => true,
    ],
    [
        'name' => 'AI COURSES BY INDUSTRY',
        'slug' => 'ai-courses-by-industry',
        'description' => 'Industry-specific AI courses & programs.',
        'type' => 'homepage_cards',
        'is_active' => true,
    ],
    [
        'name' => 'AI HOT NEWS',
        'slug' => 'ai-hot-news',
        'description' => 'Trending AI stories you can\'t miss.',
        'type' => 'homepage_cards',
        'is_active' => true,
    ],
    [
        'name' => 'QUANTUM TECHNOLOGY NEWS',
        'slug' => 'quantum-technology-news',
        'description' => 'Explore the future beyond AI.',
        'type' => 'homepage_cards',
        'is_active' => true,
    ],
    [
        'name' => 'AI CONSULTING ENQUIRY',
        'slug' => 'ai-consulting-enquiry',
        'description' => 'Let\'s solve your business challenges with AI.',
        'type' => 'homepage_cards',
        'is_active' => true,
    ]
];

foreach ($cards as $card) {
    Training::updateOrCreate(['slug' => $card['slug']], $card);
}
echo "Seeded 8 Homepage Cards successfully.\n";
