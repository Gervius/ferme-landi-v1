<?php

namespace App\Policies;

use App\Models\CustomerPayment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CustomerPaymentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function view(User $user, CustomerPayment $payment)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function update(User $user, CustomerPayment $payment)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function delete(User $user, CustomerPayment $payment)
    {
        return $user->hasPermissionTo('manage sales');
    }
}
