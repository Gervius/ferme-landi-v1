<?php

namespace App\Actions\Sales;

use App\Models\CustomerPayment;
use Illuminate\Support\Facades\DB;

class LogCustomerPaymentAction
{
    public function execute(array $data, int $userId): CustomerPayment
    {
        $seq = DB::scalar("SELECT nextval('customer_payment_ref_seq')");
        
        $data['reference'] = 'PAY-' . str_pad($seq, 5, '0', STR_PAD_LEFT);
        $data['status'] = 'draft';
        $data['prepared_by'] = $userId;

        return CustomerPayment::create($data);
    }
}