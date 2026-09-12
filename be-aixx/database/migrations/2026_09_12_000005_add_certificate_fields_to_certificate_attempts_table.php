<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('certificate_attempts', function (Blueprint $table) {
            $table->string('certificate_token')->nullable()->unique();
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('certificate_attempts', function (Blueprint $table) {
            $table->dropColumn(['certificate_token', 'issued_at', 'revoked_at']);
        });
    }
};
