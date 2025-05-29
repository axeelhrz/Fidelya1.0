<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('restrict');
            
            // Información del producto
            $table->string('product_name', 200);
            $table->string('product_code', 50);
            $table->decimal('unit_cost', 10, 2);
            $table->decimal('quantity', 10, 3);
            $table->string('unit', 20);
            
            // Fechas de vencimiento para productos perecederos
            $table->date('expiry_date')->nullable();
            $table->string('batch_number', 50)->nullable();
            
            // Totales
            $table->decimal('subtotal', 10, 2); // quantity * unit_cost
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            
            $table->timestamps();
            
            $table->index(['purchase_id', 'product_id']);
            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};
