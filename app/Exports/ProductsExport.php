<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Product::with(['category', 'supplier']);

        if (!empty($this->filters['category_id'])) {
            $query->where('category_id', $this->filters['category_id']);
        }

        if (!empty($this->filters['status'])) {
            switch ($this->filters['status']) {
                case 'active':
                    $query->where('is_active', true);
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
                case 'low_stock':
                    $query->lowStock();
                    break;
                case 'expiring':
                    $query->expiringSoon(7);
                    break;
            }
        }

        if (!empty($this->filters['search'])) {
            $query->search($this->filters['search']);
        }

        return $query->orderBy('name')->get();
    }

    public function headings(): array
    {
        return [
            'Código',
            'Nombre',
            'Categoría',
            'Proveedor',
            'Precio Costo',
            'Precio Venta',
            'Margen %',
            'Stock Actual',
            'Stock Mínimo',
            'Stock Máximo',
            'Unidad',
            'Código Barras',
            'Perecedero',
            'Fecha Vencimiento',
            'Estado Stock',
            'Activo',
        ];
    }

    public function map($product): array
    {
        return [
            $product->code,
            $product->name,
            $product->category->name,
            $product->supplier?->display_name ?? 'Sin proveedor',
            $product->cost_price,
            $product->sale_price,
            $product->profit_margin_percentage . '%',
            $product->stock_quantity,
            $product->min_stock,
            $product->max_stock,
            $product->unit,
            $product->barcode,
            $product->is_perishable ? 'Sí' : 'No',
            $product->expiry_date?->format('d/m/Y'),
            $this->getStockStatusLabel($product->stock_status),
            $product->is_active ? 'Activo' : 'Inactivo',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            'A:P' => ['alignment' => ['horizontal' => 'center']],
            'E:F' => ['numberFormat' => ['formatCode' => '#,##0.00']],
            'H:J' => ['numberFormat' => ['formatCode' => '#,##0.000']],
        ];
    }

    public function title(): string
    {
        return 'Inventario de Productos';
    }

    private function getStockStatusLabel(string $status): string
    {
        $labels = [
            'in_stock' => 'En Stock',
            'low_stock' => 'Stock Bajo',
            'out_of_stock' => 'Sin Stock',
            'overstock' => 'Sobrestock',
            'no_tracked' => 'No Rastreado',
        ];

        return $labels[$status] ?? $status;
    }
}