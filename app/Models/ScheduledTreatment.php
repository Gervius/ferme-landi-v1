<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduledTreatment extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'scheduled_date' => 'date',
    ];

    public function generation()
    {
        return $this->belongsTo(Generation::class);
    }

    public function step()
    {
        return $this->belongsTo(ProphylaxisStep::class, 'prophylaxis_step_id');
    }
}
