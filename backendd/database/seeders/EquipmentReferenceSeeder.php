<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EquipmentReferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed racket brands
        $racketBrands = [
            ['name' => 'Butterfly', 'country' => 'Japan'],
            ['name' => 'DHS', 'country' => 'China'],
            ['name' => 'Sanwei', 'country' => 'China'],
            ['name' => 'Nittaku', 'country' => 'Japan'],
            ['name' => 'Yasaka', 'country' => 'Sweden'],
            ['name' => 'Stiga', 'country' => 'Sweden'],
            ['name' => 'Victas', 'country' => 'Japan'],
            ['name' => 'Joola', 'country' => 'Germany'],
            ['name' => 'Xiom', 'country' => 'South Korea'],
        ];

        foreach ($racketBrands as $brand) {
            DB::table('racket_brands')->insert(array_merge($brand, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Seed rubber brands
        $rubberBrands = [
            ['name' => 'Butterfly', 'country' => 'Japan'],
            ['name' => 'DHS', 'country' => 'China'],
            ['name' => 'Sanwei', 'country' => 'China'],
            ['name' => 'Nittaku', 'country' => 'Japan'],
            ['name' => 'Yasaka', 'country' => 'Sweden'],
            ['name' => 'Stiga', 'country' => 'Sweden'],
            ['name' => 'Victas', 'country' => 'Japan'],
            ['name' => 'Joola', 'country' => 'Germany'],
            ['name' => 'Xiom', 'country' => 'South Korea'],
            ['name' => 'Saviga', 'country' => 'China'],
            ['name' => 'Friendship', 'country' => 'China'],
            ['name' => 'Dr. Neubauer', 'country' => 'Germany'],
        ];

        foreach ($rubberBrands as $brand) {
            DB::table('rubber_brands')->insert(array_merge($brand, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Seed some popular racket models
        $racketModels = [
            // Sanwei models
            ['brand_name' => 'Sanwei', 'name' => '5L Carbono+', 'type' => 'carbono', 'speed' => 8, 'control' => 7],
            ['brand_name' => 'Sanwei', 'name' => 'F3', 'type' => 'carbono', 'speed' => 9, 'control' => 6],
            
            // Butterfly models
            ['brand_name' => 'Butterfly', 'name' => 'Timo Boll ALC', 'type' => 'carbono', 'speed' => 9, 'control' => 8],
            ['brand_name' => 'Butterfly', 'name' => 'Viscaria', 'type' => 'carbono', 'speed' => 10, 'control' => 7],
            
            // DHS models
            ['brand_name' => 'DHS', 'name' => 'Hurricane Long 5', 'type' => 'madera', 'speed' => 7, 'control' => 9],
            ['brand_name' => 'DHS', 'name' => 'Power G7', 'type' => 'carbono', 'speed' => 9, 'control' => 6],
        ];

        foreach ($racketModels as $model) {
            $brandId = DB::table('racket_brands')->where('name', $model['brand_name'])->first()->id;
            DB::table('racket_models')->insert([
                'brand_id' => $brandId,
                'name' => $model['name'],
                'type' => $model['type'],
                'speed' => $model['speed'],
                'control' => $model['control'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed some popular rubber models
        $rubberModels = [
            // Friendship models
            [
                'brand_name' => 'Friendship',
                'name' => 'Cross 729',
                'type' => 'liso',
                'speed' => 7,
                'spin' => 8,
                'control' => 8,
                'available_colors' => json_encode(['negro', 'rojo']),
                'available_sponges' => json_encode(['2.1']),
                'available_hardness' => json_encode(['h42'])
            ],
            
            // Saviga models
            [
                'brand_name' => 'Saviga',
                'name' => 'Vpupo',
                'type' => 'pupo_largo',
                'speed' => 6,
                'spin' => 9,
                'control' => 7,
                'available_colors' => json_encode(['rojo', 'negro']),
                'available_sponges' => json_encode(['0.5']),
                'available_hardness' => json_encode(['n/a'])
            ],
            
            // DHS models
            [
                'brand_name' => 'DHS',
                'name' => 'Hurricane 3',
                'type' => 'liso',
                'speed' => 9,
                'spin' => 10,
                'control' => 7,
                'available_colors' => json_encode(['negro', 'rojo']),
                'available_sponges' => json_encode(['2.1', '2.2']),
                'available_hardness' => json_encode(['h42', 'h44', 'h46'])
            ],
        ];

        foreach ($rubberModels as $model) {
            $brandId = DB::table('rubber_brands')->where('name', $model['brand_name'])->first()->id;
            DB::table('rubber_models')->insert([
                'brand_id' => $brandId,
                'name' => $model['name'],
                'type' => $model['type'],
                'speed' => $model['speed'],
                'spin' => $model['spin'],
                'control' => $model['control'],
                'available_colors' => $model['available_colors'],
                'available_sponges' => $model['available_sponges'],
                'available_hardness' => $model['available_hardness'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Ecuador locations
        $ecuadorLocations = [
            ['province' => 'Guayas', 'city' => 'Guayaquil'],
            ['province' => 'Guayas', 'city' => 'Milagro'],
            ['province' => 'Guayas', 'city' => 'Buena Fe'],
            ['province' => 'Pichincha', 'city' => 'Quito'],
            ['province' => 'Manabí', 'city' => 'Manta'],
            ['province' => 'Manabí', 'city' => 'Portoviejo'],
            ['province' => 'Azuay', 'city' => 'Cuenca'],
            ['province' => 'Tungurahua', 'city' => 'Ambato'],
            ['province' => 'Los Ríos', 'city' => 'Quevedo'],
            ['province' => 'Santa Elena', 'city' => 'La Libertad'],
            ['province' => 'Galápagos', 'city' => 'Puerto Ayora'],
            ['province' => 'Los Ríos', 'city' => 'Urdaneta'],
        ];

        foreach ($ecuadorLocations as $location) {
            DB::table('ecuador_locations')->insert(array_merge($location, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Seed table tennis clubs reference
        $ttClubs = [
            ['name' => 'PPHC', 'city' => 'Cuenca', 'province' => 'Azuay', 'federation' => 'Fede Guayas'],
            ['name' => 'Ping Pro', 'city' => 'Guayaquil', 'province' => 'Guayas', 'federation' => 'Fede Guayas'],
            ['name' => 'Billy Team', 'city' => 'Guayaquil', 'province' => 'Guayas', 'federation' => 'Fede Guayas'],
            ['name' => 'Independiente', 'city' => 'Guayaquil', 'province' => 'Guayas', 'federation' => 'Fede Guayas'],
            ['name' => 'BackSpin', 'city' => 'Guayaquil', 'province' => 'Guayas', 'federation' => 'Fede Guayas'],
            ['name' => 'Spin Factor', 'city' => 'Portoviejo', 'province' => 'Manabí', 'federation' => 'Fede Manabí'],
            ['name' => 'Spin Zone', 'city' => 'Ambato', 'province' => 'Tungurahua', 'federation' => null],
            ['name' => 'TM', 'city' => 'Manta', 'province' => 'Manabí', 'federation' => 'Fede Manabí'],
            ['name' => 'Primorac', 'city' => 'Quito', 'province' => 'Pichincha', 'federation' => null],
            ['name' => 'TT Quevedo', 'city' => 'Quevedo', 'province' => 'Los Ríos', 'federation' => null],
            ['name' => 'Ranking Uartes', 'city' => 'Puerto Ayora', 'province' => 'Galápagos', 'federation' => 'Fede Santa Elena'],
            ['name' => 'Guayaquil City', 'city' => 'Guayaquil', 'province' => 'Guayas', 'federation' => 'Fede Guayas'],
            ['name' => 'Ping Pong Rick', 'city' => 'Milagro', 'province' => 'Guayas', 'federation' => 'Fede Guayas'],
            ['name' => 'Ranking Liga 593', 'city' => 'Guayaquil', 'province' => 'Guayas', 'federation' => 'LATEM'],
        ];

        foreach ($ttClubs as $club) {
            DB::table('tt_clubs_reference')->insert(array_merge($club, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}