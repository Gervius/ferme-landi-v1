<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'contact_person',
        'phone',
        'email',
        'address',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['outstanding_debt'];

    public function invoices()
    {
        return $this->hasMany(SupplierInvoice::class);
    }

    public function payments()
    {
        return $this->hasMany(SupplierPayment::class);
    }

    public function getOutstandingDebtAttribute(): float
    {
        $totalInvoices = $this->invoices()
            ->whereIn('status', ['validated', 'partially_paid', 'paid'])
            ->sum('total_amount');

        $totalPayments = $this->payments()
            ->where('status', 'approved')
            ->sum('amount');

        return (float) ($totalInvoices - $totalPayments);
    }
}
