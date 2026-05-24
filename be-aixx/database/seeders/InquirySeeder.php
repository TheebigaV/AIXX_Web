<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "🔍 Checking existing data...\n";

        // Check categories
        $categoryCount = DB::table('categories')->count();
        echo "Categories found: {$categoryCount}\n";

        // Check products
        $productCount = DB::table('products')->count();
        echo "Products found: {$productCount}\n";

        // Create category if none exists
        $categoryId = null;
        if ($categoryCount == 0) {
            try {
                $categoryId = DB::table('categories')->insertGetId([
                    'name' => 'Test Category',
                    'slug' => 'test-category',
                    'description' => 'Test category for seeding',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                echo "✅ Created test category with ID: {$categoryId}\n";
            } catch (\Exception $e) {
                echo "⚠️  Could not create category: " . $e->getMessage() . "\n";
                echo "Will try to use existing category or create product without category\n";
            }
        } else {
            $category = DB::table('categories')->first();
            $categoryId = $category->id;
            echo "✅ Using existing category ID: {$categoryId}\n";
        }

        // Create product if none exists
        $productId = null;
        if ($productCount == 0) {
            try {
                $productId = DB::table('products')->insertGetId([
                    'name' => 'Test Product',
                    'slug' => 'test-product-' . time(),
                    'category_id' => $categoryId,
                    'images' => '["test-image.jpg"]',
                    'description' => 'Test product for inquiry seeding',
                    'application_information' => 'Test application info',
                    'additional_information' => 'Test additional info',
                    'features' => '["Feature 1", "Feature 2"]',
                    'is_visible' => 1,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                echo "✅ Created test product with ID: {$productId}\n";
            } catch (\Exception $e) {
                echo "❌ Could not create product: " . $e->getMessage() . "\n";
                return;
            }
        } else {
            $product = DB::table('products')->first();
            $productId = $product->id;
            echo "✅ Using existing product ID: {$productId} - {$product->name}\n";
        }

        // Clear existing test inquiries
        $deleted = DB::table('inquiries')->where('customer_email', 'like', '%example.com')->delete();
        if ($deleted > 0) {
            echo "🗑️  Removed {$deleted} existing test inquiries\n";
        }

        // Create simple inquiries with direct DB insert
        echo "📝 Creating test inquiries...\n";

        try {
            // Insert inquiries one by one to handle any field issues
            $inquiries = [
                [
                    'product_id' => $productId,
                    'customer_name' => 'John Doe',
                    'customer_email' => 'john.doe@example.com',
                    'customer_phone' => '+1234567890',
                    'subject' => 'Product Information Request',
                    'message' => 'I would like to know more about this product specifications and availability.',
                    'reply_message' => null,
                    'is_viewed' => 0,
                    'is_replyed' => 0,
                    'created_at' => now()->subDays(2),
                    'updated_at' => now()->subDays(2),
                ],
                [
                    'product_id' => $productId,
                    'customer_name' => 'Jane Smith',
                    'customer_email' => 'jane.smith@example.com',
                    'customer_phone' => '+1987654321',
                    'subject' => 'Pricing Inquiry',
                    'message' => 'What is the bulk pricing for orders over 100 units?',
                    'reply_message' => null,
                    'is_viewed' => 1,
                    'is_replyed' => 0,
                    'created_at' => now()->subDay(),
                    'updated_at' => now()->subHours(12),
                ],
                [
                    'product_id' => $productId,
                    'customer_name' => 'Mike Johnson',
                    'customer_email' => 'mike.johnson@example.com',
                    'customer_phone' => '+1122334455',
                    'subject' => 'Technical Support',
                    'message' => 'I need help with product installation and configuration.',
                    'reply_message' => 'Thank you for your inquiry. Our technical team will contact you within 24 hours.',
                    'is_viewed' => 1,
                    'is_replyed' => 1,
                    'created_at' => now()->subHours(18),
                    'updated_at' => now()->subHours(6),
                ],
                [
                    'product_id' => $productId,
                    'customer_name' => 'Sarah Wilson',
                    'customer_email' => 'sarah.wilson@example.com',
                    'customer_phone' => '+1555666777',
                    'subject' => 'Warranty Information',
                    'message' => 'Can you provide details about the warranty coverage and terms?',
                    'reply_message' => null,
                    'is_viewed' => 0,
                    'is_replyed' => 0,
                    'created_at' => now()->subHours(3),
                    'updated_at' => now()->subHours(3),
                ],
                [
                    'product_id' => $productId,
                    'customer_name' => 'Robert Brown',
                    'customer_email' => 'robert.brown@example.com',
                    'customer_phone' => '+1888999000',
                    'subject' => 'Shipping Options',
                    'message' => 'What shipping methods are available and what are the delivery timeframes?',
                    'reply_message' => 'We offer standard shipping (5-7 days) and express shipping (2-3 days). International shipping available.',
                    'is_viewed' => 1,
                    'is_replyed' => 1,
                    'created_at' => now()->subHours(8),
                    'updated_at' => now()->subHours(2),
                ],
                [
                    'product_id' => $productId,
                    'customer_name' => 'Emily Davis',
                    'customer_email' => 'emily.davis@example.com',
                    'customer_phone' => '+1333444555',
                    'subject' => 'Return Policy',
                    'message' => 'What is your return policy if the product does not meet requirements?',
                    'reply_message' => null,
                    'is_viewed' => 1,
                    'is_replyed' => 0,
                    'created_at' => now()->subHours(4),
                    'updated_at' => now()->subHours(1),
                ],
                [
                    'product_id' => $productId,
                    'customer_name' => 'David Chen',
                    'customer_email' => 'david.chen@example.com',
                    'customer_phone' => '+1777888999',
                    'subject' => 'Compatibility Question',
                    'message' => 'Is this product compatible with existing XYZ systems?',
                    'reply_message' => null,
                    'is_viewed' => 0,
                    'is_replyed' => 0,
                    'created_at' => now()->subMinutes(30),
                    'updated_at' => now()->subMinutes(30),
                ]
            ];

            $insertedCount = 0;
            foreach ($inquiries as $inquiry) {
                try {
                    DB::table('inquiries')->insert($inquiry);
                    $insertedCount++;
                } catch (\Exception $e) {
                    echo "⚠️  Failed to insert inquiry for {$inquiry['customer_name']}: " . $e->getMessage() . "\n";
                }
            }

            echo "✅ Successfully created {$insertedCount} test inquiries\n";

        } catch (\Exception $e) {
            echo "❌ Error creating inquiries: " . $e->getMessage() . "\n";
            return;
        }

        // Show final summary
        $total = DB::table('inquiries')->count();
        $new = DB::table('inquiries')->where('is_viewed', 0)->count();
        $viewed = DB::table('inquiries')->where('is_viewed', 1)->where('is_replyed', 0)->count();
        $replied = DB::table('inquiries')->where('is_replyed', 1)->count();

        echo "\n📊 Final Summary:\n";
        echo "Total inquiries: {$total}\n";
        echo "New (unviewed): {$new}\n";
        echo "Viewed (not replied): {$viewed}\n";
        echo "Replied: {$replied}\n";
        echo "\n🎉 Seeding completed successfully!\n";
        echo "🔄 Refresh your inquiries page to see the test data.\n";
    }
}
