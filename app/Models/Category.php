<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Eventos del modelo
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name')) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    // Relaciones
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeWithProductCount($query)
    {
        return $query->withCount(['products' => function ($query) {
            $query->where('is_active', true);
        }]);
    }

    // Accessors
    public function getProductsCountAttribute(): int
    {
        return $this->products()->where('is_active', true)->count();
    }

    public function getTotalStockValueAttribute(): float
    {
        return $this->products()
            ->where('is_active', true)
            ->selectRaw('SUM(stock_quantity * cost_price) as total')
            ->value('total') ?? 0;
    }

    // Métodos de negocio
    public function getLowStockProducts()
    {
        return $this->products()
            ->where('is_active', true)
            ->where('track_stock', true)
            ->whereRaw('stock_quantity <= min_stock')
            ->get();
    }
}