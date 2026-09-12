<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('certificate_questions', function (Blueprint $table) {
            $table->string('status')->default('published');
            $table->foreignId('contributor_id')->nullable()->constrained('contributors')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('certificate_questions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('contributor_id');
            $table->dropColumn('status');
        });
    }
};
