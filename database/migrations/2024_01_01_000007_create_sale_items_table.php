<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('sale_number', 20)->unique();
            $table->foreignId('customer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('restrict'); // Vendedor
            
            // Fechas
            $table->timestamp('sale_date');
            $table->date('due_date')->nullable();
            
            // Montos
            $table->decimal('subtotal', 12, 2);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('change_amount', 12, 2)->default(0);
            
            // Estado y tipo
            $table->enum('status', ['pendiente', 'completada', 'cancelada', 'devuelta'])->default('completada');
            $table->enum('sale_type', ['mostrador', 'delivery', 'pickup', 'mayorista'])->default('mostrador');
            $table->enum('payment_method', ['efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'cheque', 'mixto'])->default('efectivo');
            $table->enum('payment_status', ['pendiente', 'parcial', 'pagado', 'vencido'])->default('pagado');
            
            // Información adicional
            $table->text('notes')->nullable();
            $table->string('receipt_number', 50)->nullable();
            $table->json('payment_details')->nullable(); // Detalles del pago mixto
            $table->string('delivery_address')->nullable();
            $table->timestamp('delivery_date')->nullable();
            $table->decimal('delivery_cost', 8, 2)->default(0);
            
            $table->softDeletes(); // Add soft deletes support
            $table->timestamps();
            
            $table->index(['sale_date', 'status']);
            $table->index(['customer_id', 'sale_date']);
            $table->index(['user_id', 'sale_date']);
            $table->index(['payment_status', 'due_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};