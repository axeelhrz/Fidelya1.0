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
        // Modificar el enum para incluir super_admin
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('liga', 'club', 'miembro', 'super_admin') NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir al enum original
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('liga', 'club', 'miembro') NULL");
    }
};