<?php

namespace App\Actions\Sales;

use App\Models\CustomerPayment;
use Illuminate\Support\Facades\DB;

class ApproveCustomerPaymentAction
{
    /**
     * Approve a customer payment.
     */
    public function execute(CustomerPayment $payment, int $approverId): CustomerPayment
    {
        if (! $payment->isDraft()) {
            throw new \InvalidArgumentException("Only draft payments can be approved.");
        }

        return DB::transaction(function () use ($payment, $approverId) {
            $payment->approve($approverId);

            return $payment;
        });
    }
}
