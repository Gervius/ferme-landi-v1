<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Generation extends Model
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

    protected $appends = ['capabilities'];

    protected $casts = [
        'start_date' => 'date',
        'initial_quantity' => 'integer',
        'current_quantity' => 'integer',
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function breed(): BelongsTo
    {
        return $this->belongsTo(Breed::class);
    }

    public function getCapabilitiesAttribute(): array
    {
        return [
            'can_produce_eggs' => $this->type === 'pondeuse',
            'can_be_weighed' => in_array($this->type, ['chair', 'porc']),
        ];
    }
}
