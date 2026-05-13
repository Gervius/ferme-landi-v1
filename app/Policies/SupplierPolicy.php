<?php

namespace App\Policies;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SupplierPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view purchases');
    }

    public function view(User $user, Supplier $supplier): bool
    {
        return $user->hasPermissionTo('view purchases');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage purchases');
    }

    public function update(User $user, Supplier $supplier): bool
    {
        return $user->hasPermissionTo('manage purchases');
    }

    public function delete(User $user, Supplier $supplier): bool
    {
        return $user->hasPermissionTo('manage purchases');
    }
}
