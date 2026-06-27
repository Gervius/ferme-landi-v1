<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockWeighing;
use Illuminate\Support\Facades\DB;

final readonly class LogWeighingAction
{
    public function execute(array $data, int $userId): FlockWeighing
    {
        return DB::transaction(function () use ($data, $userId) {
            $data['status'] = 'draft';
            $data['prepared_by'] = $userId;

            return FlockWeighing::create($data);
        });
    }
}