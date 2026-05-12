<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BreedStandard extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'target_laying_start_age' => 'integer',
        'target_culling_age' => 'integer',
        'peak_laying_rate' => 'decimal:2',
        'target_daily_feed_intake' => 'decimal:2',
    ];

    public function breed()
    {
        return $this->belongsTo(Breed::class);
    }
}
