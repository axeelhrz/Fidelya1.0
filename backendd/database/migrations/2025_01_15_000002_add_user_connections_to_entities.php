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
        // Agregar campos a la tabla leagues para conectar con usuarios
        Schema::table('leagues', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->string('province')->nullable()->after('region');
            $table->string('logo_path')->nullable()->after('province');
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['user_id']);
        });

        // Agregar campos a la tabla clubs para conectar con usuarios
        Schema::table('clubs', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->text('address')->nullable()->after('city');
            $table->string('logo_path')->nullable()->after('address');
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['user_id']);
        });

        // Agregar campos a la tabla members para conectar con usuarios
        Schema::table('members', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->string('rubber_type')->nullable()->after('gender');
            $table->string('ranking')->nullable()->after('rubber_type');
            $table->string('photo_path')->nullable()->after('ranking');
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leagues', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn(['user_id', 'province', 'logo_path']);
        });

        Schema::table('clubs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn(['user_id', 'address', 'logo_path']);
        });

        Schema::table('members', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn(['user_id', 'rubber_type', 'ranking', 'photo_path']);
        });
    }
};