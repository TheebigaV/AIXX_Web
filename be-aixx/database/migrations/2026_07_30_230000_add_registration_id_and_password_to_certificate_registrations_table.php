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
        Schema::table('certificate_registrations', function (Blueprint $table) {
            $table->string('registration_id')->nullable()->unique()->after('uuid');
            $table->string('password')->nullable()->after('registration_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('certificate_registrations', function (Blueprint $table) {
            $table->dropColumn(['registration_id', 'password']);
        });
    }
};
