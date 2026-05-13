<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InvoicePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function view(User $user, Invoice $invoice)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function update(User $user, Invoice $invoice)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function delete(User $user, Invoice $invoice)
    {
        return $user->hasPermissionTo('manage sales');
    }
}
