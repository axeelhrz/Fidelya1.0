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
            
            // Información de la factura del proveedor
            $table->string('supplier_invoice_number', 50)->nullable();
            $table->date('supplier_invoice_date')->nullable();
            
            // Totales
            $table->decimal('subtotal', 12, 2);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            
            // Estado y fechas
            $table->enum('status', ['borrador', 'ordenada', 'recibida', 'facturada', 'pagada', 'cancelada'])->default('recibida');
            $table->timestamp('purchase_date');
            $table->timestamp('expected_date')->nullable();
            $table->timestamp('received_date')->nullable();
            $table->timestamp('paid_date')->nullable();
            
            // Pago
            $table->enum('payment_method', ['efectivo', 'transferencia', 'cheque', 'cuenta_corriente'])->default('cuenta_corriente');
            $table->enum('payment_status', ['pendiente', 'pagado', 'parcial'])->default('pendiente');
            $table->decimal('amount_paid', 12, 2)->default(0);
            
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['purchase_date', 'status']);
            $table->index(['supplier_id', 'purchase_date']);
            $table->index(['payment_status', 'purchase_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
