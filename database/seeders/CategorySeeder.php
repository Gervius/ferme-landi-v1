<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Enums\CategoryScope;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Création des catégories principales
        $categories = [
            // Aliments
            ['name' => 'Aliments', 'slug' => 'aliments', 'scope' => CategoryScope::FEED->value],
            ['name' => 'Aliment Pondeuses', 'slug' => 'aliment-pondeuses', 'scope' => CategoryScope::FEED->value, 'parent_slug' => 'aliments'],
            ['name' => 'Aliment Croissance', 'slug' => 'aliment-croissance', 'scope' => CategoryScope::FEED->value, 'parent_slug' => 'aliments'],
            ['name' => 'Aliment Porc', 'slug' => 'aliment-porc', 'scope' => CategoryScope::FEED->value, 'parent_slug' => 'aliments'],
            // Médicaments
            ['name' => 'Médicaments', 'slug' => 'medicaments', 'scope' => CategoryScope::MEDICATION->value],
            ['name' => 'Vaccins', 'slug' => 'vaccins', 'scope' => CategoryScope::MEDICATION->value, 'parent_slug' => 'medicaments'],
            ['name' => 'Antibiotiques', 'slug' => 'antibiotiques', 'scope' => CategoryScope::MEDICATION->value, 'parent_slug' => 'medicaments'],
            ['name' => 'Vermifuges', 'slug' => 'vermifuges', 'scope' => CategoryScope::MEDICATION->value, 'parent_slug' => 'medicaments'],
            // Produits
            ['name' => 'Produits finis', 'slug' => 'produits-finis', 'scope' => CategoryScope::PRODUCT->value],
            ['name' => 'Œufs', 'slug' => 'oeufs', 'scope' => CategoryScope::PRODUCT->value, 'parent_slug' => 'produits-finis'],
            ['name' => 'Poulets de chair', 'slug' => 'poulets-chair', 'scope' => CategoryScope::PRODUCT->value, 'parent_slug' => 'produits-finis'],
            ['name' => 'Porcs charcutiers', 'slug' => 'porcs', 'scope' => CategoryScope::PRODUCT->value, 'parent_slug' => 'produits-finis'],
            // Animaux
            ['name' => 'Animaux', 'slug' => 'animaux', 'scope' => CategoryScope::ANIMAL->value],
            ['name' => 'Poulettes', 'slug' => 'poulettes', 'scope' => CategoryScope::ANIMAL->value, 'parent_slug' => 'animaux'],
            ['name' => 'Porcelets', 'slug' => 'porcelets', 'scope' => CategoryScope::ANIMAL->value, 'parent_slug' => 'animaux'],
            // Équipements
            ['name' => 'Équipements', 'slug' => 'equipements', 'scope' => CategoryScope::EQUIPMENT->value],
            ['name' => 'Cages', 'slug' => 'cages', 'scope' => CategoryScope::EQUIPMENT->value, 'parent_slug' => 'equipements'],
            ['name' => 'Abreuvoirs', 'slug' => 'abreuvoirs', 'scope' => CategoryScope::EQUIPMENT->value, 'parent_slug' => 'equipements'],
            ['name' => 'Mangeoires', 'slug' => 'mangeoires', 'scope' => CategoryScope::EQUIPMENT->value, 'parent_slug' => 'equipements'],
        ];

        foreach ($categories as $cat) {
            $parentSlug = $cat['parent_slug'] ?? null;
            unset($cat['parent_slug']);

            $parentId = null;
            if ($parentSlug) {
                $parent = Category::where('slug', $parentSlug)->first();
                if ($parent) {
                    $parentId = $parent->id;
                }
            }

            Category::firstOrCreate(
                ['slug' => $cat['slug']],
                array_merge($cat, ['parent_id' => $parentId])
            );
        }
    }
}