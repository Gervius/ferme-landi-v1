<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DailyProduction extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $guarded = ['id'];

    protected $casts = [
        'date' => 'date',
        'good_quantity' => 'decimal:2',
        'broken_quantity' => 'decimal:2',
        'total_base_quantity' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function generation()
    {
        return $this->belongsTo(Generation::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'item_category_id');
    }
}
