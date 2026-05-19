<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseReceipt extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $guarded = ["id"];

    protected $casts = [
        "receipt_date" => "date",
        "approved_at" => "datetime",
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseReceiptItem::class);
    }
}
