<?php

namespace App\Policies;

use App\Models\FlockWeighing;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FlockWeighingPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view generations');
    }

    public function view(User $user, FlockWeighing $weighing)
    {
        return $user->hasPermissionTo('view generations');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('create generations');
    }

    public function update(User $user, FlockWeighing $weighing)
    {
        return $user->hasPermissionTo('create generations');
    }

    public function delete(User $user, FlockWeighing $weighing)
    {
        return $user->hasPermissionTo('create generations');
    }
}
