<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'product_name',
        'product_code',
        'unit_cost',
        'quantity',
        'unit',
        'expiry_date',
        'batch_number',
        'subtotal',
        'discount_amount',
        'total',
    ];

    protected $casts = [
        'unit_cost' => 'decimal:2',
        'quantity' => 'decimal:3',
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'expiry_date' => 'date',
    ];

    // Relaciones
    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}