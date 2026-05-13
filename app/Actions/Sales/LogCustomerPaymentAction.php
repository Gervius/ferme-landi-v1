<?php

namespace App\Actions\Sales;

use App\Models\CustomerPayment;

class LogCustomerPaymentAction
{
    /**
     * Log a new customer payment in draft status.
     */
    public function execute(array $data, int $userId): CustomerPayment
    {
        $data['status'] = 'draft';
        $data['prepared_by'] = $userId;

        return CustomerPayment::create($data);
    }
}
