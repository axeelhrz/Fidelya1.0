<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Product;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SalesReportExport;
use App\Exports\InventoryReportExport;
use App\Exports\ProfitReportExport;

class ReportController extends Controller
{
    public function index()
    {
        $categories = Category::active()->orderBy('name')->get();
        $suppliers = Supplier::active()->orderBy('name')->get();
        
        return view('reports.index', compact('categories', 'suppliers'));
    }

    public function sales(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'group_by' => 'in:day,week,month',
            'category_id' => 'nullable|exists:categories,id',
            'payment_method' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
            'customer_id' => 'nullable|exists:customers,id',
        ]);

        $dateFrom = Carbon::parse($request->date_from)->startOfDay();
        $dateTo = Carbon::parse($request->date_to)->endOfDay();
        $groupBy = $request->group_by ?? 'day';

        // Consulta base
        $query = Sale::completed()
            ->whereBetween('sale_date', [$dateFrom, $dateTo])
            ->with(['items.product.category', 'user', 'customer']);

        // Filtros adicionales
        if ($request->category_id) {
            $query->whereHas('items.product', function ($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        if ($request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }

        $sales = $query->get();

        // Agrupar datos según el período
        $groupedData = $this->groupSalesData($sales, $groupBy, $dateFrom, $dateTo);

        // Estadísticas generales
        $stats = [
            'total_sales' => $sales->sum('total_amount'),
            'total_profit' => $sales->sum('total_profit'),
            'total_cost' => $sales->sum('total_amount') - $sales->sum('total_profit'),
            'sales_count' => $sales->count(),
            'average_sale' => $sales->count() > 0 ? $sales->avg('total_amount') : 0,
            'profit_margin' => $sales->sum('total_amount') > 0 
                ? round(($sales->sum('total_profit') / $sales->sum('total_amount')) * 100, 2)
                : 0,
            'items_sold' => $sales->flatMap->items->sum('quantity'),
        ];

        // Top productos
        $topProducts = $this->getTopProductsInPeriod($dateFrom, $dateTo, $request->category_id);

        // Métodos de pago
        $paymentMethods = $sales->groupBy('payment_method')
            ->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'total' => $group->sum('total_amount'),
                    'percentage' => 0, // Se calculará en el frontend
                ];
            });

        // Ventas por vendedor
        $salesByUser = $sales->groupBy('user.name')
            ->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'total' => $group->sum('total_amount'),
                    'profit' => $group->sum('total_profit'),
                ];
            });

        // Ventas por categoría
        $salesByCategory = $this->getSalesByCategory($sales);

        if ($request->ajax()) {
            return response()->json([
                'grouped_data' => $groupedData,
                'stats' => $stats,
                'top_products' => $topProducts,
                'payment_methods' => $paymentMethods,
                'sales_by_user' => $salesByUser,
                'sales_by_category' => $salesByCategory,
            ]);
        }

        return view('reports.sales', compact(
            'groupedData', 'stats', 'topProducts', 'paymentMethods', 
            'salesByUser', 'salesByCategory', 'dateFrom', 'dateTo'
        ));
    }

    public function inventory(Request $request)
    {
        $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'stock_status' => 'nullable|in:all,low_stock,out_of_stock,overstock',
            'include_inactive' => 'boolean',
        ]);

        $query = Product::with(['category', 'supplier'])
            ->when(!$request->include_inactive, function ($q) {
                $q->where('is_active', true);
            })
            ->when($request->category_id, function ($q) use ($request) {
                $q->where('category_id', $request->category_id);
            })
            ->when($request->supplier_id, function ($q) use ($request) {
                $q->where('supplier_id', $request->supplier_id);
            })
            ->when($request->stock_status, function ($q) use ($request) {
                switch ($request->stock_status) {
                    case 'low_stock':
                        $q->lowStock();
                        break;
                    case 'out_of_stock':
                        $q->where('stock_quantity', '<=', 0);
                        break;
                    case 'overstock':
                        $q->whereRaw('stock_quantity > max_stock AND max_stock IS NOT NULL');
                        break;
                }
            });

        $products = $query->get();

        // Estadísticas del inventario
        $stats = [
            'total_products' => $products->count(),
            'total_stock_value' => $products->sum(function ($product) {
                return $product->stock_quantity * $product->cost_price;
            }),
            'total_sale_value' => $products->sum(function ($product) {
                return $product->stock_quantity * $product->sale_price;
            }),
            'low_stock_count' => $products->filter(function ($product) {
                return $product->is_low_stock;
            })->count(),
            'out_of_stock_count' => $products->filter(function ($product) {
                return $product->stock_quantity <= 0;
            })->count(),
            'expiring_soon_count' => $products->filter(function ($product) {
                return $product->is_perishable && $product->days_to_expire !== null && $product->days_to_expire <= 7;
            })->count(),
        ];

        // Valor por categoría
        $valueByCategory = $products->groupBy('category.name')
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

        // Productos con movimiento reciente
        $recentMovements = $this->getRecentStockMovements();

        if ($request->ajax()) {
            return response()->json([
                'products' => $products,
                'stats' => $stats,
                'value_by_category' => $valueByCategory,
                'recent_movements' => $recentMovements,
            ]);
        }

        return view('reports.inventory', compact(
            'products', 'stats', 'valueByCategory', 'recentMovements'
        ));
    }

    public function profit(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'group_by' => 'in:day,week,month',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $dateFrom = Carbon::parse($request->date_from)->startOfDay();
        $dateTo = Carbon::parse($request->date_to)->endOfDay();
        $groupBy = $request->group_by ?? 'day';

        // Ventas en el período
        $salesQuery = Sale::completed()
            ->whereBetween('sale_date', [$dateFrom, $dateTo])
            ->with(['items.product.category']);

        if ($request->category_id) {
            $salesQuery->whereHas('items.product', function ($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        $sales = $salesQuery->get();

        // Compras en el período
        $purchasesQuery = Purchase::whereBetween('purchase_date', [$dateFrom, $dateTo]);
        
        if ($request->category_id) {
            $purchasesQuery->whereHas('items.product', function ($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        $purchases = $purchasesQuery->get();

        // Calcular ingresos y egresos por período
        $profitData = $this->calculateProfitByPeriod($sales, $purchases, $groupBy, $dateFrom, $dateTo);

        // Estadísticas generales
        $totalRevenue = $sales->sum('total_amount');
        $totalCosts = $purchases->sum('total_amount');
        $totalProfit = $sales->sum('total_profit');
        $netProfit = $totalRevenue - $totalCosts;

        $stats = [
            'total_revenue' => $totalRevenue,
            'total_costs' => $totalCosts,
            'total_profit' => $totalProfit,
            'net_profit' => $netProfit,
            'profit_margin' => $totalRevenue > 0 ? round(($totalProfit / $totalRevenue) * 100, 2) : 0,
            'roi' => $totalCosts > 0 ? round(($netProfit / $totalCosts) * 100, 2) : 0,
        ];

        // Profit por categoría
        $profitByCategory = $this->getProfitByCategory($sales, $request->category_id);

        // Productos más rentables
        $mostProfitableProducts = $this->getMostProfitableProducts($dateFrom, $dateTo, $request->category_id);

        if ($request->ajax()) {
            return response()->json([
                'profit_data' => $profitData,
                'stats' => $stats,
                'profit_by_category' => $profitByCategory,
                'most_profitable_products' => $mostProfitableProducts,
            ]);
        }

        return view('reports.profit', compact(
            'profitData', 'stats', 'profitByCategory', 'mostProfitableProducts', 'dateFrom', 'dateTo'
        ));
    }

    public function customers(Request $request)
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'min_purchases' => 'nullable|integer|min:1',
        ]);

        $query = Customer::with(['sales' => function ($q) use ($request) {
            if ($request->date_from && $request->date_to) {
                $q->whereBetween('sale_date', [
                    Carbon::parse($request->date_from)->startOfDay(),
                    Carbon::parse($request->date_to)->endOfDay()
                ]);
            }
            $q->completed();
        }]);

        if ($request->min_purchases) {
            $query->has('sales', '>=', $request->min_purchases);
        }

        $customers = $query->get()->map(function ($customer) {
            $sales = $customer->sales;
            return [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'total_purchases' => $sales->sum('total_amount'),
                'purchases_count' => $sales->count(),
                'average_purchase' => $sales->count() > 0 ? $sales->avg('total_amount') : 0,
                'last_purchase' => $sales->max('sale_date'),
                'first_purchase' => $sales->min('sale_date'),
            ];
        })->sortByDesc('total_purchases');

        // Estadísticas de clientes
        $stats = [
            'total_customers' => $customers->count(),
            'active_customers' => $customers->filter(function ($customer) {
                return $customer['purchases_count'] > 0;
            })->count(),
            'total_revenue' => $customers->sum('total_purchases'),
            'average_customer_value' => $customers->count() > 0 ? $customers->avg('total_purchases') : 0,
            'top_customer_value' => $customers->max('total_purchases') ?? 0,
        ];

        if ($request->ajax()) {
            return response()->json([
                'customers' => $customers->values(),
                'stats' => $stats,
            ]);
        }

        return view('reports.customers', compact('customers', 'stats'));
    }

    public function exportSales(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'format' => 'required|in:excel,pdf',
        ]);

        $dateFrom = Carbon::parse($request->date_from);
        $dateTo = Carbon::parse($request->date_to);
        $filename = "reporte_ventas_{$dateFrom->format('Y-m-d')}_al_{$dateTo->format('Y-m-d')}";

        if ($request->format === 'excel') {
            return Excel::download(
                new SalesReportExport($dateFrom, $dateTo, $request->all()),
                $filename . '.xlsx'
            );
        } else {
            $data = $this->getSalesReportData($dateFrom, $dateTo, $request->all());
            $pdf = Pdf::loadView('reports.pdf.sales', compact('data', 'dateFrom', 'dateTo'));
            return $pdf->download($filename . '.pdf');
        }
    }

    public function exportInventory(Request $request)
    {
        $request->validate([
            'format' => 'required|in:excel,pdf',
        ]);

        $filename = "reporte_inventario_" . now()->format('Y-m-d_H-i-s');

        if ($request->format === 'excel') {
            return Excel::download(
                new InventoryReportExport($request->all()),
                $filename . '.xlsx'
            );
        } else {
            $data = $this->getInventoryReportData($request->all());
            $pdf = Pdf::loadView('reports.pdf.inventory', compact('data'));
            return $pdf->download($filename . '.pdf');
        }
    }

    public function exportProfit(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'format' => 'required|in:excel,pdf',
        ]);

        $dateFrom = Carbon::parse($request->date_from);
        $dateTo = Carbon::parse($request->date_to);
        $filename = "reporte_ganancias_{$dateFrom->format('Y-m-d')}_al_{$dateTo->format('Y-m-d')}";

        if ($request->format === 'excel') {
            return Excel::download(
                new ProfitReportExport($dateFrom, $dateTo, $request->all()),
                $filename . '.xlsx'
            );
        } else {
            $data = $this->getProfitReportData($dateFrom, $dateTo, $request->all());
            $pdf = Pdf::loadView('reports.pdf.profit', compact('data', 'dateFrom', 'dateTo'));
            return $pdf->download($filename . '.pdf');
        }
    }

    // Métodos privados auxiliares

    private function groupSalesData($sales, $groupBy, $dateFrom, $dateTo)
    {
        $grouped = collect();
        $current = $dateFrom->copy();

        while ($current <= $dateTo) {
            $periodStart = $current->copy();
            $periodEnd = $current->copy();

            switch ($groupBy) {
                case 'day':
                    $periodEnd = $periodStart->copy()->endOfDay();
                    $label = $periodStart->format('d/m/Y');
                    $current->addDay();
                    break;
                case 'week':
                    $periodEnd = $periodStart->copy()->endOfWeek();
                    $label = 'Semana del ' . $periodStart->format('d/m');
                    $current->addWeek();
                    break;
                case 'month':
                    $periodEnd = $periodStart->copy()->endOfMonth();
                    $label = $periodStart->format('M Y');
                    $current->addMonth();
                    break;
            }

            $periodSales = $sales->filter(function ($sale) use ($periodStart, $periodEnd) {
                return $sale->sale_date >= $periodStart && $sale->sale_date <= $periodEnd;
            });

            $grouped->push([
                'period' => $label,
                'date' => $periodStart->format('Y-m-d'),
                'sales_count' => $periodSales->count(),
                'total_amount' => $periodSales->sum('total_amount'),
                'total_profit' => $periodSales->sum('total_profit'),
                'average_sale' => $periodSales->count() > 0 ? $periodSales->avg('total_amount') : 0,
            ]);
        }

        return $grouped;
    }

    private function getTopProductsInPeriod($dateFrom, $dateTo, $categoryId = null)
    {
        $query = Product::active()
            ->withSum(['saleItems as total_sold' => function ($q) use ($dateFrom, $dateTo) {
                $q->whereHas('sale', function ($sale) use ($dateFrom, $dateTo) {
                    $sale->completed()->whereBetween('sale_date', [$dateFrom, $dateTo]);
                });
            }], 'quantity')
            ->withSum(['saleItems as total_revenue' => function ($q) use ($dateFrom, $dateTo) {
                $q->whereHas('sale', function ($sale) use ($dateFrom, $dateTo) {
                    $sale->completed()->whereBetween('sale_date', [$dateFrom, $dateTo]);
                });
            }], 'total')
            ->with('category');

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        return $query->having('total_sold', '>', 0)
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                return [
                    'name' => $product->name,
                    'category' => $product->category->name,
                    'total_sold' => $product->total_sold ?? 0,
                    'total_revenue' => $product->total_revenue ?? 0,
                    'current_stock' => $product->stock_quantity,
                    'unit' => $product->unit,
                ];
            });
    }

    private function getSalesByCategory($sales)
    {
        $categoryData = collect();

        foreach ($sales as $sale) {
            foreach ($sale->items as $item) {
                $categoryName = $item->product->category->name;
                
                if (!$categoryData->has($categoryName)) {
                    $categoryData[$categoryName] = [
                        'name' => $categoryName,
                        'total_amount' => 0,
                        'total_profit' => 0,
                        'items_sold' => 0,
                    ];
                }

                $categoryData[$categoryName]['total_amount'] += $item->total;
                $categoryData[$categoryName]['total_profit'] += $item->profit;
                $categoryData[$categoryName]['items_sold'] += $item->quantity;
            }
        }

        return $categoryData->sortByDesc('total_amount')->values();
    }

    private function calculateProfitByPeriod($sales, $purchases, $groupBy, $dateFrom, $dateTo)
    {
        $grouped = collect();
        $current = $dateFrom->copy();

        while ($current <= $dateTo) {
            $periodStart = $current->copy();
            $periodEnd = $current->copy();

            switch ($groupBy) {
                case 'day':
                    $periodEnd = $periodStart->copy()->endOfDay();
                    $label = $periodStart->format('d/m/Y');
                    $current->addDay();
                    break;
                case 'week':
                    $periodEnd = $periodStart->copy()->endOfWeek();
                    $label = 'Semana del ' . $periodStart->format('d/m');
                    $current->addWeek();
                    break;
                case 'month':
                    $periodEnd = $periodStart->copy()->endOfMonth();
                    $label = $periodStart->format('M Y');
                    $current->addMonth();
                    break;
            }

            $periodSales = $sales->filter(function ($sale) use ($periodStart, $periodEnd) {
                return $sale->sale_date >= $periodStart && $sale->sale_date <= $periodEnd;
            });

            $periodPurchases = $purchases->filter(function ($purchase) use ($periodStart, $periodEnd) {
                return $purchase->purchase_date >= $periodStart && $purchase->purchase_date <= $periodEnd;
            });

            $revenue = $periodSales->sum('total_amount');
            $costs = $periodPurchases->sum('total_amount');
            $profit = $periodSales->sum('total_profit');

            $grouped->push([
                'period' => $label,
                'date' => $periodStart->format('Y-m-d'),
                'revenue' => $revenue,
                'costs' => $costs,
                'profit' => $profit,
                'net_profit' => $revenue - $costs,
                'profit_margin' => $revenue > 0 ? round(($profit / $revenue) * 100, 2) : 0,
            ]);
        }

        return $grouped;
    }

    private function getProfitByCategory($sales, $categoryId = null)
    {
        $categoryProfit = collect();

        foreach ($sales as $sale) {
            foreach ($sale->items as $item) {
                if ($categoryId && $item->product->category_id != $categoryId) {
                    continue;
                }

                $categoryName = $item->product->category->name;
                
                if (!$categoryProfit->has($categoryName)) {
                    $categoryProfit[$categoryName] = [
                        'name' => $categoryName,
                        'revenue' => 0,
                        'profit' => 0,
                        'margin' => 0,
                    ];
                }

                $categoryProfit[$categoryName]['revenue'] += $item->total;
                $categoryProfit[$categoryName]['profit'] += $item->profit;
            }
        }

        return $categoryProfit->map(function ($category) {
            $category['margin'] = $category['revenue'] > 0 
                ? round(($category['profit'] / $category['revenue']) * 100, 2) 
                : 0;
            return $category;
        })->sortByDesc('profit')->values();
    }

    private function getMostProfitableProducts($dateFrom, $dateTo, $categoryId = null)
    {
        $query = Product::active()
            ->withSum(['saleItems as total_profit' => function ($q) use ($dateFrom, $dateTo) {
                $q->whereHas('sale', function ($sale) use ($dateFrom, $dateTo) {
                    $sale->completed()->whereBetween('sale_date', [$dateFrom, $dateTo]);
                });
            }], 'profit')
            ->withSum(['saleItems as total_revenue' => function ($q) use ($dateFrom, $dateTo) {
                $q->whereHas('sale', function ($sale) use ($dateFrom, $dateTo) {
                    $sale->completed()->whereBetween('sale_date', [$dateFrom, $dateTo]);
                });
            }], 'total')
            ->with('category');

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        return $query->having('total_profit', '>', 0)
            ->orderByDesc('total_profit')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                $revenue = $product->total_revenue ?? 0;
                $profit = $product->total_profit ?? 0;
                
                return [
                    'name' => $product->name,
                    'category' => $product->category->name,
                    'total_profit' => $profit,
                    'total_revenue' => $revenue,
                    'profit_margin' => $revenue > 0 ? round(($profit / $revenue) * 100, 2) : 0,
                ];
            });
    }

    private function getRecentStockMovements()
    {
        return DB::table('stock_movements')
            ->join('products', 'stock_movements.product_id', '=', 'products.id')
            ->join('users', 'stock_movements.user_id', '=', 'users.id')
            ->select([
                'products.name as product_name',
                'stock_movements.type',
                'stock_movements.reason',
                'stock_movements.quantity',
                'stock_movements.movement_date',
                'users.name as user_name'
            ])
            ->orderByDesc('stock_movements.movement_date')
            ->limit(20)
            ->get();
    }

    private function getSalesReportData($dateFrom, $dateTo, $filters)
    {
        // Implementar lógica para obtener datos del reporte de ventas
        return [];
    }

    private function getInventoryReportData($filters)
    {
        // Implementar lógica para obtener datos del reporte de inventario
        return [];
    }

    private function getProfitReportData($dateFrom, $dateTo, $filters)
    {
        // Implementar lógica para obtener datos del reporte de ganancias
        return [];
    }
}