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
        Schema::create('certificate_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->string('full_name');
            $table->string('gender');
            $table->string('company_name');
            $table->string('phone');
            $table->string('email');
            $table->string('country');
            $table->integer('test_score')->nullable();
            $table->boolean('passed')->default(false);
            $table->timestamp('passed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificate_registrations');
    }
};
