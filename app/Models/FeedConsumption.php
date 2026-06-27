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

    // SECURITÉ & RAM : On liste explicitement les colonnes
    protected $fillable = [
        'generation_id',
        'item_category_id',
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

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'item_category_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}