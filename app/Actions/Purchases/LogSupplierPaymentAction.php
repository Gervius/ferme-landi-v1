<?php

namespace App\Actions\Purchases;

use App\Models\SupplierPayment;
use Illuminate\Support\Facades\DB;

class LogSupplierPaymentAction
{
    public function execute(array $data, int $userId): SupplierPayment
    {
        return DB::transaction(function () use ($data, $userId) {
            return SupplierPayment::create([
                'supplier_id'    => $data['supplier_id'],
                'payment_date'   => $data['payment_date'],
                'reference'      => $data['reference'],
                'amount'         => $data['amount'],
                'payment_method' => $data['payment_method'],
                'notes'          => $data['notes'] ?? null,
                'status'         => 'draft',
                'prepared_by'    => $userId,
            ]);
        });
    }
}
