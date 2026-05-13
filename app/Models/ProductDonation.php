<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductDonation extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $guarded = ['id'];

    protected $casts = [
        'date' => 'date',
        'quantity' => 'decimal:2',
        'valorization_price' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
