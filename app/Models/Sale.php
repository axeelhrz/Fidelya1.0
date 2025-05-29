<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'invoice_type',
        'customer_id',
        'user_id',
        'subtotal',
        'discount_amount',
        'discount_percentage',
        'tax_amount',
        'total_amount',
        'payment_method',
        'amount_paid',
        'change_amount',
        'payment_status',
        'status',
        'sale_date',
        'due_date',
        'notes',
        'internal_notes',
        'is_tax_exempt',
        'tax_condition',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'change_amount' => 'decimal:2',
        'sale_date' => 'datetime',
        'due_date' => 'datetime',
        'is_tax_exempt' => 'boolean',
    ];

    protected $appends = [
        'total_profit',
        'profit_margin',
        'items_count',
        'is_overdue',
    ];

    // Eventos del modelo
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($sale) {
            if (empty($sale->invoice_number)) {
                $sale->invoice_number = static::generateInvoiceNumber($sale->invoice_type);
            }
            if (empty($sale->sale_date)) {
                $sale->sale_date = now();
            }
        });

        static::created(function ($sale) {
            // Actualizar totales del cliente
            if ($sale->customer_id) {
                $sale->customer->updateTotals();
            }
        });
    }

    // Relaciones
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completada');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'pagado');
    }

    public function scopePending($query)
    {
        return $query->where('payment_status', 'pendiente');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('sale_date', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('sale_date', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('sale_date', now()->month)
                    ->whereYear('sale_date', now()->year);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('sale_date', [$startDate, $endDate]);
    }

    public function scopeByPaymentMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    // Accessors
    public function getTotalProfitAttribute(): float
    {
        return $this->items->sum('profit');
    }

    public function getProfitMarginAttribute(): float
    {
        if ($this->total_amount <= 0) return 0;
        return round(($this->total_profit / $this->total_amount) * 100, 2);
    }

    public function getItemsCountAttribute(): int
    {
        return $this->items->count();
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->payment_status !== 'pagado' && 
               $this->due_date && 
               $this->due_date->isPast();
    }

    // Métodos de negocio
    public static function generateInvoiceNumber(string $type = 'ticket'): string
    {
        $settings = CompanySetting::first();
        
        if ($type === 'ticket') {
            $prefix = $settings->receipt_prefix ?? 'TKT';
            $nextNumber = $settings->next_receipt_number ?? 1;
            $settings->increment('next_receipt_number');
        } else {
            $prefix = $settings->invoice_prefix ?? 'FAC';
            $nextNumber = $settings->next_invoice_number ?? 1;
            $settings->increment('next_invoice_number');
        }

        return $prefix . '-' . str_pad($nextNumber, 8, '0', STR_PAD_LEFT);
    }

    public function calculateTotals(): void
    {
        $this->subtotal = $this->items->sum('subtotal');
        $this->discount_amount = $this->items->sum('discount_amount');
        
        if ($this->discount_percentage > 0) {
            $this->discount_amount += ($this->subtotal * $this->discount_percentage / 100);
        }

        $taxableAmount = $this->subtotal - $this->discount_amount;
        $this->tax_amount = $this->is_tax_exempt ? 0 : ($taxableAmount * 0.21); // 21% IVA
        $this->total_amount = $taxableAmount + $this->tax_amount;

        $this->save();
    }

    public function addItem(Product $product, float $quantity, ?float $unitPrice = null, float $discount = 0): SaleItem
    {
        $unitPrice = $unitPrice ?? $product->sale_price;
        $subtotal = $quantity * $unitPrice;
        $discountAmount = ($subtotal * $discount / 100);
        $total = $subtotal - $discountAmount;

        $item = $this->items()->create([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_code' => $product->code,
            'unit_price' => $unitPrice,
            'unit_cost' => $product->cost_price,
            'quantity' => $quantity,
            'unit' => $product->unit,
            'discount_percentage' => $discount,
            'discount_amount' => $discountAmount,
            'subtotal' => $subtotal,
            'total' => $total,
        ]);

        // Actualizar stock
        $product->updateStock($quantity, 'salida', 'venta', $this);

        // Recalcular totales
        $this->calculateTotals();

        return $item;
    }

    public function cancel(string $reason = ''): void
    {
        if ($this->status === 'cancelada') return;

        // Restaurar stock
        foreach ($this->items as $item) {
            $item->product->updateStock($item->quantity, 'entrada', 'devolucion', $this);
        }

        $this->update([
            'status' => 'cancelada',
            'internal_notes' => ($this->internal_notes ?? '') . "\nCancelada: " . $reason,
        ]);

        // Actualizar totales del cliente
        if ($this->customer_id) {
            $this->customer->updateTotals();
        }
    }
}