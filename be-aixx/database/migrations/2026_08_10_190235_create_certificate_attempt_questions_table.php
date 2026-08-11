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
        Schema::create('certificate_attempt_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_attempt_id')->constrained('certificate_attempts')->onDelete('cascade');
            $table->foreignId('certificate_question_id')->constrained('certificate_questions')->onDelete('cascade');
            $table->json('options_mapping'); // e.g. {"A": 2, "B": 0, "C": 1, "D": 3}
            $table->string('selected_option_key')->nullable(); // e.g. "B"
            $table->boolean('is_correct')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificate_attempt_questions');
    }
};
