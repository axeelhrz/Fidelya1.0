<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'Distribuidora San Miguel',
                'business_name' => 'San Miguel Distribuciones S.A.',
                'tax_id' => '30-12345678-9',
                'contact_person' => 'Juan Pérez',
                'phone' => '+54 11 4567-8901',
                'email' => 'ventas@sanmiguel.com',
                'address' => 'Av. San Martín 456',
                'city' => 'San Miguel',
                'state' => 'Buenos Aires',
                'postal_code' => '1663',
                'payment_terms' => '30_dias',
                'credit_limit' => 50000.00,
            ],
            [
                'name' => 'Frutas del Valle',
                'business_name' => 'Frutas del Valle S.R.L.',
                'tax_id' => '30-87654321-9',
                'contact_person' => 'María García',
                'phone' => '+54 11 4567-8902',
                'email' => 'pedidos@frutasdelvalle.com',
                'address' => 'Ruta 8 Km 45',
                'city' => 'Luján',
                'state' => 'Buenos Aires',
                'postal_code' => '6700',
                'payment_terms' => 'contado',
                'credit_limit' => 25000.00,
            ],
            [
                'name' => 'Verduras Orgánicas del Sur',
                'business_name' => 'Orgánicos del Sur S.A.',
                'tax_id' => '30-11223344-9',
                'contact_person' => 'Carlos Rodríguez',
                'phone' => '+54 11 4567-8903',
                'email' => 'info@organicossur.com',
                'address' => 'Camino Rural 123',
                'city' => 'Cañuelas',
                'state' => 'Buenos Aires',
                'postal_code' => '1814',
                'payment_terms' => '60_dias',
                'credit_limit' => 75000.00,
            ],
            [
                'name' => 'Mercado Central',
                'business_name' => 'Mercado Central de Buenos Aires',
                'tax_id' => '30-55667788-9',
                'contact_person' => 'Ana López',
                'phone' => '+54 11 4567-8904',
                'email' => 'ventas@mercadocentral.com',
                'address' => 'Av. del Mercado 789',
                'city' => 'La Matanza',
                'state' => 'Buenos Aires',
                'postal_code' => '1778',
                'payment_terms' => 'contado',
                'credit_limit' => 100000.00,
            ],
            [
                'name' => 'Semillas Patagónicas',
                'business_name' => 'Semillas Patagónicas S.R.L.',
                'tax_id' => '30-99887766-9',
                'contact_person' => 'Roberto Silva',
                'phone' => '+54 11 4567-8905',
                'email' => 'contacto@semillaspatagonicas.com',
                'address' => 'Av. Patagonia 321',
                'city' => 'Bariloche',
                'state' => 'Río Negro',
                'postal_code' => '8400',
                'payment_terms' => '30_dias',
                'credit_limit' => 30000.00,
            ],
        ];

        foreach ($suppliers as $supplierData) {
            Supplier::firstOrCreate(
                ['tax_id' => $supplierData['tax_id']],
                array_merge($supplierData, ['is_active' => true])
            );
        }
    }
}