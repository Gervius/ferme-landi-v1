<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyFlockMetric extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'date' => 'date',
        'live_quantity' => 'integer',
        'eggs_produced' => 'decimal:2',
        'feed_consumed' => 'decimal:2',
        'mortality_count' => 'integer',
        'laying_rate' => 'decimal:2',
        'feed_conversion_ratio' => 'decimal:2',
    ];

    public function generation()
    {
        return $this->belongsTo(Generation::class);
    }
}
