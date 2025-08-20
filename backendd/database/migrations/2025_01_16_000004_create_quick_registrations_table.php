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
        Schema::create('quick_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('doc_id')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('province');
            $table->string('city');
            $table->enum('interest_type', ['player', 'club_owner', 'league_admin']);
            $table->string('preferred_sport')->nullable();
            $table->enum('experience_level', ['beginner', 'intermediate', 'advanced'])->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'contacted', 'approved', 'rejected'])->default('pending');
            $table->timestamp('contacted_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->json('metadata')->nullable(); // For additional data
            $table->timestamps();

            // Indexes
            $table->index(['status', 'created_at']);
            $table->index(['province', 'city']);
            $table->index(['interest_type', 'preferred_sport']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quick_registrations');
    }
};