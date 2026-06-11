<?php

namespace App\Models;

use App\Enums\GenerationType;
use App\Enums\GenerationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

final class Generation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'site_id',
        'breed_id',
        'code',
        'type',
        'start_date',
        'initial_quantity',
        'current_quantity',
        'status',
        'observation',
    ];

    protected $casts = [
        'start_date' => 'date',
        'initial_quantity' => 'integer',
        'current_quantity' => 'integer',
        'type' => GenerationType::class,
        'status' => GenerationStatus::class,
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function breed(): BelongsTo
    {
        return $this->belongsTo(Breed::class);
    }

    public function dailyFlockMetrics(): HasMany
    {
        return $this->hasMany(DailyFlockMetric::class);
    }

    // Calculs "Lazy" à la volée (ne consomme la RAM que si explicitement demandé)
    protected function ageInDays(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->start_date ? (int) $this->start_date->diffInDays(now()) : 0,
        );
    }

    protected function ageInWeeks(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->start_date ? (int) $this->start_date->diffInWeeks(now()) : 0,
        );
    }

    protected function survivalRate(): Attribute
    {
        return Attribute::make(
            get: fn () => ($this->initial_quantity > 0) 
                ? round(($this->current_quantity / $this->initial_quantity) * 100, 2) 
                : 0,
        );
    }

    protected function capabilities(): Attribute
    {
        return Attribute::make(
            get: fn () => [
                'can_produce_eggs' => $this->type === GenerationType::PONDEUSE,
                'can_be_weighed' => in_array($this->type, [GenerationType::CHAIR, GenerationType::PORC], true),
            ],
        );
    }
}