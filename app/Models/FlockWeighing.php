<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlockWeighing extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    // VERROUILLAGE SÉCURITÉ & RAM : On liste explicitement les colonnes
    protected $fillable = [
        'generation_id',
        'date',
        'average_weight',
        'weighed_subjects_count',
        'status',
        'prepared_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'date' => 'date',
        'average_weight' => 'decimal:2',
        'weighed_subjects_count' => 'integer',
        'approved_at' => 'datetime',
    ];

    // TYPAGE STRICT PHP 8.4+
    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }
}