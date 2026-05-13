<?php

namespace App\Policies;

use App\Models\Breed;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BreedPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view breeds');
    }

    public function view(User $user, Breed $breed)
    {
        return $user->hasPermissionTo('view breeds');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage breeds');
    }

    public function update(User $user, Breed $breed)
    {
        return $user->hasPermissionTo('manage breeds');
    }

    public function delete(User $user, Breed $breed)
    {
        return $user->hasPermissionTo('manage breeds');
    }
}
