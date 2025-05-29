<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->foreignId('supplier_id')->nullable()->constrained()->onDelete('set null');
            
            // Precios y costos
            $table->decimal('cost_price', 10, 2)->default(0);
            $table->decimal('sale_price', 10, 2);
            $table->decimal('wholesale_price', 10, 2)->nullable();
            $table->decimal('profit_margin', 5, 2)->storedAs('((sale_price - cost_price) / cost_price * 100)');
            
            // Stock y unidades
            $table->decimal('stock_quantity', 10, 3)->default(0);
            $table->decimal('min_stock', 10, 3)->default(0);
            $table->decimal('max_stock', 10, 3)->nullable();
            $table->enum('unit', ['kg', 'g', 'unidad', 'caja', 'bolsa', 'litro', 'ml'])->default('kg');
            
            // Información adicional
            $table->string('barcode', 50)->nullable()->unique();
            $table->string('image_path')->nullable();
            $table->boolean('is_perishable')->default(true);
            $table->integer('shelf_life_days')->nullable(); // Días de vida útil
            $table->boolean('is_active')->default(true);
            $table->boolean('track_stock')->default(true);
            
            // Fechas importantes
            $table->date('expiry_date')->nullable();
            $table->timestamps();
            
            // Índices para optimización
            $table->index(['is_active', 'category_id']);
            $table->index(['stock_quantity', 'min_stock']);
            $table->index('barcode');
            $table->index('code');
            $table->fullText(['name', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};