<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('restrict');
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            
            // Tipo de movimiento
            $table->enum('type', ['entrada', 'salida', 'ajuste', 'merma', 'devolucion']);
            $table->enum('reason', [
                'compra', 'venta', 'ajuste_inventario', 'producto_vencido', 
                'producto_dañado', 'devolucion_cliente', 'devolucion_proveedor',
                'transferencia', 'muestra_gratis', 'uso_interno'
            ]);
            
            // Cantidades
            $table->decimal('quantity', 10, 3);
            $table->decimal('previous_stock', 10, 3);
            $table->decimal('new_stock', 10, 3);
            $table->decimal('unit_cost', 10, 2)->nullable();
            
            // Referencias
            $table->morphs('reference'); // Puede ser sale_id, purchase_id, etc.
            $table->string('reference_number', 50)->nullable();
            
            $table->text('notes')->nullable();
            $table->timestamp('movement_date');
            $table->timestamps();
            
            $table->index(['product_id', 'movement_date']);
            $table->index(['type', 'movement_date']);
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};