<?php

namespace App\Actions\Purchases;

use App\Models\SupplierPayment;
use Illuminate\Support\Facades\DB;

class ApproveSupplierPaymentAction
{
    public function execute(SupplierPayment $payment, int $userId): SupplierPayment
    {
        return DB::transaction(function () use ($payment, $userId) {
            $payment->update([
                'status' => 'approved',
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            return $payment;
        });
    }
}
