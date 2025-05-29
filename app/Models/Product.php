<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'code',
        'sku',
        'barcode',
        'description',
        'short_description',
        'category_id',
        'supplier_id',
        'cost_price',
        'sale_price',
        'wholesale_price',
        'min_price',
        'max_discount_percent',
        'stock_quantity',
        'min_stock',
        'max_stock',
        'track_stock',
        'allow_negative_stock',
        'unit',
        'unit_weight',
        'package_type',
        'expiry_date',
        'shelf_life_days',
        'harvest_date',
        'origin',
        'origin_country',
        'quality_grade',
        'is_organic',
        'is_seasonal',
        'seasonal_months',
        'is_active',
        'is_featured',
        'requires_refrigeration',
        'display_order',
        'image',
        'gallery',
        'meta_title',
        'meta_description',
        'tags',
        // Campos de compatibilidad
        'image_path',
        'is_perishable',
    ];

    protected $casts = [
        'cost_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'wholesale_price' => 'decimal:2',
        'min_price' => 'decimal:2',
        'max_discount_percent' => 'decimal:2',
        'stock_quantity' => 'decimal:3',
        'min_stock' => 'decimal:3',
        'max_stock' => 'decimal:3',
        'unit_weight' => 'decimal:3',
        'track_stock' => 'boolean',
        'allow_negative_stock' => 'boolean',
        'expiry_date' => 'date',
        'harvest_date' => 'date',
        'is_organic' => 'boolean',
        'is_seasonal' => 'boolean',
        'seasonal_months' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'requires_refrigeration' => 'boolean',
        'gallery' => 'array',
        'tags' => 'array',
        // Campos de compatibilidad
        'is_perishable' => 'boolean',
    ];

    protected $appends = [
        'profit_margin_percentage',
        'stock_status',
        'image_url',
        'is_low_stock',
        'is_expired',
        'days_to_expire',
    ];

    // Eventos del modelo
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->code)) {
                $product->code = static::generateUniqueCode();
            }
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name') && empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    // Relaciones
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function purchaseItems(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->where('track_stock', true)
                    ->whereRaw('stock_quantity <= min_stock');
    }

    public function scopeExpiringSoon($query, $days = 7)
    {
        return $query->where('requires_refrigeration', true)
                    ->whereNotNull('expiry_date')
                    ->whereBetween('expiry_date', [now(), now()->addDays($days)]);
    }

    public function scopeExpired($query)
    {
        return $query->where('requires_refrigeration', true)
                    ->whereNotNull('expiry_date')
                    ->where('expiry_date', '<', now());
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('code', 'like', "%{$term}%")
              ->orWhere('sku', 'like', "%{$term}%")
              ->orWhere('barcode', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%");
        });
    }

    // Accessors
    public function getProfitMarginPercentageAttribute(): float
    {
        if ($this->cost_price <= 0) return 0;
        return round((($this->sale_price - $this->cost_price) / $this->cost_price) * 100, 2);
    }

    public function getStockStatusAttribute(): string
    {
        if (!$this->track_stock) return 'no_tracked';
        if ($this->stock_quantity <= 0) return 'out_of_stock';
        if ($this->stock_quantity <= $this->min_stock) return 'low_stock';
        if ($this->max_stock && $this->stock_quantity >= $this->max_stock) return 'overstock';
        return 'in_stock';
    }

    public function getImageUrlAttribute(): string
    {
        $imagePath = $this->image ?: $this->image_path;
        return $imagePath 
            ? asset('storage/' . $imagePath)
            : asset('images/product-placeholder.png');
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->track_stock && $this->stock_quantity <= $this->min_stock;
    }

    public function getIsExpiredAttribute(): bool
    {
        return ($this->requires_refrigeration || $this->is_perishable) && 
               $this->expiry_date && 
               $this->expiry_date->isPast();
    }

    public function getDaysToExpireAttribute(): ?int
    {
        if ((!$this->requires_refrigeration && !$this->is_perishable) || !$this->expiry_date) return null;
        return max(0, now()->diffInDays($this->expiry_date, false));
    }

    // Accessor para compatibilidad
    public function getIsPerishableAttribute(): bool
    {
        return $this->requires_refrigeration || $this->attributes['is_perishable'] ?? false;
    }

    // Métodos de negocio
    public static function generateUniqueCode(): string
    {
        do {
            $code = 'PRD' . str_pad(random_int(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (static::where('code', $code)->exists());

        return $code;
    }

    public function updateStock(float $quantity, string $type, string $reason, $reference = null, ?User $user = null): void
    {
        if (!$this->track_stock) return;

        $previousStock = $this->stock_quantity;
        
        if ($type === 'entrada') {
            $this->stock_quantity += $quantity;
        } else {
            $this->stock_quantity -= $quantity;
        }

        $this->save();

        // Registrar movimiento de stock
        $this->stockMovements()->create([
            'user_id' => $user?->id ?? auth()->id(),
            'type' => $type,
            'reason' => $reason,
            'quantity' => $quantity,
            'previous_stock' => $previousStock,
            'new_stock' => $this->stock_quantity,
            'unit_cost' => $this->cost_price,
            'reference_type' => $reference ? get_class($reference) : null,
            'reference_id' => $reference?->id,
            'movement_date' => now(),
        ]);
    }

    public function getTotalSold(string $period = 'month'): float
    {
        $query = $this->saleItems()
            ->whereHas('sale', function ($q) {
                $q->where('status', 'completada');
            });

        switch ($period) {
            case 'today':
                $query->whereHas('sale', fn($q) => $q->whereDate('sale_date', today()));
                break;
            case 'week':
                $query->whereHas('sale', fn($q) => $q->whereBetween('sale_date', [now()->startOfWeek(), now()->endOfWeek()]));
                break;
            case 'month':
                $query->whereHas('sale', fn($q) => $q->whereMonth('sale_date', now()->month));
                break;
        }

        return $query->sum('quantity');
    }

    public function getStockValue(): float
    {
        return $this->stock_quantity * $this->cost_price;
    }
}