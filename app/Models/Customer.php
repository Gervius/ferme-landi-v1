<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['outstanding_balance'];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments()
    {
        return $this->hasMany(CustomerPayment::class);
    }

    public function getOutstandingBalanceAttribute(): float
    {
        $totalInvoices = $this->invoices()
            ->whereIn('status', ['validated', 'partially_paid', 'paid']) // assuming validated means it's due
            ->sum('total_amount');

        $totalPayments = $this->payments()
            ->where('status', 'approved')
            ->sum('amount');

        return (float) ($totalInvoices - $totalPayments);
    }
}
