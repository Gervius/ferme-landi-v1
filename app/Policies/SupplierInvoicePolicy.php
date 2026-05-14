<?php

namespace App\Policies;

use App\Models\SupplierInvoice;
use App\Models\User;

class SupplierInvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view purchases');
    }

    public function view(User $user, SupplierInvoice $invoice): bool
    {
        return $user->hasPermissionTo('view purchases');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage purchases');
    }

    public function update(User $user, SupplierInvoice $invoice): bool
    {
        return $user->hasPermissionTo('manage purchases');
    }

    public function delete(User $user, SupplierInvoice $invoice): bool
    {
        return $user->hasPermissionTo('manage purchases');
    }
}
