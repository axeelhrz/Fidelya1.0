<div class="flex flex-col h-full">
    <!-- Logo -->
    <div class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800">
        <div class="flex items-center">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <span class="text-green-600 text-xl">🍎</span>
            </div>
            <h1 class="text-white font-bold text-lg">Frutería</h1>
        </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <!-- Dashboard -->
        <a href="{{ route('dashboard') }}" 
           class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('dashboard') ? 'bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-300 border-r-4 border-green-500' : '' }}">
            <i class="fas fa-chart-line w-5 h-5 mr-3"></i>
            <span class="font-medium">Dashboard</span>
        </a>
        
        <!-- Ventas -->
        @can('sales.view')
        <div x-data="{ open: {{ request()->routeIs('sales.*') ? 'true' : 'false' }} }">
            <button @click="open = !open" 
                    class="flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('sales.*') ? 'bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-300' : '' }}">
                <div class="flex items-center">
                    <i class="fas fa-cash-register w-5 h-5 mr-3"></i>
                    <span class="font-medium">Ventas</span>
                </div>
                <i class="fas fa-chevron-down transform transition-transform duration-200" x-bind:class="{ 'rotate-180': open }"></i>
            </button>
            <div x-show="open" x-transition class="ml-4 mt-2 space-y-1">
                @can('sales.create')
                <a href="{{ route('sales.create') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('sales.create') ? 'bg-green-50 dark:bg-gray-700 text-green-600 dark:text-green-400' : '' }}">
                    <i class="fas fa-plus w-4 h-4 mr-2"></i>
                    Nueva Venta
                </a>
                @endcan
                <a href="{{ route('sales.index') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('sales.index') ? 'bg-green-50 dark:bg-gray-700 text-green-600 dark:text-green-400' : '' }}">
                    <i class="fas fa-list w-4 h-4 mr-2"></i>
                    Historial
                </a>
            </div>
        </div>
        @endcan
        
        <!-- Inventario -->
        @can('products.view')
        <div x-data="{ open: {{ request()->routeIs('products.*') || request()->routeIs('categories.*') ? 'true' : 'false' }} }">
            <button @click="open = !open" 
                    class="flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('products.*') || request()->routeIs('categories.*') ? 'bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-300' : '' }}">
                <div class="flex items-center">
                    <i class="fas fa-boxes w-5 h-5 mr-3"></i>
                    <span class="font-medium">Inventario</span>
                </div>
                <i class="fas fa-chevron-down transform transition-transform duration-200" x-bind:class="{ 'rotate-180': open }"></i>
            </button>
            <div x-show="open" x-transition class="ml-4 mt-2 space-y-1">
                <a href="{{ route('products.index') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('products.*') ? 'bg-green-50 dark:bg-gray-700 text-green-600 dark:text-green-400' : '' }}">
                    <i class="fas fa-apple-alt w-4 h-4 mr-2"></i>
                    Productos
                </a>
                @can('categories.view')
                <a href="{{ route('categories.index') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('categories.*') ? 'bg-green-50 dark:bg-gray-700 text-green-600 dark:text-green-400' : '' }}">
                    <i class="fas fa-tags w-4 h-4 mr-2"></i>
                    Categorías
                </a>
                @endcan
            </div>
        </div>
        @endcan
        
        <!-- Compras -->
        @can('purchases.view')
        <div x-data="{ open: {{ request()->routeIs('purchases.*') || request()->routeIs('suppliers.*') ? 'true' : 'false' }} }">
            <button @click="open = !open" 
                    class="flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('purchases.*') || request()->routeIs('suppliers.*') ? 'bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-300' : '' }}">
                <div class="flex items-center">
                    <i class="fas fa-shopping-cart w-5 h-5 mr-3"></i>
                    <span class="font-medium">Compras</span>
                </div>
                <i class="fas fa-chevron-down transform transition-transform duration-200" x-bind:class="{ 'rotate-180': open }"></i>
            </button>
            <div x-show="open" x-transition class="ml-4 mt-2 space-y-1">
                @can('purchases.create')
                <a href="{{ route('purchases.create') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('purchases.create') ? 'bg-green-50 dark:bg-gray-700 text-green-600 dark:text-green-400' : '' }}">
                    <i class="fas fa-plus w-4 h-4 mr-2"></i>
                    Nueva Compra
                </a>
                @endcan
                <a href="{{ route('purchases.index') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('purchases.index') ? 'bg-green-50 dark:bg-gray-700 text-green-600 dark:text-green-400' : '' }}">
                    <i class="fas fa-list w-4 h-4 mr-2"></i>
                    Historial
                </a>
                @can('suppliers.view')
                <a href="{{ route('suppliers.index') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('suppliers.*') ? 'bg-green-50 dark:bg-gray-700 text-green-600 dark:text-green-400' : '' }}">
                    <i class="fas fa-truck w-4 h-4 mr-2"></i>
                    Proveedores
                </a>
                @endcan
            </div>
        </div>
        @endcan
        
        <!-- Clientes -->
        @can('customers.view')
        <a href="{{ route('customers.index') }}" 
           class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('customers.*') ? 'bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-300 border-r-4 border-green-500' : '' }}">
            <i class="fas fa-users w-5 h-5 mr-3"></i>
            <span class="font-medium">Clientes</span>
        </a>
        @endcan
        
        <!-- Reportes -->
        @can('reports.view')
        <div x-data="{ open: {{ request()->routeIs('reports.*') ? 'true' : 'false' }} }">
            <button @click="open = !open" 
                    class="flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('reports.*') ? 'bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-300' : '' }}">
                <div class="flex items-center">
                    <i class="fas fa-chart-bar w-5 h-5 mr-3"></i>
                    <span class="font-medium">Reportes</span>
                </div>
                <i class="fas fa-chevron-down transform transition-transform duration-200" x-bind:class="{ 'rotate-180': open }"></i>
            </button>
            <div x-show="open" x-transition class="ml-4 mt-2 space-y-1">
                @can('reports.sales')
                <a href="{{ route('reports.sales') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <i class="fas fa-chart-line w-4 h-4 mr-2"></i>
                    Ventas
                </a>
                @endcan
                @can('reports.inventory')
                <a href="{{ route('reports.inventory') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <i class="fas fa-boxes w-4 h-4 mr-2"></i>
                    Inventario
                </a>
                @endcan
                @can('reports.profit')
                <a href="{{ route('reports.profit') }}" 
                   class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <i class="fas fa-dollar-sign w-4 h-4 mr-2"></i>
                    Ganancias
                </a>
                @endcan
            </div>
        </div>
        @endcan
        
        <!-- Configuración -->
        @can('settings.view')
        <a href="{{ route('settings.index') }}" 
           class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 {{ request()->routeIs('settings.*') ? 'bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-300 border-r-4 border-green-500' : '' }}">
            <i class="fas fa-cog w-5 h-5 mr-3"></i>
            <span class="font-medium">Configuración</span>
        </a>
        @endcan
    </nav>
    
    <!-- User info -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
            <img class="w-10 h-10 rounded-full" src="{{ auth()->user()->avatar_url }}" alt="{{ auth()->user()->name }}">
            <div class="ml-3">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ auth()->user()->name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ auth()->user()->getRoleNames()->first() }}</p>
            </div>
        </div>
    </div>
</div>