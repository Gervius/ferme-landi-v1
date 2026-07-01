<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeedConsumption extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $fillable = [
        'generation_id',
        'item_id', 
        'unit_id',
        'date',
        'quantity',
        'total_base_quantity',
        'status',
        'prepared_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'date' => 'date',
        'quantity' => 'decimal:2',
        'total_base_quantity' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }

    // Renommé et repointé vers Item
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}