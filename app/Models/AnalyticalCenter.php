<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticalCenter extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'analytical_nature_id',
        'analytical_code_id',
        'short_name',
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function nature(): BelongsTo
    {
        return $this->belongsTo(AnalyticalNature::class, 'analytical_nature_id');
    }

    public function analyticalCode(): BelongsTo
    {
        return $this->belongsTo(AnalyticalCode::class, 'analytical_code_id');
    }
}
