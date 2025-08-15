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
        Schema::table('users', function (Blueprint $table) {
            // Campos básicos de rol
            $table->enum('role', ['liga', 'club', 'miembro'])->after('email');
            $table->string('phone')->nullable()->after('role');
            $table->string('country')->default('Ecuador')->after('phone');
            
            // Campos polimórficos para conectar con la entidad específica
            $table->unsignedBigInteger('roleable_id')->nullable()->after('country');
            $table->string('roleable_type')->nullable()->after('roleable_id');
            
            // Campos específicos para Liga
            $table->string('league_name')->nullable()->after('roleable_type');
            $table->string('province')->nullable()->after('league_name');
            $table->string('logo_path')->nullable()->after('province');
            
            // Campos específicos para Club
            $table->string('club_name')->nullable()->after('logo_path');
            $table->unsignedBigInteger('parent_league_id')->nullable()->after('club_name');
            $table->string('city')->nullable()->after('parent_league_id');
            $table->text('address')->nullable()->after('city');
            
            // Campos específicos para Miembro
            $table->string('full_name')->nullable()->after('address');
            $table->unsignedBigInteger('parent_club_id')->nullable()->after('full_name');
            $table->date('birth_date')->nullable()->after('parent_club_id');
            $table->enum('gender', ['masculino', 'femenino'])->nullable()->after('birth_date');
            $table->enum('rubber_type', ['liso', 'pupo', 'ambos'])->nullable()->after('gender');
            $table->string('ranking')->nullable()->after('rubber_type');
            $table->string('photo_path')->nullable()->after('ranking');
            
            // Índices para optimizar consultas
            $table->index(['role']);
            $table->index(['roleable_id', 'roleable_type']);
            $table->index(['parent_league_id']);
            $table->index(['parent_club_id']);
            
            // Claves foráneas
            $table->foreign('parent_league_id')->references('id')->on('leagues')->onDelete('set null');
            $table->foreign('parent_club_id')->references('id')->on('clubs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Eliminar claves foráneas primero
            $table->dropForeign(['parent_league_id']);
            $table->dropForeign(['parent_club_id']);
            
            // Eliminar índices
            $table->dropIndex(['role']);
            $table->dropIndex(['roleable_id', 'roleable_type']);
            $table->dropIndex(['parent_league_id']);
            $table->dropIndex(['parent_club_id']);
            
            // Eliminar columnas
            $table->dropColumn([
                'role', 'phone', 'country', 'roleable_id', 'roleable_type',
                'league_name', 'province', 'logo_path',
                'club_name', 'parent_league_id', 'city', 'address',
                'full_name', 'parent_club_id', 'birth_date', 'gender', 
                'rubber_type', 'ranking', 'photo_path'
            ]);
        });
    }
};