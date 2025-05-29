<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Ana',
                'last_name' => 'García',
                'customer_type' => 'individual',
                'phone' => '+54 11 1111-1111',
                'email' => 'ana.garcia@email.com',
                'address' => 'Av. Corrientes 1234',
                'city' => 'Buenos Aires',
                'preferred_payment' => 'efectivo',
                'credit_limit' => 5000.00,
            ],
            [
                'name' => 'Carlos',
                'last_name' => 'Rodríguez',
                'customer_type' => 'individual',
                'phone' => '+54 11 2222-2222',
                'email' => 'carlos.rodriguez@email.com',
                'address' => 'Calle Florida 567',
                'city' => 'Buenos Aires',
                'preferred_payment' => 'tarjeta',
                'credit_limit' => 3000.00,
            ],
            [
                'name' => 'María',
                'last_name' => 'López',
                'customer_type' => 'individual',
                'phone' => '+54 11 3333-3333',
                'email' => 'maria.lopez@email.com',
                'address' => 'Av. Santa Fe 890',
                'city' => 'Buenos Aires',
                'preferred_payment' => 'efectivo',
                'credit_limit' => 2000.00,
            ],
            [
                'name' => 'Restaurante El Buen Sabor',
                'business_name' => 'El Buen Sabor S.R.L.',
                'customer_type' => 'business',
                'tax_id' => '30-12345678-9',
                'phone' => '+54 11 4444-4444',
                'email' => 'compras@elbuensabor.com',
                'address' => 'Av. Rivadavia 1500',
                'city' => 'Buenos Aires',
                'preferred_payment' => 'transferencia',
                'credit_limit' => 25000.00,
            ],
            [
                'name' => 'Supermercado Los Andes',
                'business_name' => 'Los Andes Supermercados S.A.',
                'customer_type' => 'business',
                'tax_id' => '30-87654321-9',
                'phone' => '+54 11 5555-5555',
                'email' => 'gerencia@losandes.com',
                'address' => 'Av. San Martín 2000',
                'city' => 'Buenos Aires',
                'preferred_payment' => 'cuenta_corriente',
                'credit_limit' => 50000.00,
            ],
            [
                'name' => 'Pedro',
                'last_name' => 'Martínez',
                'customer_type' => 'individual',
                'phone' => '+54 11 6666-6666',
                'email' => 'pedro.martinez@email.com',
                'address' => 'Calle Defensa 789',
                'city' => 'Buenos Aires',
                'preferred_payment' => 'efectivo',
                'credit_limit' => 1500.00,
            ],
            [
                'name' => 'Laura',
                'last_name' => 'Fernández',
                'customer_type' => 'individual',
                'phone' => '+54 11 7777-7777',
                'email' => 'laura.fernandez@email.com',
                'address' => 'Av. Belgrano 456',
                'city' => 'Buenos Aires',
                'preferred_payment' => 'tarjeta',
                'credit_limit' => 4000.00,
            ],
        ];

        foreach ($customers as $customerData) {
            Customer::firstOrCreate(
                ['email' => $customerData['email']],
                array_merge($customerData, [
                    'is_active' => true,
                    'total_purchases' => 0,
                    'total_orders' => 0,
                ])
            );
        }
    }
}