<?php

namespace App\Exports;

use App\Models\Sale;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SalesReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
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
        $query = Sale::completed()
            ->whereBetween('sale_date', [$this->dateFrom, $this->dateTo])
            ->with(['customer', 'user', 'items.product.category']);

        // Aplicar filtros
        if (!empty($this->filters['category_id'])) {
            $query->whereHas('items.product', function ($q) {
                $q->where('category_id', $this->filters['category_id']);
            });
        }

        if (!empty($this->filters['payment_method'])) {
            $query->where('payment_method', $this->filters['payment_method']);
        }

        if (!empty($this->filters['user_id'])) {
            $query->where('user_id', $this->filters['user_id']);
        }

        return $query->orderBy('sale_date')->get();
    }

    public function headings(): array
    {
        return [
            'Fecha',
            'Nº Factura',
            'Cliente',
            'Vendedor',
            'Método de Pago',
            'Subtotal',
            'Descuento',
            'IVA',
            'Total',
            'Ganancia',
            'Margen %',
            'Estado',
            'Items',
        ];
    }

    public function map($sale): array
    {
        return [
            $sale->sale_date->format('d/m/Y H:i'),
            $sale->invoice_number,
            $sale->customer?->display_name ?? 'Cliente anónimo',
            $sale->user->name,
            $this->getPaymentMethodLabel($sale->payment_method),
            $sale->subtotal,
            $sale->discount_amount,
            $sale->tax_amount,
            $sale->total_amount,
            $sale->total_profit,
            $sale->profit_margin . '%',
            $sale->status,
            $sale->items->count(),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            'A:M' => ['alignment' => ['horizontal' => 'center']],
            'F:K' => ['numberFormat' => ['formatCode' => '#,##0.00']],
        ];
    }

    public function title(): string
    {
        return 'Reporte de Ventas';
    }

    private function getPaymentMethodLabel(string $method): string
    {
        $labels = [
            'efectivo' => 'Efectivo',
            'tarjeta_debito' => 'Tarjeta Débito',
            'tarjeta_credito' => 'Tarjeta Crédito',
            'transferencia' => 'Transferencia',
            'cheque' => 'Cheque',
            'cuenta_corriente' => 'Cuenta Corriente',
        ];

        return $labels[$method] ?? ucfirst($method);
    }
}