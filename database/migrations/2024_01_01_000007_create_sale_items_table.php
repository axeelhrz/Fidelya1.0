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
            $table->string('product_name', 200); // Snapshot del nombre
            $table->string('product_code', 50); // Snapshot del código
            $table->decimal('unit_price', 10, 2); // Precio unitario al momento de venta
            $table->decimal('unit_cost', 10, 2); // Costo unitario al momento de venta
            $table->decimal('quantity', 10, 3);
            $table->string('unit', 20);
            
            // Descuentos por ítem
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            
            // Totales calculados
            $table->decimal('subtotal', 10, 2); // quantity * unit_price
            $table->decimal('total', 10, 2); // subtotal - discount_amount
            $table->decimal('profit', 10, 2)->storedAs('(total - (unit_cost * quantity))');
            
            $table->timestamps();
            
            $table->index(['sale_id', 'product_id']);
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
