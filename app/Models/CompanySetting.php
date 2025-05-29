<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'business_name',
        'tax_id',
        'address',
        'city',
        'state',
        'postal_code',
        'phone',
        'email',
        'website',
        'tax_condition',
        'default_tax_rate',
        'activities_start_date',
        'logo_path',
        'primary_color',
        'secondary_color',
        'theme_mode',
        'currency',
        'currency_symbol',
        'decimal_places',
        'invoice_prefix',
        'next_invoice_number',
        'receipt_prefix',
        'next_receipt_number',
        'auto_update_stock',
        'allow_negative_stock',
        'track_expiry_dates',
        'low_stock_alert_days',
        'auto_backup',
        'backup_frequency',
        'backup_path',
    ];

    protected $casts = [
        'default_tax_rate' => 'decimal:2',
        'decimal_places' => 'integer',
        'next_invoice_number' => 'integer',
        'next_receipt_number' => 'integer',
        'auto_update_stock' => 'boolean',
        'allow_negative_stock' => 'boolean',
        'track_expiry_dates' => 'boolean',
        'low_stock_alert_days' => 'integer',
        'auto_backup' => 'boolean',
    ];

    // Singleton pattern - solo una configuración
    public static function current()
    {
        return static::first() ?? static::create([
            'company_name' => config('app.name', 'Frutería'),
            'currency' => 'ARS',
            'currency_symbol' => '$',
            'primary_color' => '#66BB6A',
            'secondary_color' => '#FFEB3B',
        ]);
    }

    // Accessors
    public function getLogoUrlAttribute(): string
    {
        return $this->logo_path 
            ? asset('storage/' . $this->logo_path)
            : asset('images/logo-placeholder.png');
    }

    public function getTaxConditionLabelAttribute(): string
    {
        $labels = [
            'responsable_inscripto' => 'Responsable Inscripto',
            'monotributo' => 'Monotributo',
            'exento' => 'Exento',
        ];

        return $labels[$this->tax_condition] ?? $this->tax_condition;
    }

    // Métodos de negocio
    public function formatCurrency(float $amount): string
    {
        return $this->currency_symbol . ' ' . number_format($amount, $this->decimal_places, ',', '.');
    }

    public function getNextInvoiceNumber(): string
    {
        $number = $this->next_invoice_number;
        $this->increment('next_invoice_number');
        
        return $this->invoice_prefix . '-' . str_pad($number, 8, '0', STR_PAD_LEFT);
    }

    public function getNextReceiptNumber(): string
    {
        $number = $this->next_receipt_number;
        $this->increment('next_receipt_number');
        
        return $this->receipt_prefix . '-' . str_pad($number, 8, '0', STR_PAD_LEFT);
    }
}