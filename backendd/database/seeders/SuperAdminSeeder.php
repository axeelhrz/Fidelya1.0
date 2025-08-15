<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario super admin
        $superAdmin = User::updateOrCreate(
            ['email' => 'axeelhrz@gmail.com'],
            [
                'name' => 'Axel Hernández - Super Admin',
                'email' => 'axeelhrz@gmail.com',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'phone' => '+593 99 999 9999',
                'country' => 'Ecuador',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("Super Admin creado: {$superAdmin->email}");
        $this->command->info("Contraseña: admin123");
    }
}