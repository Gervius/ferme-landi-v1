<?php

namespace App\Policies;

use App\Models\ProductDonation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductDonationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function view(User $user, ProductDonation $productDonation)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function update(User $user, ProductDonation $productDonation)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function delete(User $user, ProductDonation $productDonation)
    {
        return $user->hasPermissionTo('manage sales');
    }
}
