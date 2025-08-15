<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;
use App\Models\League;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ClubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener las ligas existentes
        $leagues = League::all();

        if ($leagues->isEmpty()) {
            $this->command->error('No hay ligas disponibles. Ejecuta primero LeagueSeeder.');
            return;
        }

        // Crear clubes de ejemplo
        $clubs = [
            [
                'name' => 'Club Deportivo Los Campeones',
                'city' => 'Quito',
                'address' => 'Av. 6 de Diciembre N24-253 y Wilson',
                'admin_name' => 'Club Los Campeones',
                'admin_email' => 'admin@loscampeones.com',
                'admin_phone' => '+593 99 567 8901',
                'league_name' => 'Liga Nacional de Tenis de Mesa',
            ],
            [
                'name' => 'Club Raqueta de Oro',
                'city' => 'Quito',
                'address' => 'Av. Amazonas N21-147 y Roca',
                'admin_name' => 'Club Raqueta de Oro',
                'admin_email' => 'admin@raquetadeoro.com',
                'admin_phone' => '+593 99 678 9012',
                'league_name' => 'Liga Provincial de Pichincha',
            ],
            [
                'name' => 'Club Tenis de Mesa Quito',
                'city' => 'Quito',
                'address' => 'Av. República del Salvador N34-377 y Suiza',
                'admin_name' => 'Club TM Quito',
                'admin_email' => 'admin@tmquito.com',
                'admin_phone' => '+593 99 789 0123',
                'league_name' => 'Liga Nacional de Tenis de Mesa',
            ],
            [
                'name' => 'Club Deportivo Guayaquil',
                'city' => 'Guayaquil',
                'address' => 'Av. 9 de Octubre 100 y Malecón',
                'admin_name' => 'Club Guayaquil',
                'admin_email' => 'admin@clubguayaquil.com',
                'admin_phone' => '+593 99 890 1234',
                'league_name' => 'Liga Regional del Guayas',
            ],
            [
                'name' => 'Club Ping Pong Cuenca',
                'city' => 'Cuenca',
                'address' => 'Calle Larga 7-07 y Borrero',
                'admin_name' => 'Club Cuenca',
                'admin_email' => 'admin@clubcuenca.com',
                'admin_phone' => '+593 99 901 2345',
                'league_name' => 'Liga de Azuay',
            ],
        ];

        foreach ($clubs as $clubData) {
            // Buscar la liga correspondiente
            $league = $leagues->where('name', $clubData['league_name'])->first();
            
            if (!$league) {
                $this->command->warn("Liga no encontrada: {$clubData['league_name']}");
                continue;
            }

            // Crear usuario administrador del club
            $user = User::create([
                'name' => $clubData['admin_name'],
                'email' => $clubData['admin_email'],
                'password' => Hash::make('password123'),
                'role' => 'club',
                'phone' => $clubData['admin_phone'],
                'country' => 'Ecuador',
                'club_name' => $clubData['name'],
                'parent_league_id' => $league->id,
                'city' => $clubData['city'],
                'address' => $clubData['address'],
            ]);

            // Crear la entidad club
            $club = Club::create([
                'user_id' => $user->id,
                'league_id' => $league->id,
                'name' => $clubData['name'],
                'city' => $clubData['city'],
                'address' => $clubData['address'],
                'status' => 'active',
            ]);

            // Actualizar el usuario con la relación polimórfica
            $user->update([
                'roleable_id' => $club->id,
                'roleable_type' => Club::class,
            ]);

            $this->command->info("Club creado: {$club->name} en liga: {$league->name} con admin: {$user->email}");
        }
    }
}