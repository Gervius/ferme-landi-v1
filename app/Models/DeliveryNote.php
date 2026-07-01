<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryNote extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $guarded = ["id"];

    protected $casts = [
        "delivery_date" => "date",
        "approved_at" => "datetime",
    ];

    public function site():BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function saleOrder():BelongsTo
    {
        return $this->belongsTo(SaleOrder::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(DeliveryNoteItem::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
