<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('name');
        $suppliers = Supplier::all()->keyBy('name');

        $products = [
            // Frutas Frescas
            [
                'name' => 'Manzana Roja',
                'category' => 'Frutas Frescas',
                'supplier' => 'Frutas del Valle',
                'cost_price' => 180.00,
                'sale_price' => 250.00,
                'stock_quantity' => 50.000,
                'min_stock' => 10.000,
                'unit' => 'kg',
                'is_perishable' => true,
                'shelf_life_days' => 15,
            ],
            [
                'name' => 'Banana',
                'category' => 'Frutas Frescas',
                'supplier' => 'Frutas del Valle',
                'cost_price' => 120.00,
                'sale_price' => 180.00,
                'stock_quantity' => 30.000,
                'min_stock' => 8.000,
                'unit' => 'kg',
                'is_perishable' => true,
                'shelf_life_days' => 7,
            ],
            [
                'name' => 'Pera',
                'category' => 'Frutas Frescas',
                'supplier' => 'Frutas del Valle',
                'cost_price' => 200.00,
                'sale_price' => 280.00,
                'stock_quantity' => 25.000,
                'min_stock' => 5.000,
                'unit' => 'kg',
                'is_perishable' => true,
                'shelf_life_days' => 12,
            ],
            [
                'name' => 'Uva Blanca',
                'category' => 'Frutas Frescas',
                'supplier' => 'Mercado Central',
                'cost_price' => 350.00,
                'sale_price' => 480.00,
                'stock_quantity' => 15.000,
                'min_stock' => 3.000,
                'unit' => 'kg',
                'is_perishable' => true,
                'shelf_life_days' => 10,
            ],

            // Verduras
            [
                'name' => 'Tomate',
                'category' => 'Verduras',
                'supplier' => 'Verduras Orgánicas del Sur',
                'cost_price' => 150.00,
                'sale_price' => 220.00,
                'stock_quantity' => 40.000,
                'min_stock' => 10.000,
                'unit' => 'kg',
                'is_perishable' => true,
                'shelf_life_days' => 8,
            ],
            [
                'name' => 'Papa',
                'category' => 'Tubérculos',
                'supplier' => 'Distribuidora San Miguel',
                'cost_price' => 80.00,
                'sale_price' => 120.00,
                'stock_quantity' => 100.000,
                'min_stock' => 20.000,
                'unit' => 'kg',
                'is_perishable' => false,
                'shelf_life_days' => 30,
            ],
            [
                'name' => 'Cebolla',
                'category' => 'Verduras',
                'supplier' => 'Distribuidora San Miguel',
                'cost_price' => 90.00,
                'sale_price' => 140.00,
                'stock_quantity' => 60.000,
                'min_stock' => 15.000,
                'unit' => 'kg',
                'is_perishable' => false,
                'shelf_life_days' => 45,
            ],
            [
                'name' => 'Zanahoria',
                'category' => 'Tubérculos',
                'supplier' => 'Verduras Orgánicas del Sur',
                'cost_price' => 110.00,
                'sale_price' => 160.00,
                'stock_quantity' => 35.000,
                'min_stock' => 8.000,
                'unit' => 'kg',
                'is_perishable' => false,
                'shelf_life_days' => 20,
            ],

            // Frutas Cítricas
            [
                'name' => 'Naranja',
                'category' => 'Frutas Cítricas',
                'supplier' => 'Frutas del Valle',
                'cost_price' => 130.00,
                'sale_price' => 190.00,
                'stock_quantity' => 45.000,
                'min_stock' => 12.000,
                'unit' => 'kg',
                'is_perishable' => true,
                'shelf_life_days' => 20,
            ],
            [
                'name' => 'Limón',
                'category' => 'Frutas Cítricas',
                'supplier' => 'Mercado Central',
                'cost_price' => 180.00,
                'sale_price' => 260.00,
                'stock_quantity' => 20.000,
                'min_stock' => 5.000,
                'unit' => 'kg',
                'is_perishable' => true,
                'shelf_life_days' => 25,
            ],

            // Verduras de Hoja
            [
                'name' => 'Lechuga',
                'category' => 'Verduras de Hoja',
                'supplier' => 'Verduras Orgánicas del Sur',
                'cost_price' => 80.00,
                'sale_price' => 120.00,
                'stock_quantity' => 25.000,
                'min_stock' => 5.000,
                'unit' => 'unidad',
                'is_perishable' => true,
                'shelf_life_days' => 5,
            ],
            [
                'name' => 'Espinaca',
                'category' => 'Verduras de Hoja',
                'supplier' => 'Verduras Orgánicas del Sur',
                'cost_price' => 120.00,
                'sale_price' => 180.00,
                'stock_quantity' => 15.000,
                'min_stock' => 3.000,
                'unit' => 'kg',
                'is_perishable' => true,
                'shelf_life_days' => 4,
            ],

            // Frutas Secas
            [
                'name' => 'Nueces',
                'category' => 'Frutas Secas',
                'supplier' => 'Semillas Patagónicas',
                'cost_price' => 800.00,
                'sale_price' => 1200.00,
                'stock_quantity' => 10.000,
                'min_stock' => 2.000,
                'unit' => 'kg',
                'is_perishable' => false,
                'shelf_life_days' => 180,
            ],
            [
                'name' => 'Almendras',
                'category' => 'Frutas Secas',
                'supplier' => 'Semillas Patagónicas',
                'cost_price' => 900.00,
                'sale_price' => 1350.00,
                'stock_quantity' => 8.000,
                'min_stock' => 1.500,
                'unit' => 'kg',
                'is_perishable' => false,
                'shelf_life_days' => 200,
            ],

            // Hierbas Aromáticas
            [
                'name' => 'Perejil',
                'category' => 'Hierbas Aromáticas',
                'supplier' => 'Verduras Orgánicas del Sur',
                'cost_price' => 60.00,
                'sale_price' => 100.00,
                'stock_quantity' => 20.000,
                'min_stock' => 5.000,
                'unit' => 'unidad',
                'is_perishable' => true,
                'shelf_life_days' => 7,
            ],
            [
                'name' => 'Cilantro',
                'category' => 'Hierbas Aromáticas',
                'supplier' => 'Verduras Orgánicas del Sur',
                'cost_price' => 70.00,
                'sale_price' => 110.00,
                'stock_quantity' => 15.000,
                'min_stock' => 3.000,
                'unit' => 'unidad',
                'is_perishable' => true,
                'shelf_life_days' => 6,
            ],
        ];

        foreach ($products as $productData) {
            $category = $categories->get($productData['category']);
            $supplier = $suppliers->get($productData['supplier']);

            if ($category) {
                Product::firstOrCreate(
                    ['name' => $productData['name']],
                    [
                        'code' => Product::generateUniqueCode(),
                        'category_id' => $category->id,
                        'supplier_id' => $supplier?->id,
                        'cost_price' => $productData['cost_price'],
                        'sale_price' => $productData['sale_price'],
                        'stock_quantity' => $productData['stock_quantity'],
                        'min_stock' => $productData['min_stock'],
                        'max_stock' => $productData['stock_quantity'] * 2,
                        'unit' => $productData['unit'],
                        'is_perishable' => $productData['is_perishable'],
                        'shelf_life_days' => $productData['shelf_life_days'],
                        'expiry_date' => $productData['is_perishable'] 
                            ? now()->addDays($productData['shelf_life_days']) 
                            : null,
                        'is_active' => true,
                        'track_stock' => true,
                    ]
                );
            }
        }
    }
}