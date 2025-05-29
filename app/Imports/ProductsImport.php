<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;

class ProductsImport implements ToModel, WithHeadingRow, WithValidation
{
    use Importable;

    public function model(array $row)
    {
        // Buscar o crear categoría
        $category = Category::firstOrCreate(
            ['name' => $row['categoria']],
            [
                'slug' => \Str::slug($row['categoria']),
                'color' => '#66BB6A',
                'icon' => '🍎',
                'is_active' => true,
            ]
        );

        // Buscar proveedor si existe
        $supplier = null;
        if (!empty($row['proveedor'])) {
            $supplier = Supplier::where('name', $row['proveedor'])->first();
        }

        return new Product([
            'code' => $row['codigo'] ?? Product::generateUniqueCode(),
            'name' => $row['nombre'],
            'description' => $row['descripcion'] ?? null,
            'category_id' => $category->id,
            'supplier_id' => $supplier?->id,
            'cost_price' => $row['precio_costo'],
            'sale_price' => $row['precio_venta'],
            'wholesale_price' => $row['precio_mayorista'] ?? null,
            'stock_quantity' => $row['stock_actual'] ?? 0,
            'min_stock' => $row['stock_minimo'] ?? 0,
            'max_stock' => $row['stock_maximo'] ?? null,
            'unit' => $row['unidad'] ?? 'unidad',
            'barcode' => $row['codigo_barras'] ?? null,
            'is_perishable' => $this->parseBoolean($row['perecedero'] ?? false),
            'shelf_life_days' => $row['dias_vida_util'] ?? null,
            'is_active' => $this->parseBoolean($row['activo'] ?? true),
            'track_stock' => $this->parseBoolean($row['controlar_stock'] ?? true),
        ]);
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:200',
            'categoria' => 'required|string|max:100',
            'precio_costo' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
            'stock_actual' => 'nullable|numeric|min:0',
            'stock_minimo' => 'nullable|numeric|min:0',
            'unidad' => 'nullable|in:kg,g,unidad,caja,bolsa,litro,ml',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'categoria.required' => 'La categoría es obligatoria.',
            'precio_costo.required' => 'El precio de costo es obligatorio.',
            'precio_venta.required' => 'El precio de venta es obligatorio.',
        ];
    }

    private function parseBoolean($value): bool
    {
        if (is_bool($value)) return $value;
        if (is_string($value)) {
            return in_array(strtolower($value), ['sí', 'si', 'yes', 'true', '1', 'verdadero']);
        }
        return (bool) $value;
    }
}