<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
try {
    $banners = DB::table('banners')->get();
    foreach ($banners as $banner) {
        echo "ID: " . ($banner->id ?? 'N/A') . "\n";
        echo "Title 1: " . ($banner->title_1 ?? 'N/A') . "\n";
        echo "Title 2: " . ($banner->title_2 ?? 'N/A') . "\n";
        echo "Subtitle: " . ($banner->subtitle ?? 'N/A') . "\n";
        echo "Image: " . ($banner->image ?? 'N/A') . "\n";
        echo "-------\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
