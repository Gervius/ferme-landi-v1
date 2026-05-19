<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $guarded = ["id"];

    protected $casts = [
        "order_date" => "date",
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, "created_by");
    }
}
