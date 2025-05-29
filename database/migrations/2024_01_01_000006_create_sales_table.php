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
            $table->string('invoice_number', 20)->unique();
            $table->enum('invoice_type', ['ticket', 'factura_a', 'factura_b', 'factura_c'])->default('ticket');
            $table->foreignId('customer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('restrict'); // Vendedor
            
            // Totales
            $table->decimal('subtotal', 12, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            
            // Pago
            $table->enum('payment_method', ['efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'cheque', 'cuenta_corriente'])->default('efectivo');
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->decimal('change_amount', 10, 2)->default(0);
            $table->enum('payment_status', ['pendiente', 'pagado', 'parcial', 'cancelado'])->default('pagado');
            
            // Estados y fechas
            $table->enum('status', ['borrador', 'completada', 'cancelada', 'devuelta'])->default('completada');
            $table->timestamp('sale_date');
            $table->timestamp('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->text('internal_notes')->nullable();
            
            // Información fiscal
            $table->boolean('is_tax_exempt')->default(false);
            $table->string('tax_condition', 50)->nullable();
            
            $table->timestamps();
            
            // Índices para reportes y consultas
            $table->index(['sale_date', 'status']);
            $table->index(['customer_id', 'sale_date']);
            $table->index(['user_id', 'sale_date']);
            $table->index(['payment_status', 'due_date']);
            $table->index('invoice_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
