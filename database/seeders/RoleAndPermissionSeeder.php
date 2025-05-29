<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Crear permisos
        $permissions = [
            // Dashboard
            'dashboard.view',
            
            // Productos
            'products.view',
            'products.create',
            'products.edit',
            'products.delete',
            'products.import',
            'products.export',
            'products.stock.update',
            
            // Ventas
            'sales.view',
            'sales.create',
            'sales.edit',
            'sales.delete',
            'sales.cancel',
            'sales.print',
            'sales.quick_sale',
            
            // Compras
            'purchases.view',
            'purchases.create',
            'purchases.edit',
            'purchases.delete',
            'purchases.status.update',
            
            // Clientes
            'customers.view',
            'customers.create',
            'customers.edit',
            'customers.delete',
            
            // Proveedores
            'suppliers.view',
            'suppliers.create',
            'suppliers.edit',
            'suppliers.delete',
            
            // Categorías
            'categories.view',
            'categories.create',
            'categories.edit',
            'categories.delete',
            
            // Reportes
            'reports.view',
            'reports.sales',
            'reports.inventory',
            'reports.profit',
            'reports.customers',
            'reports.export',
            
            // Usuarios
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',
            'users.roles.manage',
            
            // Configuración
            'settings.view',
            'settings.edit',
            'settings.company',
            'settings.system',
            
            // Movimientos de stock
            'stock_movements.view',
            'stock_movements.create',
            
            // Facturación
            'invoices.generate',
            'invoices.print',
            'invoices.email',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Crear roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $cashierRole = Role::firstOrCreate(['name' => 'cajero']);
        $managerRole = Role::firstOrCreate(['name' => 'gerente']);

        // Asignar todos los permisos al administrador
        $adminRole->givePermissionTo(Permission::all());

        // Permisos para cajero
        $cashierPermissions = [
            'dashboard.view',
            'products.view',
            'sales.view',
            'sales.create',
            'sales.print',
            'sales.quick_sale',
            'customers.view',
            'customers.create',
            'customers.edit',
            'stock_movements.view',
            'invoices.generate',
            'invoices.print',
        ];
        $cashierRole->givePermissionTo($cashierPermissions);

        // Permisos para gerente
        $managerPermissions = [
            'dashboard.view',
            'products.view',
            'products.create',
            'products.edit',
            'products.stock.update',
            'sales.view',
            'sales.create',
            'sales.edit',
            'sales.cancel',
            'sales.print',
            'sales.quick_sale',
            'purchases.view',
            'purchases.create',
            'purchases.edit',
            'purchases.status.update',
            'customers.view',
            'customers.create',
            'customers.edit',
            'suppliers.view',
            'suppliers.create',
            'suppliers.edit',
            'categories.view',
            'categories.create',
            'categories.edit',
            'reports.view',
            'reports.sales',
            'reports.inventory',
            'reports.profit',
            'reports.customers',
            'reports.export',
            'stock_movements.view',
            'stock_movements.create',
            'invoices.generate',
            'invoices.print',
            'invoices.email',
        ];
        $managerRole->givePermissionTo($managerPermissions);
    }
}