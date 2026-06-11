<?php

namespace App\Actions\Logistics;

use App\Models\Category;
use Illuminate\Support\Str;

final readonly class CreateCategoryAction
{
    /**
     * Crée une catégorie avec gestion de slug dédoublonnée en RAM.
     */
    public function execute(array $data): Category
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $originalSlug = $data['slug'];

        // Élimination du N+1 : On récupère tous les slugs similaires en UNE seule requête restreinte
        $existingSlugs = Category::where('slug', 'LIKE', "{$originalSlug}%")
            ->pluck('slug')
            ->toArray();

        if (in_array($originalSlug, $existingSlugs)) {
            $count = 1;
            while (in_array("{$originalSlug}-{$count}", $existingSlugs)) {
                $count++;
            }
            $data['slug'] = "{$originalSlug}-{$count}";
        }

        return Category::create($data);
    }
}