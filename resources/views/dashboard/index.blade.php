@extends('layouts.app')

@section('title', 'Dashboard')
@section('page-title', 'Dashboard')

@section('breadcrumbs')
    <span class="text-gray-400">/</span>
    <span class="text-gray-600 dark:text-gray-300">Dashboard</span>
@endsection

@section('content')
<div x-data="dashboardData()" x-init="init()">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Ventas de Hoy -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-200">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Ventas de Hoy</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white" x-text="formatCurrency(stats.today_sales)"></p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm font-medium" 
                              :class="stats.daily_growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                            <i :class="stats.daily_growth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-1"></i>
                            <span x-text="Math.abs(stats.daily_growth) + '%'"></span>
                        </span>
                        <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">vs ayer</span>
                    </div>
                </div>
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <i class="fas fa-cash-register text-green-600 dark:text-green-400 text-xl"></i>
                </div>
            </div>
        </div>

        <!-- Ganancia del Mes -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-200">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Ganancia del Mes</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white" x-text="formatCurrency(stats.month_profit)"></p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                            <span x-text="stats.profit_margin + '%'"></span> margen
                        </span>
                    </div>
                </div>
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <i class="fas fa-chart-line text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
            </div>
        </div>

        <!-- Productos Activos -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-200">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Productos Activos</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white" x-text="stats.total_products"></p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm font-medium text-purple-600 dark:text-purple-400">
                            <span x-text="formatCurrency(stats.inventory_value)"></span> en stock
                        </span>
                    </div>
                </div>
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <i class="fas fa-boxes text-purple-600 dark:text-purple-400 text-xl"></i>
                </div>
            </div>
        </div>

        <!-- Alertas -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-200">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Alertas</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white" x-text="stats.low_stock_count + stats.expiring_count"></p>
                    <div class="flex items-center mt-2 space-x-3">
                        <span class="text-sm font-medium text-orange-600 dark:text-orange-400">
                            <span x-text="stats.low_stock_count"></span> stock bajo
                        </span>
                        <span class="text-sm font-medium text-red-600 dark:text-red-400">
                            <span x-text="stats.expiring_count"></span> por vencer
                        </span>
                    </div>
                </div>
                <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <i class="fas fa-exclamation-triangle text-orange-600 dark:text-orange-400 text-xl"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Sales Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ventas de los Últimos 30 Días</h3>
                <div class="flex items-center space-x-2">
                    <button @click="chartType = 'amount'" 
                            :class="chartType === 'amount' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'"
                            class="px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                        Monto
                    </button>
                    <button @click="chartType = 'count'" 
                            :class="chartType === 'count' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'"
                            class="px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200">
                        Cantidad
                    </button>
                </div>
            </div>
            <div class="relative h-64">
                <canvas id="salesChart"></canvas>
            </div>
        </div>

        <!-- Payment Methods Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Métodos de Pago</h3>
                <span class="text-sm text-gray-500 dark:text-gray-400">Este mes</span>
            </div>
            <div class="relative h-64">
                <canvas id="paymentChart"></canvas>
            </div>
        </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Top Products -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Productos Más Vendidos</h3>
                <a href="{{ route('reports.sales') }}" class="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                    Ver todos
                </a>
            </div>
            <div class="space-y-4">
                <template x-for="(product, index) in topProducts.slice(0, 5)" :key="product.id">
                    <div class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                 :style="`background-color: ${product.category_color}`">
                                <span x-text="index + 1"></span>
                            </div>
                        </div>
                        <img :src="product.image_url" :alt="product.name" class="w-10 h-10 rounded-lg object-cover">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate" x-text="product.name"></p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                <span x-text="product.total_sold"></span> <span x-text="product.unit"></span> vendidos
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-semibold text-gray-900 dark:text-white" x-text="formatCurrency(product.total_revenue)"></p>
                            <p class="text-xs text-green-600 dark:text-green-400" x-text="product.profit_margin + '% margen'"></p>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Recent Sales -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ventas Recientes</h3>
                <a href="{{ route('sales.index') }}" class="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                    Ver todas
                </a>
            </div>
            <div class="space-y-4">
                <template x-for="sale in recentSales.slice(0, 5)" :key="sale.id">
                    <div class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <i class="fas fa-receipt text-green-600 dark:text-green-400"></i>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-white" x-text="sale.invoice_number"></p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                <span x-text="sale.customer_name"></span> • 
                                <span x-text="sale.items_count"></span> productos
                            </p>
                            <p class="text-xs text-gray-400 dark:text-gray-500" x-text="sale.sale_date"></p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-semibold text-gray-900 dark:text-white" x-text="formatCurrency(sale.total_amount)"></p>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                  :class="getPaymentMethodClass(sale.payment_method)">
                                <span x-text="sale.payment_method_label"></span>
                            </span>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Alerts -->
        <div class="space-y-6">
            <!-- Low Stock Alert -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Stock Bajo</h3>
                    <a href="{{ route('products.index', ['status' => 'low_stock']) }}" 
                       class="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                        Ver todos
                    </a>
                </div>
                <div class="space-y-3">
                    <template x-for="product in lowStockProducts.slice(0, 3)" :key="product.id">
                        <div class="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <img :src="product.image_url" :alt="product.name" class="w-8 h-8 rounded object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-white truncate" x-text="product.name"></p>
                                <p class="text-xs text-orange-600 dark:text-orange-400">
                                    Stock: <span x-text="product.stock_quantity"></span> / 
                                    Mín: <span x-text="product.min_stock"></span>
                                </p>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="w-8 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-orange-500 rounded-full transition-all duration-300"
                                         :style="`width: ${Math.min(100, product.stock_percentage)}%`"></div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Expiring Products Alert -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Por Vencer</h3>
                    <a href="{{ route('products.index', ['status' => 'expiring']) }}" 
                       class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                        Ver todos
                    </a>
                </div>
                <div class="space-y-3">
                    <template x-for="product in expiringProducts.slice(0, 3)" :key="product.id">
                        <div class="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <img :src="product.image_url" :alt="product.name" class="w-8 h-8 rounded object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-white truncate" x-text="product.name"></p>
                                <p class="text-xs text-red-600 dark:text-red-400">
                                    Vence en <span x-text="product.days_to_expire"></span> días
                                </p>
                            </div>
                            <div class="flex-shrink-0">
                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                      :class="getUrgencyClass(product.urgency)">
                                    <span x-text="getUrgencyLabel(product.urgency)"></span>
                                </span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
