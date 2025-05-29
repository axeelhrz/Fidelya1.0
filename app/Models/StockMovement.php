<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'type',
        'reason',
        'quantity',
        'previous_stock',
        'new_stock',
        'unit_cost',
        'reference_type',
        'reference_id',
        'reference_number',
        'notes',
        'movement_date',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'previous_stock' => 'decimal:3',
        'new_stock' => 'decimal:3',
        'unit_cost' => 'decimal:2',
        'movement_date' => 'datetime',
    ];

    protected $appends = [
        'type_label',
        'reason_label',
    ];

    // Relaciones
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('movement_date', '>=', now()->subDays($days));
    }

    // Accessors
    public function getTypeLabelAttribute(): string
    {
        $labels = [
            'entrada' => 'Entrada',
            'salida' => 'Salida',
            'ajuste' => 'Ajuste',
            'merma' => 'Merma',
            'devolucion' => 'Devolución',
        ];

        return $labels[$this->type] ?? $this->type;
    }

    public function getReasonLabelAttribute(): string
    {
        $labels = [
            'compra' => 'Compra',
            'venta' => 'Venta',
            'ajuste_inventario' => 'Ajuste de Inventario',
            'producto_vencido' => 'Producto Vencido',
            'producto_dañado' => 'Producto Dañado',
            'devolucion_cliente' => 'Devolución de Cliente',
            'devolucion_proveedor' => 'Devolución a Proveedor',
            'transferencia' => 'Transferencia',
            'muestra_gratis' => 'Muestra Gratis',
            'uso_interno' => 'Uso Interno',
        ];

        return $labels[$this->reason] ?? $this->reason;
    }
}