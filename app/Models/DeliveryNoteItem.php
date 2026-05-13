<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryNoteItem extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'delivered_quantity' => 'decimal:2',
    ];

    public function deliveryNote()
    {
        return $this->belongsTo(DeliveryNote::class);
    }

    public function saleOrderItem()
    {
        return $this->belongsTo(SaleOrderItem::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
