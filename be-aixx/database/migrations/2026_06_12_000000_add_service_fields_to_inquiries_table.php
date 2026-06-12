<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->string('service_interest')->nullable()->after('customer_phone');
            $table->string('industry_type')->nullable()->after('service_interest');
            $table->string('budget_timeline')->nullable()->after('industry_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropColumn(['service_interest', 'industry_type', 'budget_timeline']);
        });
    }
};
