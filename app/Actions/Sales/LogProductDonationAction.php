<?php

namespace App\Actions\Sales;

use App\Models\ProductDonation;

class LogProductDonationAction
{
    /**
     * Log a new product donation in draft status.
     *
     * @param array $data
     * @param int $userId
     * @return ProductDonation
     */
    public function execute(array $data, int $userId): ProductDonation
    {
        $data['status'] = 'draft';
        $data['prepared_by'] = $userId;

        return ProductDonation::create($data);
    }
}