function dashboardData() {
    return {
        stats: @json($stats),
        salesChart: @json($salesChart),
        topProducts: @json($topProducts),
        recentSales: @json($recentSales),
        lowStockProducts: @json($lowStockProducts),
        expiringProducts: @json($expiringProducts),
        paymentMethodStats: @json($paymentMethodStats),
        chartType: 'amount',
        salesChartInstance: null,
        paymentChartInstance: null,

        init() {
            this.$nextTick(() => {
                this.initSalesChart();
                this.initPaymentChart();
            });
        },

        initSalesChart() {
            const ctx = document.getElementById('salesChart').getContext('2d');
            
            this.salesChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.salesChart.labels,
                    datasets: [{
                        label: 'Ventas',
                        data: this.chartType === 'amount' ? this.salesChart.amounts : this.salesChart.counts,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#10B981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6B7280'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(107, 114, 128, 0.1)'
                            },
                            ticks: {
                                color: '#6B7280',
                                callback: (value) => {
                                    return this.chartType === 'amount' ? this.formatCurrency(value) : value;
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });

            this.$watch('chartType', () => {
                this.updateSalesChart();
            });
        },

        updateSalesChart() {
            if (this.salesChartInstance) {
                this.salesChartInstance.data.datasets[0].data = 
                    this.chartType === 'amount' ? this.salesChart.amounts : this.salesChart.counts;
                this.salesChartInstance.update();
            }
        },

        initPaymentChart() {
            const ctx = document.getElementById('paymentChart').getContext('2d');
            
            const labels = this.paymentMethodStats.map(item => item.label);
            const data = this.paymentMethodStats.map(item => item.total);
            const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

            this.paymentChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                color: '#6B7280'
                            }
                        }
                    }
                }
            });
        },

        formatCurrency(amount) {
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        },

        getPaymentMethodClass(method) {
            const classes = {
                'efectivo': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                'tarjeta_debito': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                'tarjeta_credito': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                'transferencia': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            };
            return classes[method] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        },

        getUrgencyClass(urgency) {
            const classes = {
                'critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
                'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            };
            return classes[urgency] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        },

        getUrgencyLabel(urgency) {
            const labels = {
                'critical': 'Crítico',
                'high': 'Alto',
                'medium': 'Medio'
            };
            return labels[urgency] || urgency;
        }
    }
}
</script>
@endpush