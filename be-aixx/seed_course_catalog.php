<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Training;

$courses = [
    [
        'name' => 'Computer Science (CS)',
        'type' => 'courses',
        'description' => 'Build a strong foundation in programming, systems, and computing theory for software and technology careers.',
        'duration' => '3–4 years',
        'sub_modules' => "Programming, Data Structures, OS, Networks, Databases, Algorithms, Theory of Computation",
        'domestic_fee' => '£9,000–£63,000 / year',
        'international_fee' => '$25,000–$70,000 / year',
        'highlights' => "Industry-aligned computing fundamentals\nStrong software engineering foundations\nCareer-ready systems and algorithms training",
        'is_active' => true,
    ],
    [
        'name' => 'Software Engineering',
        'type' => 'courses',
        'description' => 'Learn modern delivery practices for building reliable web, mobile, and enterprise applications.',
        'duration' => '3–4 years',
        'sub_modules' => "Software Design, Agile Development, Web Dev, Mobile Apps, DevOps, Testing, Architecture",
        'domestic_fee' => '£9,000–£60,000 / year',
        'international_fee' => '$25,000–$70,000 / year',
        'highlights' => "Professional development workflows\nModern application delivery\nQuality and test automation focus",
        'is_active' => true,
    ],
    [
        'name' => 'Data Science',
        'type' => 'courses',
        'description' => 'Turn data into insight with analytics, visualization, and practical machine learning workflows.',
        'duration' => '3–4 years',
        'sub_modules' => "Statistics, Python, Data Mining, Big Data, Visualization, Machine Learning basics",
        'domestic_fee' => '£10,000–£65,000 / year',
        'international_fee' => '$25,000–$80,000 / year',
        'highlights' => "Data-driven decision making\nEnd-to-end analytics pipelines\nHands-on model building",
        'is_active' => true,
    ],
    [
        'name' => 'Artificial Intelligence (AI)',
        'type' => 'courses',
        'description' => 'Explore advanced AI techniques for model development, automation, and real-world deployment.',
        'duration' => '3–4 years',
        'sub_modules' => "Machine Learning, Deep Learning, Neural Networks, NLP, Computer Vision, Reinforcement Learning",
        'domestic_fee' => '£10,000–£70,000 / year',
        'international_fee' => '$30,000–$90,000 / year',
        'highlights' => "Advanced AI workflows\nResearch-ready model techniques\nBusiness-ready AI deployment",
        'is_active' => true,
    ],
    [
        'name' => 'Cyber Security',
        'type' => 'courses',
        'description' => 'Develop defensive and ethical hacking skills to protect systems, networks, and digital infrastructure.',
        'duration' => '3–4 years',
        'sub_modules' => "Ethical Hacking, Cryptography, Network Security, Digital Forensics, Malware Analysis",
        'domestic_fee' => '£8,000–£60,000 / year',
        'international_fee' => '$20,000–$60,000 / year',
        'highlights' => "Security-first engineering discipline\nProtect real-world infrastructure\nThreat detection and response",
        'is_active' => true,
    ],
    [
        'name' => 'Information Technology (IT)',
        'type' => 'courses',
        'description' => 'Master operational IT, cloud systems, and service delivery for modern digital environments.',
        'duration' => '3 years',
        'sub_modules' => "IT Infrastructure, Cloud Computing, System Admin, Networking, Database Management",
        'domestic_fee' => '£8,000–£50,000 / year',
        'international_fee' => '$20,000–$50,000 / year',
        'highlights' => "Operational IT excellence\nCloud-first infrastructure\nService delivery capability",
        'is_active' => true,
    ],
    [
        'name' => 'Computer Engineering',
        'type' => 'courses',
        'description' => 'Bridge hardware and software through embedded systems, electronics, robotics, and IoT design.',
        'duration' => '4 years',
        'sub_modules' => "Digital Electronics, Microprocessors, Embedded Systems, Computer Architecture, IoT, Robotics",
        'domestic_fee' => '£10,000–£65,000 / year',
        'international_fee' => '$25,000–$70,000 / year',
        'highlights' => "Hardware-software integration\nIoT and robotics design\nPerformance engineering",
        'is_active' => true,
    ],
    [
        'name' => 'Game Development / Multimedia',
        'type' => 'courses',
        'description' => 'Create immersive digital experiences through game design, graphics, animation, and interactive media.',
        'duration' => '3–4 years',
        'sub_modules' => "Game Design, Unity/Unreal, 3D Graphics, Animation, UI/UX, Interactive Media",
        'domestic_fee' => '£8,000–£55,000 / year',
        'international_fee' => '$15,000–$60,000 / year',
        'highlights' => "Creative digital experiences\nInteractive storytelling\nImmersive media development",
        'is_active' => true,
    ],
    [
        'name' => 'AI Specializations (Advanced)',
        'type' => 'courses',
        'description' => 'Advance into specialist AI leadership, generative systems, and ethical strategic design.',
        'duration' => '1–2 years (MSc level)',
        'sub_modules' => "Advanced Machine Learning, AI Research, Robotics AI, Generative AI, LLMs, AI Ethics",
        'domestic_fee' => '£12,000–£80,000 / year',
        'international_fee' => '$30,000–$120,000 / year',
        'highlights' => "Executive AI leadership\nLLM and generative systems\nEthical and strategic AI design",
        'is_active' => true,
    ],
];

foreach ($courses as $course) {
    Training::updateOrCreate(['name' => $course['name']], $course);
}

echo "Seeded " . count($courses) . " courses\n";
