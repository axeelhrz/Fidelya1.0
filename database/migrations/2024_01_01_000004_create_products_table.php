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
            $table->string('name', 200);
            $table->string('slug', 200)->unique();
            $table->string('sku', 50)->unique()->nullable();
            $table->string('barcode', 50)->unique()->nullable();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            
            // Categoría y proveedor
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->foreignId('supplier_id')->nullable()->constrained()->onDelete('set null');
            
            // Precios y costos
            $table->decimal('cost_price', 10, 2)->default(0);
            $table->decimal('sale_price', 10, 2);
            $table->decimal('wholesale_price', 10, 2)->nullable();
            $table->decimal('min_price', 10, 2)->nullable();
            $table->decimal('max_discount_percent', 5, 2)->default(0);
            
            // Stock
            $table->decimal('stock_quantity', 10, 3)->default(0);
            $table->decimal('min_stock', 10, 3)->default(0);
            $table->decimal('max_stock', 10, 3)->nullable();
            $table->boolean('track_stock')->default(true);
            $table->boolean('allow_negative_stock')->default(false);
            
            // Unidades de medida
            $table->enum('unit', ['kg', 'g', 'lb', 'oz', 'unidad', 'caja', 'bolsa', 'litro', 'ml'])->default('kg');
            $table->decimal('unit_weight', 8, 3)->nullable();
            $table->string('package_type', 50)->nullable();
            
            // Fechas importantes
            $table->date('expiry_date')->nullable();
            $table->integer('shelf_life_days')->nullable();
            $table->date('harvest_date')->nullable();
            
            // Características del producto
            $table->enum('origin', ['nacional', 'importado'])->default('nacional');
            $table->string('origin_country', 100)->nullable();
            $table->enum('quality_grade', ['premium', 'primera', 'segunda', 'tercera'])->default('primera');
            $table->boolean('is_organic')->default(false);
            $table->boolean('is_seasonal')->default(false);
            $table->json('seasonal_months')->nullable(); // [1,2,3] para ene,feb,mar
            
            // Estado y configuración
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('requires_refrigeration')->default(false);
            $table->integer('display_order')->default(0);
            
            // Imágenes
            $table->string('image')->nullable();
            $table->json('gallery')->nullable(); // Array de imágenes adicionales
            
            // Metadatos
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('tags')->nullable(); // Tags para búsqueda
            
            $table->softDeletes(); // Add soft deletes support
            $table->timestamps();
            
            // Índices para optimizar consultas
            $table->index(['is_active', 'category_id']);
            $table->index(['is_active', 'is_featured']);
            $table->index(['stock_quantity', 'min_stock']);
            $table->index('expiry_date');
            $table->index(['origin', 'quality_grade']);
            $table->fullText(['name', 'description', 'short_description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};