<?php

namespace App\Actions\Logistics;

use App\Models\Category;
use Illuminate\Support\Str;

class UpdateCategoryAction
{
    /**
     * Update an existing category.
     */
    public function execute(Category $category, array $data): Category
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($data['slug'] !== $category->slug) {
            $originalSlug = $data['slug'];
            $count = 1;
            while (Category::where('slug', $data['slug'])->where('id', '!=', $category->id)->exists()) {
                $data['slug'] = "{$originalSlug}-{$count}";
                $count++;
            }
        }

        $category->update($data);

        return $category;
    }
}
