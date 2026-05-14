<?php

namespace App\Policies;

use App\Models\PurchaseReceipt;
use App\Models\User;

class PurchaseReceiptPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view purchases');
    }

    public function view(User $user, PurchaseReceipt $receipt): bool
    {
        return $user->hasPermissionTo('view purchases');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage purchases');
    }

    public function update(User $user, PurchaseReceipt $receipt): bool
    {
        return $user->hasPermissionTo('manage purchases');
    }

    public function delete(User $user, PurchaseReceipt $receipt): bool
    {
        return $user->hasPermissionTo('manage purchases');
    }
}
