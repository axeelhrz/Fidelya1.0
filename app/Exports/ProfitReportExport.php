<?php

namespace App\Exports;

use App\Models\Sale;
use App\Models\Purchase;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProfitReportExport implements WithMultipleSheets
{
    protected $dateFrom;
    protected $dateTo;
    protected $filters;

    public function __construct(Carbon $dateFrom, Carbon $dateTo, array $filters = [])
    {
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
        $this->filters = $filters;
    }

    public function sheets(): array
    {
        return [
            new ProfitSummarySheet($this->dateFrom, $this->dateTo, $this->filters),
            new DailyProfitSheet($this->dateFrom, $this->dateTo, $this->filters),
            new ProductProfitSheet($this->dateFrom, $this->dateTo, $this->filters),
        ];
    }
}

class ProfitSummarySheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $dateFrom;
    protected $dateTo;
    protected $filters;

    public function __construct(Carbon $dateFrom, Carbon $dateTo, array $filters = [])
    {
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
        $this->filters = $filters;
    }

    public function collection()
    {
        // Obtener ventas del período
        $salesQuery = Sale::completed()
            ->whereBetween('sale_date', [$this->dateFrom, $this->dateTo]);

        if (!empty($this->filters['category_id'])) {
            $salesQuery->whereHas('items.product', function ($q) {
                $q->where('category_id', $this->filters['category_id']);
            });
        }

        $sales = $salesQuery->get();

        // Obtener compras del período
        $purchases = Purchase::whereBetween('purchase_date', [$this->dateFrom, $this->dateTo])->get();

        // Crear resumen
        $totalRevenue = $sales->sum('total_amount');
        $totalCosts = $purchases->sum('total_amount');
        $totalProfit = $sales->sum('total_profit');
        $netProfit = $totalRevenue - $totalCosts;

        return collect([
            (object)[
                'concept' => 'Ingresos por Ventas',
                'amount' => $totalRevenue,
                'type' => 'income'
            ],
            (object)[
                'concept' => 'Costos de Productos Vendidos',
                'amount' => $totalRevenue - $totalProfit,
                'type' => 'cost'
            ],
            (object)[
                'concept' => 'Ganancia Bruta',
                'amount' => $totalProfit,
                'type' => 'profit'
            ],
            (object)[
                'concept' => 'Gastos en Compras',
                'amount' => $totalCosts,
                'type' => 'expense'
            ],
            (object)[
                'concept' => 'Ganancia Neta',
                'amount' => $netProfit,
                'type' => 'net_profit'
            ],
        ]);
    }

    public function headings(): array
    {
        return [
            'Concepto',
            'Monto',
            'Tipo',
        ];
    }

    public function map($item): array
    {
        return [
            $item->concept,
            $item->amount,
            $this->getTypeLabel($item->type),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            'A:C' => ['alignment' => ['horizontal' => 'center']],
            'B' => ['numberFormat' => ['formatCode' => '#,##0.00']],
        ];
    }

    public function title(): string
    {
        return 'Resumen de Ganancias';
    }

    private function getTypeLabel(string $type): string
    {
        $labels = [
            'income' => 'Ingreso',
            'cost' => 'Costo',
            'profit' => 'Ganancia',
            'expense' => 'Gasto',
            'net_profit' => 'Ganancia Neta',
        ];

        return $labels[$type] ?? $type;
    }
}

class DailyProfitSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $dateFrom;
    protected $dateTo;
    protected $filters;

    public function __construct(Carbon $dateFrom, Carbon $dateTo, array $filters = [])
    {
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
        $this->filters = $filters;
    }

    public function collection()
    {
        $data = collect();
        $current = $this->dateFrom->copy();

        while ($current <= $this->dateTo) {
            // Ventas del día
            $dailySales = Sale::completed()
                ->whereDate('sale_date', $current)
                ->when(!empty($this->filters['category_id']), function ($q) {
                    $q->whereHas('items.product', function ($query) {
                        $query->where('category_id', $this->filters['category_id']);
                    });
                })
                ->get();

            // Compras del día
            $dailyPurchases = Purchase::whereDate('purchase_date', $current)->get();

            $revenue = $dailySales->sum('total_amount');
            $profit = $dailySales->sum('total_profit');
            $costs = $dailyPurchases->sum('total_amount');
            $netProfit = $revenue - $costs;

            $data->push((object)[
                'date' => $current->format('d/m/Y'),
                'revenue' => $revenue,
                'profit' => $profit,
                'costs' => $costs,
                'net_profit' => $netProfit,
                'profit_margin' => $revenue > 0 ? ($profit / $revenue) * 100 : 0,
            ]);

            $current->addDay();
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'Fecha',
            'Ingresos',
            'Ganancia Bruta',
            'Gastos',
            'Ganancia Neta',
            'Margen %',
        ];
    }

    public function map($item): array
    {
        return [
            $item->date,
            $item->revenue,
            $item->profit,
            $item->costs,
            $item->net_profit,
            round($item->profit_margin, 2) . '%',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            'A:F' => ['alignment' => ['horizontal' => 'center']],
            'B:E' => ['numberFormat' => ['formatCode' => '#,##0.00']],
        ];
    }

    public function title(): string
    {
        return 'Ganancias Diarias';
    }
}

class ProductProfitSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $dateFrom;
    protected $dateTo;
    protected $filters;

    public function __construct(Carbon $dateFrom, Carbon $dateTo, array $filters = [])
    {
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = \App\Models\Product::active()
            ->withSum(['saleItems as total_profit' => function ($q) {
                $q->whereHas('sale', function ($sale) {
                    $sale->completed()->whereBetween('sale_date', [$this->dateFrom, $this->dateTo]);
                });
            }], 'profit')
            ->withSum(['saleItems as total_revenue' => function ($q) {
                $q->whereHas('sale', function ($sale) {
                    $sale->completed()->whereBetween('sale_date', [$this->dateFrom, $this->dateTo]);
                });
            }], 'total')
            ->withSum(['saleItems as quantity_sold' => function ($q) {
                $q->whereHas('sale', function ($sale) {
                    $sale->completed()->whereBetween('sale_date', [$this->dateFrom, $this->dateTo]);
                });
            }], 'quantity')
            ->with('category');

        if (!empty($this->filters['category_id'])) {
            $query->where('category_id', $this->filters['category_id']);
        }

        return $query->having('total_profit', '>', 0)
            ->orderByDesc('total_profit')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Producto',
            'Categoría',
            'Cantidad Vendida',
            'Ingresos',
            'Ganancia',
            'Margen %',
        ];
    }

    public function map($product): array
    {
        $revenue = $product->total_revenue ?? 0;
        $profit = $product->total_profit ?? 0;
        $margin = $revenue > 0 ? ($profit / $revenue) * 100 : 0;

        return [
            $product->name,
            $product->category->name,
            $product->quantity_sold ?? 0,
            $revenue,
            $profit,
            round($margin, 2) . '%',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            'A:F' => ['alignment' => ['horizontal' => 'center']],
            'C' => ['numberFormat' => ['formatCode' => '#,##0.000']],
            'D:E' => ['numberFormat' => ['formatCode' => '#,##0.00']],
        ];
    }

    public function title(): string
    {
        return 'Ganancias por Producto';
    }
}