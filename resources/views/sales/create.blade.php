@extends('layouts.app')

@section('title', 'Nueva Venta')
@section('page-title', 'Nueva Venta')

@section('breadcrumbs')
    <span class="text-gray-400">/</span>
    <a href="{{ route('sales.index') }}" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Ventas</a>
    <span class="text-gray-400">/</span>
    <span class="text-gray-600 dark:text-gray-300">Nueva Venta</span>
@endsection

@section('content')
<div x-data="newSaleData()" x-init="init()">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Product Selection -->
        <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Seleccionar Productos</h3>
                
                <!-- Product Search -->
                <div class="mb-6">
                    <div class="relative">
                        <input type="text" 
                               x-model="productSearch"
                               @input.debounce.300ms="searchProducts()"
                               placeholder="Buscar productos por nombre o código..."
                               class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fas fa-search text-gray-400"></i>
                        </div>
                    </div>
                </div>

                <!-- Recent Products -->
                <div x-show="!productSearch && recentProducts.length > 0" class="mb-6">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Productos Recientes</h4>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <template x-for="product in recentProducts" :key="product.id">
                            <button @click="addToCart(product)" 
                                    class="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left">
                                <div class="flex items-center space-x-3">
                                    <img :src="product.image_url" :alt="product.name" class="w-10 h-10 rounded-lg object-cover">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate" x-text="product.name"></p>
                                        <p class="text-sm text-green-600 dark:text-green-400" x-text="formatCurrency(product.sale_price)"></p>
                                    </div>
                                </div>
                            </button>
                        </template>
                    </div>
                </div>

                <!-- Search Results -->
                <div x-show="productSearch && searchResults.length > 0" class="space-y-3">
                    <template x-for="product in searchResults" :key="product.id">
                        <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <div class="flex items-center space-x-4">
                                <img :src="product.image_url" :alt="product.name" class="w-12 h-12 rounded-lg object-cover">
                                <div>
                                    <h4 class="text-sm font-medium text-gray-900 dark:text-white" x-text="product.name"></h4>
                                    <p class="text-sm text-gray-500 dark:text-gray-400" x-text="product.category"></p>
                                    <p class="text-sm text-green-600 dark:text-green-400" x-text="formatCurrency(product.price)"></p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="text-right">
                                    <p class="text-sm text-gray-900 dark:text-white">
                                        Stock: <span x-text="product.stock"></span> <span x-text="product.unit"></span>
                                    </p>
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                          :class="product.stock > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'">
                                        <span x-text="product.stock > 0 ? 'Disponible' : 'Sin stock'"></span>
                                    </span>
                                </div>
                                <button @click="addToCart(product)" 
                                        :disabled="product.stock <= 0"
                                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- No Results -->
                <div x-show="productSearch && searchResults.length === 0 && !searchLoading" class="text-center py-8">
                    <i class="fas fa-search text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-400">No se encontraron productos</p>
                </div>

                <!-- Search Loading -->
                <div x-show="searchLoading" class="text-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                </div>
            </div>
        </div>

        <!-- Cart and Summary -->
        <div class="space-y-6">
            <!-- Shopping Cart -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Carrito de Compras</h3>
                
                <div x-show="cart.length === 0" class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-400">El carrito está vacío</p>
                </div>

                <div x-show="cart.length > 0" class="space-y-4">
                    <template x-for="(item, index) in cart" :key="index">
                        <div class="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <img :src="item.image_url" :alt="item.name" class="w-12 h-12 rounded-lg object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-white truncate" x-text="item.name"></p>
                                <p class="text-sm text-gray-500 dark:text-gray-400" x-text="formatCurrency(item.unit_price)"></p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <button @click="updateQuantity(index, item.quantity - 1)" 
                                        class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <i class="fas fa-minus text-xs"></i>
                                </button>
                                <input type="number" 
                                       :value="item.quantity"
                                       @input="updateQuantity(index, parseFloat($event.target.value))"
                                       min="0.001"
                                       step="0.001"
                                       class="w-16 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                                <button @click="updateQuantity(index, item.quantity + 1)" 
                                        class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                            </div>
                            <button @click="removeFromCart(index)" 
                                    class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Sale Summary -->
            <div x-show="cart.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Resumen de Venta</h3>
                
                <!-- Customer Selection -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente (opcional)</label>
                    <select x-model="saleForm.customer_id" 
                            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">Cliente anónimo</option>
                        <template x-for="customer in customers" :key="customer.id">
                            <option :value="customer.id" x-text="customer.name"></option>
                        </template>
                    </select>
                </div>

                <!-- Payment Method -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de Pago</label>
                    <select x-model="saleForm.payment_method" 
                            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta_debito">Tarjeta Débito</option>
                        <option value="tarjeta_credito">Tarjeta Crédito</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>

                <!-- Discount -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descuento (%)</label>
                    <input type="number" 
                           x-model="saleForm.discount_percentage"
                           min="0"
                           max="100"
                           step="0.01"
                           class="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>

                <!-- Totals -->
                <div class="space-y-2 mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
                        <span class="text-gray-900 dark:text-white" x-text="formatCurrency(subtotal)"></span>
                    </div>
                    <div x-show="discountAmount > 0" class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Descuento:</span>
                        <span class="text-red-600 dark:text-red-400">-<span x-text="formatCurrency(discountAmount)"></span></span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">IVA (21%):</span>
                        <span class="text-gray-900 dark:text-white" x-text="formatCurrency(taxAmount)"></span>
                    </div>
                    <div class="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span class="text-gray-900 dark:text-white">Total:</span>
                        <span class="text-green-600 dark:text-green-400" x-text="formatCurrency(total)"></span>
                    </div>
                </div>

                <!-- Amount Paid -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto Recibido</label>
                    <input type="number" 
                           x-model="saleForm.amount_paid"
                           :min="total"
                           step="0.01"
                           class="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <div x-show="changeAmount > 0" class="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p class="text-sm text-blue-800 dark:text-blue-300">
                            Cambio: <span class="font-semibold" x-text="formatCurrency(changeAmount)"></span>
                        </p>
                    </div>
                </div>

                <!-- Notes -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notas (opcional)</label>
                    <textarea x-model="saleForm.notes" 
                              rows="3"
                              placeholder="Notas adicionales sobre la venta..."
                              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
                </div>

                <!-- Actions -->
                <div class="space-y-3">
                    <button @click="completeSale()" 
                            :disabled="!canCompleteSale || saleLoading"
                            class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                        <span x-show="!saleLoading">Completar Venta</span>
                        <span x-show="saleLoading" class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                        </span>
                    </button>
                    
                    <button @click="saveDraft()" 
                            :disabled="cart.length === 0 || draftLoading"
                            class="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                        <span x-show="!draftLoading">Guardar Borrador</span>
                        <span x-show="draftLoading" class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </span>
                    </button>
                    
                    <a href="{{ route('sales.index') }}" 
                       class="block w-full text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        Cancelar
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
function newSaleData() {
    return {
        cart: [],
        customers: @json($customers),
        recentProducts: @json($recentProducts),
        productSearch: '',
        searchResults: [],
        searchLoading: false,
        saleLoading: false,
        draftLoading: false,
        saleForm: {
            customer_id: '',
            payment_method: 'efectivo',
            discount_percentage: 0,
            amount_paid: 0,
            notes: ''
        },

        init() {
            this.$watch('saleForm.discount_percentage', () => this.updateAmountPaid());
            this.$watch('total', () => this.updateAmountPaid());
        },

        get subtotal() {
            return this.cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        },

        get discountAmount() {
            return (this.subtotal * this.saleForm.discount_percentage) / 100;
        },

        get taxableAmount() {
            return this.subtotal - this.discountAmount;
        },

        get taxAmount() {
            return this.taxableAmount * 0.21; // 21% IVA
        },

        get total() {
            return this.taxableAmount + this.taxAmount;
        },

        get changeAmount() {
            return Math.max(0, this.saleForm.amount_paid - this.total);
        },

        get canCompleteSale() {
            return this.cart.length > 0 && this.saleForm.amount_paid >= this.total;
        },

        updateAmountPaid() {
            if (this.saleForm.amount_paid < this.total) {
                this.saleForm.amount_paid = this.total;
            }
        },

        async searchProducts() {
            if (this.productSearch.length < 2) {
                this.searchResults = [];
                return;
            }

            this.searchLoading = true;
            try {
                const response = await fetch(`{{ route('products.search') }}?q=${encodeURIComponent(this.productSearch)}`);
                this.searchResults = await response.json();
            } catch (error) {
                console.error('Error searching products:', error);
                showToast('Error al buscar productos', 'error');
            } finally {
                this.searchLoading = false;
            }
        },

        addToCart(product) {
            if (product.stock <= 0) {
                showToast('Producto sin stock disponible', 'warning');
                return;
            }

            const existingIndex = this.cart.findIndex(item => item.product_id === product.id);
            
            if (existingIndex >= 0) {
                const newQuantity = this.cart[existingIndex].quantity + 1;
                if (newQuantity <= product.stock) {
                    this.cart[existingIndex].quantity = newQuantity;
                } else {
                    showToast('No hay suficiente stock disponible', 'warning');
                }
            } else {
                this.cart.push({
                    product_id: product.id,
                    name: product.name,
                    unit_price: product.price || product.sale_price,
                    quantity: 1,
                    image_url: product.image_url,
                    max_stock: product.stock
                });
            }

            // Clear search
            this.productSearch = '';
            this.searchResults = [];
        },

        updateQuantity(index, newQuantity) {
            if (newQuantity <= 0) {
                this.removeFromCart(index);
                return;
            }

            const item = this.cart[index];
            if (newQuantity <= item.max_stock) {
                this.cart[index].quantity = newQuantity;
            } else {
                showToast('No hay suficiente stock disponible', 'warning');
            }
        },

        removeFromCart(index) {
            this.cart.splice(index, 1);
        },

        async completeSale() {
            if (!this.canCompleteSale) {
                showToast('Verifica los datos de la venta', 'warning');
                return;
            }

            this.saleLoading = true;
            try {
                const saleData = {
                    ...this.saleForm,
                    items: this.cart.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        unit_price: item.unit_price
                    }))
                };

                const response = await fetch('{{ route('sales.store') }}', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(saleData)
                });

                const data = await response.json();
                
                if (data.success) {
                    showToast(data.message, 'success');
                    window.location.href = data.redirect_url;
                } else {
                    showToast(data.message, 'error');
                }
            } catch (error) {
                console.error('Error completing sale:', error);
                showToast('Error al completar la venta', 'error');
            } finally {
                this.saleLoading = false;
            }
        },

        async saveDraft() {
            if (this.cart.length === 0) {
                showToast('Agrega productos al carrito', 'warning');
                return;
            }

            this.draftLoading = true;
            try {
                const saleData = {
                    ...this.saleForm,
                    status: 'borrador',
                    items: this.cart.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        unit_price: item.unit_price
                    }))
                };

                const response = await fetch('{{ route('sales.store') }}', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(saleData)
                });

                const data = await response.json();
                
                if (data.success) {
                    showToast(data.message, 'success');
                    window.location.href = '{{ route('sales.index') }}';
                } else {
                    showToast(data.message, 'error');
                }
            } catch (error) {
                console.error('Error saving draft:', error);
                showToast('Error al guardar borrador', 'error');
            } finally {
                this.draftLoading = false;
            }
        },

        formatCurrency(amount) {
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        }
    }
}
</script>
@endpush