<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\League;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LeagueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear algunas ligas de ejemplo
        $leagues = [
            [
                'name' => 'Liga Nacional de Tenis de Mesa',
                'region' => 'Nacional',
                'province' => 'Pichincha',
                'admin_name' => 'Liga Nacional',
                'admin_email' => 'admin@liganacional.com',
                'admin_phone' => '+593 99 123 4567',
            ],
            [
                'name' => 'Liga Provincial de Pichincha',
                'region' => 'Provincial',
                'province' => 'Pichincha',
                'admin_name' => 'Liga Pichincha',
                'admin_email' => 'admin@ligapichincha.com',
                'admin_phone' => '+593 99 234 5678',
            ],
            [
                'name' => 'Liga Regional del Guayas',
                'region' => 'Regional',
                'province' => 'Guayas',
                'admin_name' => 'Liga Guayas',
                'admin_email' => 'admin@ligaguayas.com',
                'admin_phone' => '+593 99 345 6789',
            ],
            [
                'name' => 'Liga de Azuay',
                'region' => 'Provincial',
                'province' => 'Azuay',
                'admin_name' => 'Liga Azuay',
                'admin_email' => 'admin@ligaazuay.com',
                'admin_phone' => '+593 99 456 7890',
            ],
        ];

        foreach ($leagues as $leagueData) {
            // Crear usuario administrador de la liga
            $user = User::create([
                'name' => $leagueData['admin_name'],
                'email' => $leagueData['admin_email'],
                'password' => Hash::make('password123'),
                'role' => 'liga',
                'phone' => $leagueData['admin_phone'],
                'country' => 'Ecuador',
                'league_name' => $leagueData['name'],
                'province' => $leagueData['province'],
            ]);

            // Crear la entidad liga
            $league = League::create([
                'user_id' => $user->id,
                'name' => $leagueData['name'],
                'region' => $leagueData['region'],
                'province' => $leagueData['province'],
                'status' => 'active',
            ]);

            // Actualizar el usuario con la relación polimórfica
            $user->update([
                'roleable_id' => $league->id,
                'roleable_type' => League::class,
            ]);

            $this->command->info("Liga creada: {$league->name} con admin: {$user->email}");
        }
    }
}