<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InventoryReportExport implements WithMultipleSheets
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function sheets(): array
    {
        return [
            new InventorySheet($this->filters),
            new LowStockSheet(),
            new ExpiringProductsSheet(),
        ];
    }
}

class InventorySheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
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

        if (!empty($this->filters['supplier_id'])) {
            $query->where('supplier_id', $this->filters['supplier_id']);
        }

        return $query->where('is_active', true)->orderBy('name')->get();
    }

    public function headings(): array
    {
        return [
            'Producto',
            'Categoría',
            'Stock Actual',
            'Unidad',
            'Valor Costo',
            'Valor Venta',
            'Ganancia Potencial',
            'Estado',
        ];
    }

    public function map($product): array
    {
        $stockValue = $product->stock_quantity * $product->cost_price;
        $saleValue = $product->stock_quantity * $product->sale_price;
        $potentialProfit = $saleValue - $stockValue;

        return [
            $product->name,
            $product->category->name,
            $product->stock_quantity,
            $product->unit,
            $stockValue,
            $saleValue,
            $potentialProfit,
            $this->getStockStatusLabel($product->stock_status),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            'A:H' => ['alignment' => ['horizontal' => 'center']],
            'C' => ['numberFormat' => ['formatCode' => '#,##0.000']],
            'E:G' => ['numberFormat' => ['formatCode' => '#,##0.00']],
        ];
    }

    public function title(): string
    {
        return 'Inventario General';
    }

    private function getStockStatusLabel(string $status): string
    {
        $labels = [
            'in_stock' => 'En Stock',
            'low_stock' => 'Stock Bajo',
            'out_of_stock' => 'Sin Stock',
            'overstock' => 'Sobrestock',
        ];

        return $labels[$status] ?? $status;
    }
}

class LowStockSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function collection()
    {
        return Product::lowStock()
            ->with(['category'])
            ->orderBy('stock_quantity')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Producto',
            'Categoría',
            'Stock Actual',
            'Stock Mínimo',
            'Diferencia',
            'Unidad',
            'Urgencia',
        ];
    }

    public function map($product): array
    {
        $difference = $product->stock_quantity - $product->min_stock;
        $urgency = $product->stock_quantity <= 0 ? 'CRÍTICO' : 'BAJO';

        return [
            $product->name,
            $product->category->name,
            $product->stock_quantity,
            $product->min_stock,
            $difference,
            $product->unit,
            $urgency,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            'A:G' => ['alignment' => ['horizontal' => 'center']],
            'C:E' => ['numberFormat' => ['formatCode' => '#,##0.000']],
        ];
    }

    public function title(): string
    {
        return 'Stock Bajo';
    }
}

class ExpiringProductsSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function collection()
    {
        return Product::expiringSoon(30)
            ->with(['category'])
            ->orderBy('expiry_date')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Producto',
            'Categoría',
            'Stock Actual',
            'Fecha Vencimiento',
            'Días Restantes',
            'Valor en Riesgo',
            'Urgencia',
        ];
    }

    public function map($product): array
    {
        $daysToExpire = $product->days_to_expire;
        $valueAtRisk = $product->stock_quantity * $product->cost_price;
        
        $urgency = 'MEDIA';
        if ($daysToExpire <= 1) $urgency = 'CRÍTICA';
        elseif ($daysToExpire <= 3) $urgency = 'ALTA';
        elseif ($daysToExpire <= 7) $urgency = 'MEDIA';

        return [
            $product->name,
            $product->category->name,
            $product->stock_quantity,
            $product->expiry_date?->format('d/m/Y'),
            $daysToExpire,
            $valueAtRisk,
            $urgency,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            'A:G' => ['alignment' => ['horizontal' => 'center']],
            'C' => ['numberFormat' => ['formatCode' => '#,##0.000']],
            'F' => ['numberFormat' => ['formatCode' => '#,##0.00']],
        ];
    }

    public function title(): string
    {
        return 'Productos por Vencer';
    }
}