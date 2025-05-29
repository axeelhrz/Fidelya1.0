<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Purchase;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ReportService
{
    public function generateSalesReport(Carbon $dateFrom, Carbon $dateTo, array $filters = []): array
    {
        $query = Sale::completed()
            ->whereBetween('sale_date', [$dateFrom, $dateTo])
            ->with(['items.product.category', 'customer', 'user']);

        // Aplicar filtros
        if (!empty($filters['category_id'])) {
            $query->whereHas('items.product', function ($q) use ($filters) {
                $q->where('category_id', $filters['category_id']);
            });
        }

        if (!empty($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        $sales = $query->get();

        return [
            'sales' => $sales,
            'summary' => $this->calculateSalesSummary($sales),
            'daily_breakdown' => $this->getDailyBreakdown($sales, $dateFrom, $dateTo),
            'top_products' => $this->getTopProductsFromSales($sales),
            'payment_methods' => $this->getPaymentMethodBreakdown($sales),
        ];
    }

    public function generateInventoryReport(array $filters = []): array
    {
        $query = Product::with(['category', 'supplier']);

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['supplier_id'])) {
            $query->where('supplier_id', $filters['supplier_id']);
        }

        if (!empty($filters['stock_status'])) {
            switch ($filters['stock_status']) {
                case 'low_stock':
                    $query->lowStock();
                    break;
                case 'out_of_stock':
                    $query->where('stock_quantity', '<=', 0);
                    break;
            }
        }

        $products = $query->get();

        return [
            'products' => $products,
            'summary' => $this->calculateInventorySummary($products),
            'category_breakdown' => $this->getCategoryBreakdown($products),
            'alerts' => $this->getInventoryAlerts($products),
        ];
    }

    private function calculateSalesSummary(Collection $sales): array
    {
        return [
            'total_sales' => $sales->sum('total_amount'),
            'total_profit' => $sales->sum('total_profit'),
            'total_cost' => $sales->sum('total_amount') - $sales->sum('total_profit'),
            'sales_count' => $sales->count(),
            'average_sale' => $sales->avg('total_amount'),
            'profit_margin' => $sales->sum('total_amount') > 0 
                ? ($sales->sum('total_profit') / $sales->sum('total_amount')) * 100 
                : 0,
        ];
    }

    private function calculateInventorySummary(Collection $products): array
    {
        return [
            'total_products' => $products->count(),
            'total_stock_value' => $products->sum(function ($product) {
                return $product->stock_quantity * $product->cost_price;
            }),
            'total_sale_value' => $products->sum(function ($product) {
                return $product->stock_quantity * $product->sale_price;
            }),
            'low_stock_count' => $products->filter->is_low_stock->count(),
            'out_of_stock_count' => $products->where('stock_quantity', '<=', 0)->count(),
        ];
    }

    private function getDailyBreakdown(Collection $sales, Carbon $dateFrom, Carbon $dateTo): Collection
    {
        $breakdown = collect();
        $current = $dateFrom->copy();

        while ($current <= $dateTo) {
            $dailySales = $sales->filter(function ($sale) use ($current) {
                return $sale->sale_date->isSameDay($current);
            });

            $breakdown->push([
                'date' => $current->format('Y-m-d'),
                'sales_count' => $dailySales->count(),
                'total_amount' => $dailySales->sum('total_amount'),
                'total_profit' => $dailySales->sum('total_profit'),
            ]);

            $current->addDay();
        }

        return $breakdown;
    }

    private function getTopProductsFromSales(Collection $sales): Collection
    {
        $productSales = collect();

        foreach ($sales as $sale) {
            foreach ($sale->items as $item) {
                $productId = $item->product_id;
                
                if (!$productSales->has($productId)) {
                    $productSales[$productId] = [
                        'product_name' => $item->product_name,
                        'category' => $item->product->category->name,
                        'quantity_sold' => 0,
                        'total_revenue' => 0,
                        'total_profit' => 0,
                    ];
                }

                $productSales[$productId]['quantity_sold'] += $item->quantity;
                $productSales[$productId]['total_revenue'] += $item->total;
                $productSales[$productId]['total_profit'] += $item->profit;
            }
        }

        return $productSales->sortByDesc('total_revenue')->take(10)->values();
    }

    private function getPaymentMethodBreakdown(Collection $sales): Collection
    {
        return $sales->groupBy('payment_method')
            ->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'total' => $group->sum('total_amount'),
                ];
            });
    }

    private function getCategoryBreakdown(Collection $products): Collection
    {
        return $products->groupBy('category.name')
            ->map(function ($group) {
                return [
                    'products_count' => $group->count(),
                    'stock_value' => $group->sum(function ($product) {
                        return $product->stock_quantity * $product->cost_price;
                    }),
                    'sale_value' => $group->sum(function ($product) {
                        return $product->stock_quantity * $product->sale_price;
                    }),
                ];
            });
    }

    private function getInventoryAlerts(Collection $products): array
    {
        return [
            'low_stock' => $products->filter->is_low_stock->values(),
            'out_of_stock' => $products->where('stock_quantity', '<=', 0)->values(),
            'expiring_soon' => $products->filter(function ($product) {
                return $product->is_perishable && 
                       $product->days_to_expire !== null && 
                       $product->days_to_expire <= 7;
            })->values(),
        ];
    }
}