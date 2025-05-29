<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('last_name', 150)->nullable();
            $table->string('business_name', 200)->nullable();
            $table->enum('customer_type', ['individual', 'business'])->default('individual');
            $table->string('tax_id', 20)->unique()->nullable();
            $table->string('email', 100)->unique()->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('mobile', 20)->nullable();
            $table->date('birth_date')->nullable();
            
            // Dirección
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->string('country', 100)->default('Argentina');
            
            // Información comercial
            $table->enum('payment_preference', ['efectivo', 'tarjeta', 'transferencia', 'cheque'])->default('efectivo');
            $table->decimal('credit_limit', 12, 2)->default(0);
            $table->decimal('current_balance', 12, 2)->default(0);
            $table->integer('loyalty_points')->default(0);
            $table->enum('customer_category', ['regular', 'vip', 'mayorista', 'minorista'])->default('regular');
            $table->decimal('discount_percentage', 5, 2)->default(0);
            
            // Estado y configuración
            $table->boolean('is_active')->default(true);
            $table->boolean('accepts_marketing')->default(false);
            $table->text('notes')->nullable();
            $table->timestamp('last_purchase_date')->nullable();
            
            $table->softDeletes(); // Add soft deletes support
            $table->timestamps();
            
            $table->index(['is_active', 'customer_type']);
            $table->index(['customer_category', 'is_active']);
            $table->index('last_purchase_date');
            $table->fullText(['name', 'last_name', 'business_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};