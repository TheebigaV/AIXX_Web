<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Structured curriculum content and learner records for the mobile app
 * (Learn → Check → Scenario → Review → Assess), certification blueprints,
 * pathway levels and enterprise assignments. All tables are new; existing
 * tables only gain one nullable column (training_questions.competency_tag).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('training_questions', function (Blueprint $table) {
            $table->string('competency_tag')->nullable()->after('explanation');
        });

        // Course-level curriculum metadata (outcomes, safety boundary, version), per language.
        Schema::create('course_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_id')->constrained('trainings')->cascadeOnDelete();
            $table->string('lang', 10)->default('en');
            $table->string('target_learner')->nullable();
            $table->string('delivery')->nullable();
            $table->text('boundary_statement')->nullable();
            $table->text('safety_boundary')->nullable();
            $table->json('outcomes')->nullable();
            $table->json('competency_areas')->nullable(); // [{area, description}]
            $table->string('version')->nullable();
            $table->date('effective_date')->nullable();
            $table->timestamps();
            $table->unique(['training_id', 'lang']);
        });

        // Levels of a professional pathway; training_id null = level not yet available.
        Schema::create('pathway_levels', function (Blueprint $table) {
            $table->id();
            $table->string('pathway_slug');
            $table->string('pathway_name');
            $table->unsignedTinyInteger('level');
            $table->string('level_name');
            $table->text('description')->nullable();
            $table->foreignId('training_id')->nullable()->constrained('trainings')->nullOnDelete();
            $table->timestamps();
            $table->unique(['pathway_slug', 'level']);
        });

        // Per-module lesson package, per language.
        Schema::create('module_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_module_id')->constrained('training_modules')->cascadeOnDelete();
            $table->string('lang', 10)->default('en');
            $table->string('study_time')->nullable();
            $table->string('assessment_approach')->nullable();
            $table->text('operational_boundary')->nullable();
            $table->string('competency_area')->nullable();
            $table->json('objectives')->nullable();
            $table->json('terminology')->nullable();
            $table->json('cards')->nullable();     // [{heading, body, type: text|warning}]
            $table->json('scenarios')->nullable(); // [{title, description, image_url}]
            $table->json('summary')->nullable();
            $table->string('version')->nullable();
            $table->date('effective_date')->nullable();
            $table->timestamps();
            $table->unique(['training_module_id', 'lang']);
        });

        Schema::create('knowledge_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_module_id')->constrained('training_modules')->cascadeOnDelete();
            $table->string('lang', 10)->default('en');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->text('question');
            $table->text('suggested_answer');
            $table->timestamps();
        });

        Schema::create('knowledge_check_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('knowledge_check_id')->constrained('knowledge_checks')->cascadeOnDelete();
            $table->text('answer');
            $table->timestamps();
        });

        Schema::create('module_step_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('training_module_id')->constrained('training_modules')->cascadeOnDelete();
            $table->string('step', 20);
            $table->timestamp('completed_at');
            $table->timestamps();
            $table->unique(['student_id', 'training_module_id', 'step']);
        });

        Schema::create('course_acknowledgements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('training_id')->constrained('trainings')->cascadeOnDelete();
            $table->string('version')->nullable();
            $table->timestamp('acknowledged_at');
            $table->timestamps();
            $table->unique(['student_id', 'training_id']);
        });

        Schema::create('assessment_blueprints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_id')->unique()->constrained('trainings')->cascadeOnDelete();
            $table->unsignedSmallInteger('total_questions');
            $table->unsignedTinyInteger('pass_mark');
            $table->json('topics'); // [{module_index, topic, min, max}]
            $table->timestamps();
        });

        Schema::create('certification_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('training_id')->constrained('trainings')->cascadeOnDelete();
            $table->string('status', 20)->default('in_progress');
            $table->unsignedSmallInteger('total_questions');
            $table->unsignedSmallInteger('correct_count')->nullable();
            $table->unsignedTinyInteger('score')->nullable();
            $table->boolean('passed')->nullable();
            $table->json('topic_results')->nullable();
            $table->foreignId('certificate_attempt_id')->nullable()->constrained('certificate_attempts')->nullOnDelete();
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('certification_attempt_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certification_attempt_id')->constrained('certification_attempts')->cascadeOnDelete();
            $table->foreignId('training_question_id')->constrained('training_questions')->cascadeOnDelete();
            $table->unsignedSmallInteger('sort_order');
            $table->json('options_mapping'); // displayed letter => original letter
            $table->string('selected_option', 2)->nullable();
            $table->boolean('is_correct')->nullable();
            $table->timestamps();
        });

        Schema::create('question_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('training_question_id')->constrained('training_questions')->cascadeOnDelete();
            $table->string('type', 30);
            $table->text('comment')->nullable();
            $table->string('status', 20)->default('open');
            $table->timestamps();
        });

        Schema::create('learning_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('department')->nullable(); // null = whole tenant
            $table->foreignId('training_id')->nullable()->constrained('trainings')->cascadeOnDelete();
            $table->foreignId('training_module_id')->nullable()->constrained('training_modules')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('target_group')->nullable();
            $table->json('prerequisites')->nullable();
            $table->date('due_date')->nullable();
            $table->boolean('is_mandatory')->default(false);
            $table->boolean('requires_acknowledgement')->default(false);
            $table->string('source_document_ref')->nullable();
            $table->string('content_owner')->nullable();
            $table->string('approver')->nullable();
            $table->string('version')->nullable();
            $table->date('effective_date')->nullable();
            $table->unsignedSmallInteger('recurrence_months')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('learning_assignment_acknowledgements', function (Blueprint $table) {
            $table->id();
            // Explicit short names: the generated ones exceed MySQL's 64-character identifier limit.
            $table->foreignId('learning_assignment_id')
                ->constrained('learning_assignments', indexName: 'la_acks_learning_assignment_id_foreign')
                ->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('version')->nullable();
            $table->timestamp('acknowledged_at');
            $table->timestamps();
            $table->unique(['learning_assignment_id', 'student_id'], 'la_acks_assignment_student_unique');
        });
    }

    public function down(): void
    {
        foreach ([
            'learning_assignment_acknowledgements', 'learning_assignments', 'question_feedback',
            'certification_attempt_items', 'certification_attempts', 'assessment_blueprints',
            'course_acknowledgements', 'module_step_progress', 'knowledge_check_responses',
            'knowledge_checks', 'module_contents', 'pathway_levels', 'course_profiles',
        ] as $table) {
            Schema::dropIfExists($table);
        }

        Schema::table('training_questions', function (Blueprint $table) {
            $table->dropColumn('competency_tag');
        });
    }
};
