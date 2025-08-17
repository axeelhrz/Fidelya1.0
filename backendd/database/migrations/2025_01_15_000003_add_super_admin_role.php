<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Para SQLite, necesitamos recrear la tabla con el nuevo enum
        // Primero, crear una tabla temporal
        Schema::create('users_temp', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['liga', 'club', 'miembro', 'super_admin'])->nullable();
            $table->string('phone')->nullable();
            $table->string('country')->default('Ecuador');
            $table->unsignedBigInteger('roleable_id')->nullable();
            $table->string('roleable_type')->nullable();
            $table->string('league_name')->nullable();
            $table->string('province')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('club_name')->nullable();
            $table->unsignedBigInteger('parent_league_id')->nullable();
            $table->string('city')->nullable();
            $table->text('address')->nullable();
            $table->string('full_name')->nullable();
            $table->unsignedBigInteger('parent_club_id')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['masculino', 'femenino'])->nullable();
            $table->enum('rubber_type', ['liso', 'pupo', 'ambos'])->nullable();
            $table->string('ranking')->nullable();
            $table->string('photo_path')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            $table->index(['role']);
            $table->index(['roleable_id', 'roleable_type']);
            $table->index(['parent_league_id']);
            $table->index(['parent_club_id']);
        });

        // Copiar datos de la tabla original
        DB::statement('INSERT INTO users_temp SELECT * FROM users');

        // Eliminar la tabla original
        Schema::dropIfExists('users');

        // Renombrar la tabla temporal
        Schema::rename('users_temp', 'users');

        // Agregar claves foráneas
        if (Schema::hasTable('leagues') && Schema::hasTable('clubs')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreign('parent_league_id')->references('id')->on('leagues')->onDelete('set null');
                $table->foreign('parent_club_id')->references('id')->on('clubs')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Crear tabla temporal sin super_admin
        Schema::create('users_temp', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['liga', 'club', 'miembro'])->nullable();
            $table->string('phone')->nullable();
            $table->string('country')->default('Ecuador');
            $table->unsignedBigInteger('roleable_id')->nullable();
            $table->string('roleable_type')->nullable();
            $table->string('league_name')->nullable();
            $table->string('province')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('club_name')->nullable();
            $table->unsignedBigInteger('parent_league_id')->nullable();
            $table->string('city')->nullable();
            $table->text('address')->nullable();
            $table->string('full_name')->nullable();
            $table->unsignedBigInteger('parent_club_id')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['masculino', 'femenino'])->nullable();
            $table->enum('rubber_type', ['liso', 'pupo', 'ambos'])->nullable();
            $table->string('ranking')->nullable();
            $table->string('photo_path')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            $table->index(['role']);
            $table->index(['roleable_id', 'roleable_type']);
            $table->index(['parent_league_id']);
            $table->index(['parent_club_id']);
        });

        // Copiar datos excluyendo super_admin
        DB::statement("INSERT INTO users_temp SELECT * FROM users WHERE role != 'super_admin'");

        // Eliminar la tabla original
        Schema::dropIfExists('users');

        // Renombrar la tabla temporal
        Schema::rename('users_temp', 'users');

        // Agregar claves foráneas
        if (Schema::hasTable('leagues') && Schema::hasTable('clubs')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreign('parent_league_id')->references('id')->on('leagues')->onDelete('set null');
                $table->foreign('parent_club_id')->references('id')->on('clubs')->onDelete('set null');
            });
        }
    }
};