<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $guarded = ['id'];

    protected $casts = [
        'invoice_date' => 'date',
        'due_date' => 'date',
        'total_amount' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function deliveryNote()
    {
        return $this->belongsTo(DeliveryNote::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
