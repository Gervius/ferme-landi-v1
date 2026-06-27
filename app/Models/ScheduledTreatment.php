<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ScheduledTreatment extends Model
{
    use HasFactory;

    protected $fillable = [
        'generation_id',
        'prophylaxis_step_id',
        'scheduled_date',
        'status'
    ];

    protected $casts = [
        'scheduled_date' => 'date',
    ];

    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }

    public function step(): BelongsTo
    {
        return $this->belongsTo(ProphylaxisStep::class, 'prophylaxis_step_id');
    }
}