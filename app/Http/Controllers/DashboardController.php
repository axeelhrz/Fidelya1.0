<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Customer;
use App\Models\Category;
use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Estadísticas principales
        $stats = $this->getMainStats();
        
        // Gráficos y datos para el dashboard
        $salesChart = $this->getSalesChartData();
        $topProducts = $this->getTopProducts();
        $recentSales = $this->getRecentSales();
        $lowStockProducts = $this->getLowStockProducts();
        $expiringProducts = $this->getExpiringProducts();
        $categoryStats = $this->getCategoryStats();
        $paymentMethodStats = $this->getPaymentMethodStats();
        
        return view('dashboard.index', compact(
            'stats',
            'salesChart',
            'topProducts',
            'recentSales',
            'lowStockProducts',
            'expiringProducts',
            'categoryStats',
            'paymentMethodStats'
        ));
    }

    private function getMainStats(): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->startOfMonth()->subDay();
        
        // Ventas de hoy
        $todaySales = Sale::completed()
            ->whereDate('sale_date', $today)
            ->sum('total_amount');
            
        // Ventas del mes
        $monthSales = Sale::completed()
            ->where('sale_date', '>=', $thisMonth)
            ->sum('total_amount');
            
        // Ventas del mes anterior
        $lastMonthSales = Sale::completed()
            ->whereBetween('sale_date', [$lastMonth, $lastMonthEnd])
            ->sum('total_amount');
            
        // Ganancia del día
        $todayProfit = Sale::completed()
            ->whereDate('sale_date', $today)
            ->with('items')
            ->get()
            ->sum('total_profit');
            
        // Ganancia del mes
        $monthProfit = Sale::completed()
            ->where('sale_date', '>=', $thisMonth)
            ->with('items')
            ->get()
            ->sum('total_profit');
            
        // Compras del mes
        $monthPurchases = Purchase::where('purchase_date', '>=', $thisMonth)
            ->sum('total_amount');
            
        // Productos con stock bajo
        $lowStockCount = Product::lowStock()->count();
        
        // Productos próximos a vencer
        $expiringCount = Product::expiringSoon(7)->count();
        
        // Valor total del inventario
        $inventoryValue = Product::active()
            ->selectRaw('SUM(stock_quantity * cost_price) as total')
            ->value('total') ?? 0;
            
        // Cálculo de crecimiento
        $salesGrowth = $lastMonthSales > 0 
            ? (($monthSales - $lastMonthSales) / $lastMonthSales) * 100 
            : 0;

        // Ventas de ayer para comparación
        $yesterdaySales = Sale::completed()
            ->whereDate('sale_date', $today->copy()->subDay())
            ->sum('total_amount');

        $dailyGrowth = $yesterdaySales > 0 
            ? (($todaySales - $yesterdaySales) / $yesterdaySales) * 100 
            : 0;

        return [
            'today_sales' => $todaySales,
            'month_sales' => $monthSales,
            'sales_growth' => round($salesGrowth, 1),
            'daily_growth' => round($dailyGrowth, 1),
            'today_profit' => $todayProfit,
            'month_profit' => $monthProfit,
            'month_purchases' => $monthPurchases,
            'low_stock_count' => $lowStockCount,
            'expiring_count' => $expiringCount,
            'inventory_value' => $inventoryValue,
            'total_customers' => Customer::active()->count(),
            'total_products' => Product::active()->count(),
            'net_balance' => $monthSales - $monthPurchases,
            'profit_margin' => $monthSales > 0 ? round(($monthProfit / $monthSales) * 100, 1) : 0,
        ];
    }

    private function getSalesChartData(): array
    {
        // Ventas de los últimos 30 días
        $salesData = Sale::completed()
            ->where('sale_date', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(sale_date) as date, SUM(total_amount) as total, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $labels = [];
        $amounts = [];
        $counts = [];
        
        // Llenar los últimos 30 días
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $labels[] = Carbon::parse($date)->format('d/m');
            
            $dayData = $salesData->get($date);
            $amounts[] = $dayData ? (float) $dayData->total : 0;
            $counts[] = $dayData ? (int) $dayData->count : 0;
        }

        return [
            'labels' => $labels,
            'amounts' => $amounts,
            'counts' => $counts,
        ];
    }

    private function getTopProducts(): array
    {
        return Product::active()
            ->withSum(['saleItems as total_sold' => function ($query) {
                $query->whereHas('sale', function ($q) {
                    $q->completed()->whereMonth('sale_date', Carbon::now()->month);
                });
            }], 'quantity')
            ->withSum(['saleItems as total_revenue' => function ($query) {
                $query->whereHas('sale', function ($q) {
                    $q->completed()->whereMonth('sale_date', Carbon::now()->month);
                });
            }], 'total')
            ->with('category')
            ->having('total_sold', '>', 0)
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category->name,
                    'category_color' => $product->category->color,
                    'total_sold' => $product->total_sold ?? 0,
                    'total_revenue' => $product->total_revenue ?? 0,
                    'stock' => $product->stock_quantity,
                    'unit' => $product->unit,
                    'image_url' => $product->image_url,
                    'profit_margin' => $product->profit_margin_percentage,
                ];
            })
            ->toArray();
    }

    private function getRecentSales(): array
    {
        return Sale::completed()
            ->with(['customer', 'user', 'items'])
            ->orderByDesc('sale_date')
            ->limit(10)
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'customer_name' => $sale->customer?->name ?? 'Cliente anónimo',
                    'user_name' => $sale->user->name,
                    'total_amount' => $sale->total_amount,
                    'payment_method' => $sale->payment_method,
                    'payment_method_label' => $this->getPaymentMethodLabel($sale->payment_method),
                    'items_count' => $sale->items->count(),
                    'sale_date' => $sale->sale_date->format('d/m/Y H:i'),
                    'profit' => $sale->total_profit,
                    'status' => $sale->status,
                ];
            })
            ->toArray();
    }

    private function getLowStockProducts(): array
    {
        return Product::lowStock()
            ->with('category')
            ->orderBy('stock_quantity')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                $stockPercentage = $product->min_stock > 0 
                    ? ($product->stock_quantity / $product->min_stock) * 100 
                    : 0;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category->name,
                    'category_color' => $product->category->color,
                    'stock_quantity' => $product->stock_quantity,
                    'min_stock' => $product->min_stock,
                    'unit' => $product->unit,
                    'stock_status' => $product->stock_status,
                    'stock_percentage' => round($stockPercentage, 1),
                    'image_url' => $product->image_url,
                    'urgency' => $product->stock_quantity <= 0 ? 'critical' : 'warning',
                ];
            })
            ->toArray();
    }

    private function getExpiringProducts(): array
    {
        return Product::expiringSoon(7)
            ->with('category')
            ->orderBy('expiry_date')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                $daysToExpire = $product->days_to_expire;
                $urgency = $daysToExpire <= 1 ? 'critical' : ($daysToExpire <= 3 ? 'high' : 'medium');

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category->name,
                    'category_color' => $product->category->color,
                    'expiry_date' => $product->expiry_date->format('d/m/Y'),
                    'days_to_expire' => $daysToExpire,
                    'stock_quantity' => $product->stock_quantity,
                    'unit' => $product->unit,
                    'image_url' => $product->image_url,
                    'urgency' => $urgency,
                ];
            })
            ->toArray();
    }

    private function getCategoryStats(): array
    {
        return Category::active()
            ->withSum(['products as total_stock_value' => function ($query) {
                $query->where('is_active', true);
            }], DB::raw('stock_quantity * cost_price'))
            ->withSum(['products as total_sales_month' => function ($query) {
                $query->whereHas('saleItems.sale', function ($q) {
                    $q->completed()->whereMonth('sale_date', Carbon::now()->month);
                });
            }], DB::raw('1')) // Placeholder, se calculará después
            ->withCount(['products as products_count' => function ($query) {
                $query->where('is_active', true);
            }])
            ->having('products_count', '>', 0)
            ->orderByDesc('total_stock_value')
            ->get()
            ->map(function ($category) {
                // Calcular ventas del mes para esta categoría
                $monthlySales = Sale::completed()
                    ->whereMonth('sale_date', Carbon::now()->month)
                    ->whereHas('items.product', function ($q) use ($category) {
                        $q->where('category_id', $category->id);
                    })
                    ->with('items.product')
                    ->get()
                    ->flatMap(function ($sale) use ($category) {
                        return $sale->items->filter(function ($item) use ($category) {
                            return $item->product->category_id === $category->id;
                        });
                    })
                    ->sum('total');

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'color' => $category->color,
                    'icon' => $category->icon,
                    'products_count' => $category->products_count,
                    'stock_value' => $category->total_stock_value ?? 0,
                    'monthly_sales' => $monthlySales,
                ];
            })
            ->toArray();
    }

    private function getPaymentMethodStats(): array
    {
        $thisMonth = Carbon::now()->startOfMonth();
        
        return Sale::completed()
            ->where('sale_date', '>=', $thisMonth)
            ->selectRaw('payment_method, COUNT(*) as count, SUM(total_amount) as total')
            ->groupBy('payment_method')
            ->orderByDesc('total')
            ->get()
            ->map(function ($stat) {
                return [
                    'method' => $stat->payment_method,
                    'label' => $this->getPaymentMethodLabel($stat->payment_method),
                    'count' => $stat->count,
                    'total' => $stat->total,
                    'percentage' => 0, // Se calculará en el frontend
                ];
            })
            ->toArray();
    }

    private function getPaymentMethodLabel(string $method): string
    {
        $labels = [
            'efectivo' => 'Efectivo',
            'tarjeta_debito' => 'Tarjeta de Débito',
            'tarjeta_credito' => 'Tarjeta de Crédito',
            'transferencia' => 'Transferencia',
            'cheque' => 'Cheque',
            'cuenta_corriente' => 'Cuenta Corriente',
        ];

        return $labels[$method] ?? ucfirst($method);
    }

    public function getQuickStats()
    {
        // Para llamadas AJAX que necesiten datos actualizados
        return response()->json($this->getMainStats());
    }
}