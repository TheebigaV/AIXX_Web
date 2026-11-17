<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_roadmaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students')->cascadeOnDelete();
            $table->foreignId('learning_path_id')->constrained('learning_paths')->cascadeOnDelete();
            $table->string('destination_query')->nullable(); // what the learner typed, e.g. "AI Engineer"
            $table->unsignedTinyInteger('hours_per_week');    // study-load control
            $table->date('start_date');
            $table->json('plan');                             // module schedule frozen at create / re-plan time
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_roadmaps');
    }
};
