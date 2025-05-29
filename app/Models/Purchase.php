<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'purchase_number',
        'supplier_id',
        'user_id',
        'supplier_invoice_number',
        'supplier_invoice_date',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'status',
        'purchase_date',
        'expected_date',
        'received_date',
        'paid_date',
        'payment_method',
        'payment_status',
        'amount_paid',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'supplier_invoice_date' => 'date',
        'purchase_date' => 'datetime',
        'expected_date' => 'datetime',
        'received_date' => 'datetime',
        'paid_date' => 'datetime',
    ];

    protected $appends = [
        'items_count',
        'pending_amount',
        'is_overdue',
        'status_label',
    ];

    // Relaciones
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPaymentStatus($query, $status)
    {
        return $query->where('payment_status', $status);
    }

    public function scopeOverdue($query)
    {
        return $query->where('payment_status', '!=', 'pagado')
                    ->whereNotNull('expected_date')
                    ->where('expected_date', '<', now());
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('purchase_date', now()->month)
                    ->whereYear('purchase_date', now()->year);
    }

    // Accessors
    public function getItemsCountAttribute(): int
    {
        return $this->items->count();
    }

    public function getPendingAmountAttribute(): float
    {
        return $this->total_amount - $this->amount_paid;
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->payment_status !== 'pagado' && 
               $this->expected_date && 
               $this->expected_date->isPast();
    }

    public function getStatusLabelAttribute(): string
    {
        $labels = [
            'borrador' => 'Borrador',
            'ordenada' => 'Ordenada',
            'recibida' => 'Recibida',
            'facturada' => 'Facturada',
            'pagada' => 'Pagada',
            'cancelada' => 'Cancelada',
        ];

        return $labels[$this->status] ?? $this->status;
    }

    // Métodos de negocio
    public function calculateTotals(): void
    {
        $this->subtotal = $this->items->sum('total');
        $this->tax_amount = $this->subtotal * 0.21; // 21% IVA
        $this->total_amount = $this->subtotal + $this->tax_amount - $this->discount_amount;
        $this->save();
    }

    public function markAsPaid(float $amount = null): void
    {
        $this->update([
            'payment_status' => 'pagado',
            'amount_paid' => $amount ?? $this->total_amount,
            'paid_date' => now(),
            'status' => 'pagada',
        ]);
    }

    public function addPayment(float $amount): void
    {
        $this->amount_paid += $amount;
        
        if ($this->amount_paid >= $this->total_amount) {
            $this->payment_status = 'pagado';
            $this->paid_date = now();
        } else {
            $this->payment_status = 'parcial';
        }
        
        $this->save();
    }
}