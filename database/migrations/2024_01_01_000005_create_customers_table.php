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
            $table->string('tax_id', 20)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('preferred_payment', ['efectivo', 'tarjeta', 'transferencia'])->default('efectivo');
            $table->decimal('credit_limit', 10, 2)->default(0);
            $table->decimal('total_purchases', 12, 2)->default(0);
            $table->integer('total_orders')->default(0);
            $table->timestamp('last_purchase_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['is_active', 'name']);
            $table->index('phone');
            $table->index('email');
            $table->fullText(['name', 'last_name', 'business_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};