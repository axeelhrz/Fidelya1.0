<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('purchase_number', 20)->unique();
            $table->foreignId('supplier_id')->constrained()->onDelete('restrict');
            $table->foreignId('user_id')->constrained()->onDelete('restrict'); // Usuario que registra
            
            // Fechas
            $table->date('purchase_date');
            $table->date('delivery_date')->nullable();
            $table->date('due_date')->nullable();
            
            // Montos
            $table->decimal('subtotal', 12, 2);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('shipping_cost', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0);
            
            // Estado
            $table->enum('status', ['pendiente', 'parcial', 'recibida', 'cancelada'])->default('pendiente');
            $table->enum('payment_status', ['pendiente', 'parcial', 'pagado', 'vencido'])->default('pendiente');
            $table->enum('payment_method', ['efectivo', 'transferencia', 'cheque', 'credito'])->default('credito');
            
            // Información adicional
            $table->string('supplier_invoice', 50)->nullable();
            $table->text('notes')->nullable();
            $table->json('payment_details')->nullable();
            
            $table->softDeletes(); // Add soft deletes support
            $table->timestamps();
            
            $table->index(['purchase_date', 'status']);
            $table->index(['supplier_id', 'purchase_date']);
            $table->index(['payment_status', 'due_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};