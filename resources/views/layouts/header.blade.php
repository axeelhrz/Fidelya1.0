<div class="flex items-center justify-between h-16 px-6">
    <!-- Mobile menu button -->
    <button @click="sidebarOpen = !sidebarOpen" 
            class="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:text-gray-700 dark:focus:text-gray-200">
        <i class="fas fa-bars text-xl"></i>
    </button>
    
    <!-- Page title -->
    <div class="flex items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
            @yield('page-title', 'Dashboard')
        </h1>
        @hasSection('breadcrumbs')
            <nav class="ml-4 text-sm text-gray-500 dark:text-gray-400">
                @yield('breadcrumbs')
            </nav>
        @endif
    </div>
    
    <!-- Right side -->
    <div class="flex items-center space-x-4">
        <!-- Quick actions -->
        <div class="hidden md:flex items-center space-x-2">
            @can('sales.quick_sale')
            <button onclick="openQuickSaleModal()" 
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                <i class="fas fa-plus mr-2"></i>
                Venta Rápida
            </button>
            @endcan
        </div>
        
        <!-- Search -->
        <div class="relative hidden lg:block" x-data="{ open: false, search: '', results: [] }">
            <div class="relative">
                <input type="text" 
                       x-model="search"
                       @input.debounce.300ms="searchProducts()"
                       @focus="open = true"
                       placeholder="Buscar productos..."
                       class="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-gray-400"></i>
                </div>
            </div>
            
            <!-- Search results -->
            <div x-show="open && results.length > 0" 
                 @click.away="open = false"
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95"
                 x-transition:enter-end="opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-75"
                 x-transition:leave-start="opacity-100 scale-100"
                 x-transition:leave-end="opacity-0 scale-95"
                 class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto"
                 style="display: none;">
                <template x-for="product in results" :key="product.id">
                    <div class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 cursor-pointer"
                         @click="selectProduct(product)">
                        <div class="flex items-center">
                            <img :src="product.image_url" :alt="product.name" class="w-10 h-10 rounded-lg object-cover mr-3">
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900 dark:text-white" x-text="product.name"></p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    <span x-text="product.category"></span> • 
                                    Stock: <span x-text="product.stock"></span> <span x-text="product.unit"></span>
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-semibold text-green-600 dark:text-green-400" x-text="'$' + product.price"></p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        
        <!-- Notifications -->
        <div class="relative" x-data="{ open: false, notifications: [] }" x-init="loadNotifications()">
            <button @click="open = !open" 
                    class="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200">
                <i class="fas fa-bell text-xl"></i>
                <span x-show="notifications.length > 0" 
                      class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
                      x-text="notifications.length"></span>
            </button>
            
            <div x-show="open" 
                 @click.away="open = false"
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95"
                 x-transition:enter-end="opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-75"
                 x-transition:leave-start="opacity-100 scale-100"
                 x-transition:leave-end="opacity-0 scale-95"
                 class="absolute right-0 z-50 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                 style="display: none;">
                <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                        <button @click="markAllAsRead()" 
                                class="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                            Marcar todas como leídas
                        </button>
                    </div>
                </div>
                
                <div class="max-h-64 overflow-y-auto">
                    <template x-for="notification in notifications" :key="notification.id">
                        <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                             :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.read }">
                            <div class="flex items-start">
                                <div class="flex-shrink-0">
                                    <i :class="notification.icon" class="text-lg"></i>
                                </div>
                                <div class="ml-3 flex-1">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white" x-text="notification.title"></p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400" x-text="notification.message"></p>
                                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1" x-text="notification.time"></p>
                                </div>
                                <button @click="markAsRead(notification.id)" 
                                        x-show="!notification.read"
                                        class="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <i class="fas fa-times text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </template>
                    
                    <div x-show="notifications.length === 0" class="p-8 text-center">
                        <i class="fas fa-bell-slash text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                        <p class="text-gray-500 dark:text-gray-400">No hay notificaciones</p>
                    </div>
                </div>
                
                <div class="p-4 border-t border-gray-200 dark:border-gray-700" x-show="notifications.length > 0">
                    <a href="{{ route('notifications.index') }}" 
                       class="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                        Ver todas las notificaciones
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Theme toggle -->
        <button @click="darkMode = !darkMode; localStorage.setItem('darkMode', darkMode)" 
                class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200">
            <i class="fas fa-moon dark:hidden text-xl"></i>
            <i class="fas fa-sun hidden dark:block text-xl"></i>
        </button>
        
        <!-- User menu -->
        <div class="relative" x-data="{ open: false }">
            <button @click="open = !open" 
                    class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <img class="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600" 
                     src="{{ auth()->user()->avatar_url }}" 
                     alt="{{ auth()->user()->name }}">
                <span class="hidden md:block text-gray-700 dark:text-gray-200 font-medium">{{ auth()->user()->name }}</span>
                <i class="fas fa-chevron-down text-gray-400 transform transition-transform duration-200" 
                   :class="{ 'rotate-180': open }"></i>
            </button>
            
            <div x-show="open" 
                 @click.away="open = false"
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95"
                 x-transition:enter-end="opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-75"
                 x-transition:leave-start="opacity-100 scale-100"
                 x-transition:leave-end="opacity-0 scale-95"
                 class="absolute right-0 z-50 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                 style="display: none;">
                
                <!-- User info -->
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ auth()->user()->name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ auth()->user()->email }}</p>
                    <p class="text-xs text-green-600 dark:text-green-400 mt-1">
                        <i class="fas fa-user-tag mr-1"></i>
                        {{ auth()->user()->getRoleNames()->first() }}
                    </p>
                </div>
                
                <!-- Menu items -->
                <div class="py-1">
                    <a href="{{ route('profile.edit') }}" 
                       class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <i class="fas fa-user mr-3 w-4"></i>
                        Mi Perfil
                    </a>
                    
                    @can('settings.view')
                    <a href="{{ route('settings.index') }}" 
                       class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <i class="fas fa-cog mr-3 w-4"></i>
                        Configuración
                    </a>
                    @endcan
                    
                    <a href="{{ route('help') }}" 
                       class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <i class="fas fa-question-circle mr-3 w-4"></i>
                        Ayuda
                    </a>
                    
                    <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" 
                                class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                            <i class="fas fa-sign-out-alt mr-3 w-4"></i>
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Función para buscar productos
    function searchProducts() {
        const search = this.search;
        if (search.length < 2) {
            this.results = [];
            return;
        }
        
        fetch(`{{ route('products.search') }}?q=${encodeURIComponent(search)}`)
            .then(response => response.json())
            .then(data => {
                this.results = data;
            })
            .catch(error => {
                console.error('Error searching products:', error);
                this.results = [];
            });
    }
    
    // Función para seleccionar producto
    function selectProduct(product) {
        // Redirigir a la página del producto o abrir modal de venta rápida
        window.location.href = `{{ route('products.show', '') }}/${product.id}`;
    }
    
    // Función para cargar notificaciones
    function loadNotifications() {
        // Simular notificaciones (en producción vendría del backend)
        this.notifications = [
            {
                id: 1,
                title: 'Stock Bajo',
                message: '5 productos con stock crítico',
                icon: 'fas fa-exclamation-triangle text-yellow-500',
                time: 'Hace 2 horas',
                read: false
            },
            {
                id: 2,
                title: 'Productos por Vencer',
                message: '3 productos vencen en 2 días',
                icon: 'fas fa-clock text-orange-500',
                time: 'Hace 4 horas',
                read: false
            },
            {
                id: 3,
                title: 'Nueva Venta',
                message: 'Venta #FAC-00001234 completada',
                icon: 'fas fa-check-circle text-green-500',
                time: 'Hace 1 hora',
                read: true
            }
        ];
    }
    
    // Función para marcar notificación como leída
    function markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    }
    
    // Función para marcar todas como leídas
    function markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
    }
    
    // Función para abrir modal de venta rápida
    function openQuickSaleModal() {
        // Implementar modal de venta rápida
        showToast('Función de venta rápida próximamente', 'info');
    }
</script>
@endpush