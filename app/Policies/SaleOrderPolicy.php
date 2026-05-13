<?php

namespace App\Policies;

use App\Models\SaleOrder;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SaleOrderPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function view(User $user, SaleOrder $saleOrder)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function update(User $user, SaleOrder $saleOrder)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function delete(User $user, SaleOrder $saleOrder)
    {
        return $user->hasPermissionTo('manage sales');
    }
}
