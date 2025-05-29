<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('restrict');
            
            // Información del producto al momento de la venta
            $table->string('product_name', 200);
            $table->string('product_code', 50)->nullable();
            $table->decimal('unit_price', 10, 2);
            $table->decimal('quantity', 10, 3);
            $table->string('unit', 20);
            
            // Descuentos y totales
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2); // quantity * unit_price
            $table->decimal('total', 10, 2); // subtotal - discount_amount
            
            // Información adicional
            $table->text('notes')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('batch_number', 50)->nullable();
            
            $table->timestamps();
            
            $table->index(['sale_id', 'product_id']);
            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};