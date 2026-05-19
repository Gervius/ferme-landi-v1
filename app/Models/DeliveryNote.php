<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryNote extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $guarded = ["id"];

    protected $casts = [
        "delivery_date" => "date",
        "approved_at" => "datetime",
    ];

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function saleOrder()
    {
        return $this->belongsTo(SaleOrder::class);
    }

    public function items()
    {
        return $this->hasMany(DeliveryNoteItem::class);
    }
}
