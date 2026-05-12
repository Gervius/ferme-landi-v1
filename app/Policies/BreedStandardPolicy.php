<?php

namespace App\Policies;

use App\Models\BreedStandard;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BreedStandardPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view breeds');
    }

    public function view(User $user, BreedStandard $breedStandard)
    {
        return $user->hasPermissionTo('view breeds');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('edit breeds');
    }

    public function update(User $user, BreedStandard $breedStandard)
    {
        return $user->hasPermissionTo('edit breeds');
    }

    public function delete(User $user, BreedStandard $breedStandard)
    {
        return $user->hasPermissionTo('edit breeds');
    }
}
