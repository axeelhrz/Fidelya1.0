<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Frutas Frescas',
                'description' => 'Frutas frescas de temporada',
                'color' => '#FF6B6B',
                'icon' => '🍎',
            ],
            [
                'name' => 'Verduras',
                'description' => 'Verduras frescas y orgánicas',
                'color' => '#4ECDC4',
                'icon' => '🥬',
            ],
            [
                'name' => 'Frutas Secas',
                'description' => 'Frutos secos y deshidratados',
                'color' => '#45B7D1',
                'icon' => '🥜',
            ],
            [
                'name' => 'Semillas',
                'description' => 'Semillas para siembra y consumo',
                'color' => '#96CEB4',
                'icon' => '🌱',
            ],
            [
                'name' => 'Hierbas Aromáticas',
                'description' => 'Hierbas frescas para condimentar',
                'color' => '#FFEAA7',
                'icon' => '🌿',
            ],
            [
                'name' => 'Frutas Cítricas',
                'description' => 'Naranjas, limones, pomelos',
                'color' => '#FD79A8',
                'icon' => '🍊',
            ],
            [
                'name' => 'Verduras de Hoja',
                'description' => 'Lechugas, espinacas, acelgas',
                'color' => '#00B894',
                'icon' => '🥗',
            ],
            [
                'name' => 'Tubérculos',
                'description' => 'Papas, batatas, zanahorias',
                'color' => '#E17055',
                'icon' => '🥔',
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::firstOrCreate(
                ['name' => $categoryData['name']],
                [
                    'slug' => \Str::slug($categoryData['name']),
                    'description' => $categoryData['description'],
                    'color' => $categoryData['color'],
                    'icon' => $categoryData['icon'],
                    'is_active' => true,
                ]
            );
        }
    }
}