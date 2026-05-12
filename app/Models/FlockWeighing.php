<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlockWeighing extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $guarded = ['id'];

    protected $casts = [
        'date' => 'date',
        'average_weight' => 'decimal:2',
        'weighed_subjects_count' => 'integer',
        'approved_at' => 'datetime',
    ];

    public function generation()
    {
        return $this->belongsTo(Generation::class);
    }
}
