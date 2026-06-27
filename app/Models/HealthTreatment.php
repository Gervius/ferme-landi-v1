<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class HealthTreatment extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    // Remplacement du $guarded par un $fillable strict
    protected $fillable = [
        'generation_id',
        'date',
        'disease_description',
        'medication_name',
        'dosage_description',
        'veterinarian_name',
        'status',
        'prepared_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'date' => 'date',
        'approved_at' => 'datetime',
    ];

    // Typage strict (PHP 8.4+)
    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }
}