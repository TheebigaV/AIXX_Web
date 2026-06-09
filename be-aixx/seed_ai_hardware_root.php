<?php
/**
 * Seed script to add AI hardware related product categories.
 * Run with: php seed_ai_hardware.php
 */

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Capsule\Manager as Capsule;

// Bootstrap Eloquent (adjust path if needed)
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => env('DB_CONNECTION', 'sqlite'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'database' => env('DB_DATABASE', database_path('database.sqlite')),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix' => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

$categories = [
    [
        'name' => 'AI Hardware Integration',
        'slug' => 'ai-hardware-integration',
        'description' => 'Integrating advanced AI hardware components to boost performance, scalability, and efficiency.',
        'is_active' => true,
    ],
    [
        'name' => 'AI Computing Systems',
        'slug' => 'ai-computing-systems',
        'description' => 'High‑performance workstations and enterprise platforms optimized for machine learning and analytics.',
        'is_active' => true,
    ],
    [
        'name' => 'Hardware Optimization',
        'slug' => 'hardware-optimization',
        'description' => 'Custom enhancements to memory, storage, and specialized processors for AI workloads.',
        'is_active' => true,
    ],
    [
        'name' => 'Edge AI Solutions',
        'slug' => 'edge-ai-solutions',
        'description' => 'Smart embedded devices delivering real‑time AI inference at the edge.',
        'is_active' => true,
    ],
    [
        'name' => 'Emerging Technologies',
        'slug' => 'emerging-technologies',
        'description' => 'Research and implementation of next‑gen AI hardware architectures and innovative processing solutions.',
        'is_active' => true,
    ],
];

foreach ($categories as $cat) {
    // Use upsert to avoid duplicates based on slug
    DB::table('categories')->updateOrInsert(['slug' => $cat['slug']], $cat);
    echo "Seeded category: {$cat['name']}\n";
}
?>
