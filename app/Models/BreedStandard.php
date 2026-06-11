<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class BreedStandard extends Model
{
    protected $fillable = [
        'breed_id',
        'target_laying_start_age',
        'target_culling_age',
        'peak_laying_rate',
        'target_daily_feed_intake'
    ];

    protected $casts = [
        'target_laying_start_age' => 'integer',
        'target_culling_age' => 'integer',
        'peak_laying_rate' => 'decimal:2',
        'target_daily_feed_intake' => 'decimal:2',
    ];

    public function breed(): BelongsTo
    {
        return $this->belongsTo(Breed::class);
    }
}