<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'business_name',
        'tax_id',
        'contact_person',
        'phone',
        'email',
        'address',
        'city',
        'state',
        'postal_code',
        'payment_terms',
        'credit_limit',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'credit_limit' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'display_name',
        'total_purchases_amount',
        'pending_payments',
    ];

    // Relaciones
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('business_name', 'like', "%{$term}%")
              ->orWhere('contact_person', 'like', "%{$term}%")
              ->orWhere('phone', 'like', "%{$term}%")
              ->orWhere('email', 'like', "%{$term}%");
        });
    }

    // Accessors
    public function getDisplayNameAttribute(): string
    {
        return $this->business_name ?? $this->name;
    }

    public function getTotalPurchasesAmountAttribute(): float
    {
        return $this->purchases()->sum('total_amount');
    }

    public function getPendingPaymentsAttribute(): float
    {
        return $this->purchases()
            ->where('payment_status', 'pendiente')
            ->sum('total_amount');
    }

    // Métodos de negocio
    public function getMonthlyPurchases(int $month = null, int $year = null): float
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;

        return $this->purchases()
            ->whereMonth('purchase_date', $month)
            ->whereYear('purchase_date', $year)
            ->sum('total_amount');
    }

    public function getPaymentTermsLabel(): string
    {
        $terms = [
            'contado' => 'Contado',
            '30_dias' => '30 días',
            '60_dias' => '60 días',
            '90_dias' => '90 días',
        ];

        return $terms[$this->payment_terms] ?? $this->payment_terms;
    }

    public function getProductsCount(): int
    {
        return $this->products()->where('is_active', true)->count();
    }
}