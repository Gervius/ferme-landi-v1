<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnalyticalCode extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'short_name',
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function centers(): HasMany
    {
        return $this->hasMany(AnalyticalCenter::class, 'analytical_code_id');
    }
}
