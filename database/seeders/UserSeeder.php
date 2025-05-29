<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario administrador
        $admin = User::firstOrCreate(
            ['email' => 'admin@fruteria.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'phone' => '+54 11 1234-5678',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // Usuario gerente
        $manager = User::firstOrCreate(
            ['email' => 'gerente@fruteria.com'],
            [
                'name' => 'Gerente General',
                'password' => Hash::make('gerente123'),
                'phone' => '+54 11 1234-5679',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $manager->assignRole('gerente');

        // Usuario cajero
        $cashier = User::firstOrCreate(
            ['email' => 'cajero@fruteria.com'],
            [
                'name' => 'Cajero Principal',
                'password' => Hash::make('cajero123'),
                'phone' => '+54 11 1234-5680',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $cashier->assignRole('cajero');

        // Cajero adicional
        $cashier2 = User::firstOrCreate(
            ['email' => 'cajero2@fruteria.com'],
            [
                'name' => 'María González',
                'password' => Hash::make('cajero123'),
                'phone' => '+54 11 1234-5681',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $cashier2->assignRole('cajero');
    }
}