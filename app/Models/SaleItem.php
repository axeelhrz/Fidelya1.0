<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaleItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'product_id',
        'product_name',
        'product_code',
        'unit_price',
        'unit_cost',
        'quantity',
        'unit',
        'discount_percentage',
        'discount_amount',
        'subtotal',
        'total',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'quantity' => 'decimal:3',
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    protected $appends = [
        'profit',
        'profit_margin',
    ];

    // Relaciones
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Accessors
    public function getProfitAttribute(): float
    {
        return $this->total - ($this->unit_cost * $this->quantity);
    }

    public function getProfitMarginAttribute(): float
    {
        if ($this->total <= 0) return 0;
        return round(($this->profit / $this->total) * 100, 2);
    }
}