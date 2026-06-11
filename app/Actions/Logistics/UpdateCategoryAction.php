<?php

namespace App\Actions\Logistics;

use App\Models\Category;
use Illuminate\Support\Str;

final readonly class UpdateCategoryAction
{
    /**
     * Update an existing category (Anti N+1 & Memory Optimized).
     */
    public function execute(Category $category, array $data): Category
    {
        if (empty($data['slug']) && isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Si le slug a changé ou a été auto-généré, on vérifie l'unicité
        if (isset($data['slug']) && $data['slug'] !== $category->slug) {
            $originalSlug = $data['slug'];
            
            // Une seule requête pour récupérer les slugs concurrents
            $existingSlugs = Category::where('slug', 'LIKE', "{$originalSlug}%")
                ->where('id', '!=', $category->id)
                ->pluck('slug')
                ->toArray();

            if (in_array($originalSlug, $existingSlugs)) {
                $count = 1;
                while (in_array("{$originalSlug}-{$count}", $existingSlugs)) {
                    $count++;
                }
                $data['slug'] = "{$originalSlug}-{$count}";
            }
        }

        $category->update($data);

        return $category;
    }
}