<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            
            // Información de la empresa
            $table->string('company_name', 200);
            $table->string('business_name', 200)->nullable();
            $table->string('tax_id', 20)->unique();
            $table->text('address');
            $table->string('city', 100);
            $table->string('state', 100);
            $table->string('postal_code', 10);
            $table->string('phone', 20);
            $table->string('email', 100);
            $table->string('website', 100)->nullable();
            
            // Configuración fiscal
            $table->enum('tax_condition', ['responsable_inscripto', 'monotributo', 'exento'])->default('monotributo');
            $table->decimal('default_tax_rate', 5, 2)->default(21.00);
            $table->string('activities_start_date')->nullable();
            
            // Configuración del sistema
            $table->string('logo_path')->nullable();
            $table->string('primary_color', 7)->default('#66BB6A');
            $table->string('secondary_color', 7)->default('#FFEB3B');
            $table->enum('theme_mode', ['light', 'dark', 'auto'])->default('light');
            $table->string('currency', 3)->default('ARS');
            $table->string('currency_symbol', 5)->default('$');
            $table->integer('decimal_places')->default(2);
            
            // Configuración de facturación
            $table->string('invoice_prefix', 10)->default('FAC');
            $table->integer('next_invoice_number')->default(1);
            $table->string('receipt_prefix', 10)->default('TKT');
            $table->integer('next_receipt_number')->default(1);
            
            // Configuración de stock
            $table->boolean('auto_update_stock')->default(true);
            $table->boolean('allow_negative_stock')->default(false);
            $table->boolean('track_expiry_dates')->default(true);
            $table->integer('low_stock_alert_days')->default(7);
            
            // Configuración de backup
            $table->boolean('auto_backup')->default(true);
            $table->enum('backup_frequency', ['daily', 'weekly', 'monthly'])->default('daily');
            $table->string('backup_path')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};