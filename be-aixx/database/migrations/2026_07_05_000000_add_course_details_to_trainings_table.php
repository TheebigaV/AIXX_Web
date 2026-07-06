<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trainings', function (Blueprint $table) {
            $table->string('duration')->nullable()->after('description');
            $table->text('sub_modules')->nullable()->after('duration');
            $table->string('domestic_fee')->nullable()->after('sub_modules');
            $table->string('international_fee')->nullable()->after('domestic_fee');
            $table->text('highlights')->nullable()->after('international_fee');
        });
    }

    public function down(): void
    {
        Schema::table('trainings', function (Blueprint $table) {
            $table->dropColumn(['duration', 'sub_modules', 'domestic_fee', 'international_fee', 'highlights']);
        });
    }
};
