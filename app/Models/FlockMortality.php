<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlockMortality extends Model
{
    use HasApprovalWorkflow;
    use SoftDeletes;

    protected $fillable = [
        'generation_id',
        'date',
        'quantity',
        'cause',
        'estimated_financial_loss',
        'status',
        'prepared_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'date' => 'date',
        'quantity' => 'integer',
        'estimated_financial_loss' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }
}
