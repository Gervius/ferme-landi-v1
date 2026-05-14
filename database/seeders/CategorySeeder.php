<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Petite fonction utilitaire pour éviter de répéter la génération du slug
        $createCategory = function (string $name, string $scope) {
            Category::firstOrCreate(
                ['name' => $name], // On cherche si la catégorie existe déjà par son nom
                [
                    'slug' => Str::slug($name), // Si elle n'existe pas, on la crée avec son slug
                    'scope' => $scope
                ]
            );
        };

        // Catégories de Vente (Scope 'sales')
        $createCategory('Plateau d\'Oeufs (Gros)', 'sales');
        $createCategory('Plateau d\'Oeufs (Moyen)', 'sales');
        $createCategory('Porc Charcutier (Sur pied)', 'sales');
        $createCategory('Poulet de Chair (Vivant)', 'sales');

        // Catégories d'Achat/Inventaire (Scope 'purchases' ou 'inventory')
        $createCategory('Aliment Pondeuse Phase 1', 'purchases');
        $createCategory('Maïs Grains', 'purchases');
        $createCategory('Poussin d\'un jour (Pondeuse)', 'purchases');
        $createCategory('Porcelet', 'purchases');

        // Catégories de Santé (Scope 'medication')
        $createCategory('Vaccin Newcastle', 'medication');
        $createCategory('Vitamines Anti-stress', 'medication');
        $createCategory('Déparasitant Porcin', 'medication');
    }
}