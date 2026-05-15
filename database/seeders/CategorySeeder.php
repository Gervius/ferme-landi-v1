<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $createCategory = function ($name, $scope) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'scope' => $scope,
                'is_active' => true,
            ]);
        };

        // Produits finis (Ventes)
        $createCategory('Plateau d\'Oeufs (Gros)', \App\Enums\CategoryScope::PRODUCT->value);
        $createCategory('Plateau d\'Oeufs (Moyen)', \App\Enums\CategoryScope::PRODUCT->value);

        // Animaux Vivants (Achats et Ventes)
        $createCategory('Porc Charcutier (Sur pied)', \App\Enums\CategoryScope::ANIMAL->value);
        $createCategory('Poulet de Chair (Vivant)', \App\Enums\CategoryScope::ANIMAL->value);
        $createCategory('Poussin d\'un jour (Pondeuse)', \App\Enums\CategoryScope::ANIMAL->value);
        $createCategory('Porcelet', \App\Enums\CategoryScope::ANIMAL->value);

        // Alimentation (Achats et Consommation)
        $createCategory('Aliment Pondeuse Phase 1', \App\Enums\CategoryScope::FEED->value);
        $createCategory('Maïs Grains', \App\Enums\CategoryScope::FEED->value);

        // Santé (Achats et Traitements)
        $createCategory('Vaccin Newcastle', \App\Enums\CategoryScope::MEDICATION->value);
        $createCategory('Vitamines Anti-stress', \App\Enums\CategoryScope::MEDICATION->value);
        $createCategory('Déparasitant Porcin', \App\Enums\CategoryScope::MEDICATION->value);
    }
}
