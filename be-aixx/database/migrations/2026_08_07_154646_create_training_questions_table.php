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
        Schema::create('training_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_module_id')->constrained('training_modules')->onDelete('cascade');
            $table->text('question');
            $table->json('options');
            $table->string('correct_answer');
            $table->text('explanation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_questions');
    }
};
