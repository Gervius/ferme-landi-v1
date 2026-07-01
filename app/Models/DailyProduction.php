<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class DailyProduction extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $fillable = [
        'generation_id',
        'item_id', // Remplacé
        'unit_id',
        'date',
        'good_quantity',
        'broken_quantity',
        'total_base_quantity',
        'status',
        'prepared_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'date' => 'date',
        'good_quantity' => 'decimal:2',
        'broken_quantity' => 'decimal:2',
        'total_base_quantity' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    // Renommé et repointé vers Item
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}