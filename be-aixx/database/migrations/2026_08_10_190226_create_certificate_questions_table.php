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
        Schema::create('certificate_questions', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->json('options'); // e.g. ["Apple", "Banana", "Orange", "Grape"]
            $table->integer('correct_answer_index'); // e.g. 1 (Banana)
            $table->text('explanation')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificate_questions');
    }
};
