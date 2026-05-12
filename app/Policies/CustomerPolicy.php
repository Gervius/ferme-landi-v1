<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CustomerPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function view(User $user, Customer $customer)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function update(User $user, Customer $customer)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function delete(User $user, Customer $customer)
    {
        return $user->hasPermissionTo('manage sales');
    }
}
