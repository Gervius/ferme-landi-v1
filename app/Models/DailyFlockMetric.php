<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class DailyFlockMetric extends Model
{
    use HasFactory;

    // SÉCURITÉ & RAM : Déclaration exhaustive pour éviter le sur-stockage mémoire
    protected $fillable = [
        'generation_id',
        'date',
        'live_quantity',
        'eggs_produced',
        'feed_consumed',
        'mortality_count',
        'laying_rate',
        'feed_conversion_ratio',
        'average_weight',
    ];

    protected $casts = [
        'date' => 'date',
        'live_quantity' => 'integer',
        'eggs_produced' => 'decimal:2',
        'feed_consumed' => 'decimal:2',
        'mortality_count' => 'integer',
        'laying_rate' => 'decimal:2',
        'feed_conversion_ratio' => 'decimal:2',
        'average_weight' => 'decimal:2',
    ];

    // TYPAGE STRICT (PHP 8.4+) : Optimisation de l'Opcode JIT
    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }
}