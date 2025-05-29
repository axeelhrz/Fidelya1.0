<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StockMovementController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/quick-stats', [DashboardController::class, 'getQuickStats'])->name('dashboard.quick-stats');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Products
    Route::middleware('can:products.view')->group(function () {
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::get('/products/search', [ProductController::class, 'search'])->name('products.search');
        Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
        
        Route::middleware('can:products.create')->group(function () {
            Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
            Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        });

        Route::middleware('can:products.edit')->group(function () {
            Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
            Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        });
        
        Route::middleware('can:products.delete')->group(function () {
            Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        });
        
        Route::middleware('can:products.stock.update')->group(function () {
            Route::post('/products/{product}/stock', [ProductController::class, 'updateStock'])->name('products.update-stock');
        });
        
        Route::middleware('can:products.export')->group(function () {
            Route::get('/products/export', [ProductController::class, 'export'])->name('products.export');
        });
        
        Route::middleware('can:products.import')->group(function () {
            Route::post('/products/import', [ProductController::class, 'import'])->name('products.import');
        });
    });

    // Sales
    Route::middleware('can:sales.view')->group(function () {
        Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
        Route::get('/sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
        Route::get('/sales/daily/{date?}', [SaleController::class, 'getDailySales'])->name('sales.daily');
        
        Route::middleware('can:sales.create')->group(function () {
            Route::get('/sales/create', [SaleController::class, 'create'])->name('sales.create');
            Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
            Route::post('/sales/quick', [SaleController::class, 'quickSale'])->name('sales.quick');
        });
        
        Route::middleware('can:sales.edit')->group(function () {
            Route::get('/sales/{sale}/edit', [SaleController::class, 'edit'])->name('sales.edit');
            Route::put('/sales/{sale}', [SaleController::class, 'update'])->name('sales.update');
        });
        
        Route::middleware('can:sales.cancel')->group(function () {
            Route::post('/sales/{sale}/cancel', [SaleController::class, 'cancel'])->name('sales.cancel');
        });
        
        Route::middleware('can:sales.print')->group(function () {
            Route::get('/sales/{sale}/pdf', [SaleController::class, 'generatePdf'])->name('sales.pdf');
            Route::get('/sales/{sale}/print', [SaleController::class, 'print'])->name('sales.print');
        });
    });

    // Purchases
    Route::middleware('can:purchases.view')->group(function () {
        Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
        Route::get('/purchases/{purchase}', [PurchaseController::class, 'show'])->name('purchases.show');
        
        Route::middleware('can:purchases.create')->group(function () {
            Route::get('/purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
            Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchases.store');
        });
        
        Route::middleware('can:purchases.edit')->group(function () {
            Route::get('/purchases/{purchase}/edit', [PurchaseController::class, 'edit'])->name('purchases.edit');
            Route::put('/purchases/{purchase}', [PurchaseController::class, 'update'])->name('purchases.update');
        });
        
        Route::middleware('can:purchases.status.update')->group(function () {
            Route::post('/purchases/{purchase}/status', [PurchaseController::class, 'updateStatus'])->name('purchases.update-status');
        });
        
        Route::middleware('can:purchases.delete')->group(function () {
            Route::delete('/purchases/{purchase}', [PurchaseController::class, 'destroy'])->name('purchases.destroy');
        });
    });

    // Customers
    Route::middleware('can:customers.view')->group(function () {
        Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
        Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
        
        Route::middleware('can:customers.create')->group(function () {
            Route::get('/customers/create', [CustomerController::class, 'create'])->name('customers.create');
            Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
        });
        
        Route::middleware('can:customers.edit')->group(function () {
            Route::get('/customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
            Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
        });
        
        Route::middleware('can:customers.delete')->group(function () {
            Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');
        });
    });

    // Suppliers
    Route::middleware('can:suppliers.view')->group(function () {
        Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
        Route::get('/suppliers/{supplier}', [SupplierController::class, 'show'])->name('suppliers.show');
        
        Route::middleware('can:suppliers.create')->group(function () {
            Route::get('/suppliers/create', [SupplierController::class, 'create'])->name('suppliers.create');
            Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
        });
        
        Route::middleware('can:suppliers.edit')->group(function () {
            Route::get('/suppliers/{supplier}/edit', [SupplierController::class, 'edit'])->name('suppliers.edit');
            Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');
        });
        
        Route::middleware('can:suppliers.delete')->group(function () {
            Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');
        });
    });

    // Categories
    Route::middleware('can:categories.view')->group(function () {
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
        
        Route::middleware('can:categories.create')->group(function () {
            Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
            Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        });
        
        Route::middleware('can:categories.edit')->group(function () {
            Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
            Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        });
        
        Route::middleware('can:categories.delete')->group(function () {
            Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
        });
    });

    // Reports
    Route::middleware('can:reports.view')->group(function () {
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        
        Route::middleware('can:reports.sales')->group(function () {
            Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
            Route::get('/reports/sales/export', [ReportController::class, 'exportSales'])->name('reports.sales.export');
        });
        
        Route::middleware('can:reports.inventory')->group(function () {
            Route::get('/reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
            Route::get('/reports/inventory/export', [ReportController::class, 'exportInventory'])->name('reports.inventory.export');
        });
        
        Route::middleware('can:reports.profit')->group(function () {
            Route::get('/reports/profit', [ReportController::class, 'profit'])->name('reports.profit');
            Route::get('/reports/profit/export', [ReportController::class, 'exportProfit'])->name('reports.profit.export');
        });
        
        Route::middleware('can:reports.customers')->group(function () {
            Route::get('/reports/customers', [ReportController::class, 'customers'])->name('reports.customers');
        });
    });

    // Users Management
    Route::middleware('can:users.view')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        
        Route::middleware('can:users.create')->group(function () {
            Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
            Route::post('/users', [UserController::class, 'store'])->name('users.store');
        });
        
        Route::middleware('can:users.edit')->group(function () {
            Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        });
        
        Route::middleware('can:users.delete')->group(function () {
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        });
        
        Route::middleware('can:users.roles.manage')->group(function () {
            Route::post('/users/{user}/roles', [UserController::class, 'updateRoles'])->name('users.update-roles');
        });
    });

    // Settings
    Route::middleware('can:settings.view')->group(function () {
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        
        Route::middleware('can:settings.edit')->group(function () {
            Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
        });
        
        Route::middleware('can:settings.company')->group(function () {
            Route::get('/settings/company', [SettingController::class, 'company'])->name('settings.company');
            Route::put('/settings/company', [SettingController::class, 'updateCompany'])->name('settings.company.update');
        });
        
        Route::middleware('can:settings.system')->group(function () {
            Route::get('/settings/system', [SettingController::class, 'system'])->name('settings.system');
            Route::put('/settings/system', [SettingController::class, 'updateSystem'])->name('settings.system.update');
        });
    });

    // Stock Movements
    Route::middleware('can:stock_movements.view')->group(function () {
        Route::get('/stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');
        Route::get('/stock-movements/{product}', [StockMovementController::class, 'byProduct'])->name('stock-movements.by-product');
    });

    // Notifications
    Route::get('/notifications', function () {
        return view('notifications.index');
    })->name('notifications.index');

    // Help
    Route::get('/help', function () {
        return view('help.index');
    })->name('help');
});

// Authentication routes
require __DIR__.'/auth.php';
