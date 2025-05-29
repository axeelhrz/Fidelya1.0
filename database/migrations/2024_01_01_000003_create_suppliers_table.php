<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('business_name', 200)->nullable();
            $table->string('tax_id', 20)->unique()->nullable();
            $table->string('email', 100)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('mobile', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->string('country', 100)->default('Argentina');
            $table->string('contact_person', 150)->nullable();
            $table->enum('payment_terms', ['contado', '30_dias', '60_dias', '90_dias'])->default('contado');
            $table->decimal('credit_limit', 12, 2)->default(0);
            $table->decimal('current_balance', 12, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->softDeletes(); // Add soft deletes support
            $table->timestamps();
            
            $table->index(['is_active', 'name']);
            $table->index('tax_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};