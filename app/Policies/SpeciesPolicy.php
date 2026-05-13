<?php

namespace App\Policies;

use App\Models\Species;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SpeciesPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view breeds');
    }

    public function view(User $user, Species $species)
    {
        return $user->hasPermissionTo('view breeds');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage breeds');
    }

    public function update(User $user, Species $species)
    {
        return $user->hasPermissionTo('manage breeds');
    }

    public function delete(User $user, Species $species)
    {
        return $user->hasPermissionTo('manage breeds');
    }
}
