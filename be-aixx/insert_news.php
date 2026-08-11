<?php

use App\Models\Training;
use Illuminate\Support\Str;

$newsItems = [
    [
        'name' => 'OpenAI unveils GPT-4o with major upgrades',
        'description' => 'OpenAI has officially announced the release of GPT-4o, bringing significant improvements to its flagship AI model. The new update focuses on enhancing multimodal capabilities, allowing the AI to process audio, vision, and text inputs seamlessly and in real-time. This leap forward promises to revolutionize how developers integrate AI into their applications, offering unprecedented speed and contextual understanding. Enterprises are eagerly anticipating the productivity boosts this new architecture will deliver.',
        'highlights' => 'BREAKING', // Tag
        'duration' => '2 hours ago', // Time
        'sub_modules' => '/images/gallery/news1.png', // Image
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
    ],
];

foreach ($newsItems as $item) {
    $item['slug'] = Str::slug($item['name']);
    Training::updateOrCreate(['slug' => $item['slug']], $item);
}

echo "News items seeded successfully!\n";
