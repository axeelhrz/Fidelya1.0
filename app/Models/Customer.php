<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'last_name',
        'business_name',
        'customer_type',
        'tax_id',
        'phone',
        'email',
        'address',
        'city',
        'birth_date',
        'preferred_payment',
        'credit_limit',
        'total_purchases',
        'total_orders',
        'last_purchase_at',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'credit_limit' => 'decimal:2',
        'total_purchases' => 'decimal:2',
        'last_purchase_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'full_name',
        'display_name',
        'days_since_last_purchase',
        'average_purchase',
    ];

    // Relaciones
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeIndividuals($query)
    {
        return $query->where('customer_type', 'individual');
    }

    public function scopeBusinesses($query)
    {
        return $query->where('customer_type', 'business');
    }

    public function scopeWithRecentPurchases($query, $days = 30)
    {
        return $query->where('last_purchase_at', '>=', now()->subDays($days));
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('last_name', 'like', "%{$term}%")
              ->orWhere('business_name', 'like', "%{$term}%")
              ->orWhere('phone', 'like', "%{$term}%")
              ->orWhere('email', 'like', "%{$term}%");
        });
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        if ($this->customer_type === 'business') {
            return $this->business_name ?? $this->name;
        }
        
        return trim($this->name . ' ' . $this->last_name);
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->full_name;
    }

    public function getDaysSinceLastPurchaseAttribute(): ?int
    {
        return $this->last_purchase_at 
            ? $this->last_purchase_at->diffInDays(now()) 
            : null;
    }

    public function getAveragePurchaseAttribute(): float
    {
        return $this->total_orders > 0 
            ? $this->total_purchases / $this->total_orders 
            : 0;
    }

    // Métodos de negocio
    public function updateTotals(): void
    {
        $completedSales = $this->sales()->completed()->get();
        
        $this->update([
            'total_purchases' => $completedSales->sum('total_amount'),
            'total_orders' => $completedSales->count(),
            'last_purchase_at' => $completedSales->max('sale_date'),
        ]);
    }

    public function getMonthlyPurchases(int $month = null, int $year = null): float
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;

        return $this->sales()
            ->completed()
            ->whereMonth('sale_date', $month)
            ->whereYear('sale_date', $year)
            ->sum('total_amount');
    }

    public function hasAvailableCredit(float $amount): bool
    {
        if ($this->credit_limit <= 0) return false;
        
        $pendingAmount = $this->sales()
            ->where('payment_status', 'pendiente')
            ->sum('total_amount');
            
        return ($pendingAmount + $amount) <= $this->credit_limit;
    }

    public function getPendingBalance(): float
    {
        return $this->sales()
            ->where('payment_status', 'pendiente')
            ->sum('total_amount');
    }
}