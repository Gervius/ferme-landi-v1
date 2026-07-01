<?php

namespace App\Actions\Sales;

use App\Models\ProductDonation;
use Illuminate\Support\Facades\DB;

class LogProductDonationAction
{
    public function execute(array $data, int $userId): ProductDonation
    {
        $seq = DB::scalar("SELECT nextval('product_donation_ref_seq')");
        
        $data['reference'] = 'DON-' . str_pad($seq, 5, '0', STR_PAD_LEFT);
        $data['status'] = 'draft';
        $data['prepared_by'] = $userId;

        return ProductDonation::create($data);
    }
}