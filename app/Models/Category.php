<?php

namespace App\Models;

use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'scope',
        'is_active',
        'analytical_code_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'scope' => \App\Enums\CategoryScope::class,
    ];

    public function analyticalCode(): BelongsTo
    {
        return $this->belongsTo(AnalyticalCode::class, 'analytical_code_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // On GARDE children pour les sous-catégories
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // AJOUT : La catégorie connaît les articles physiques qui la composent
    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'category_id');
    }
}