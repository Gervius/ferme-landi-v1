<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlockCulling extends Model
{
    use HasApprovalWorkflow;
    use SoftDeletes;

    protected $fillable = [
        'generation_id',
        'date',
        'quantity_culled',
        'reason',
        'weight_kg',
        'status',
        'prepared_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'date' => 'date',
        'quantity_culled' => 'integer',
        'weight_kg' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }
}
