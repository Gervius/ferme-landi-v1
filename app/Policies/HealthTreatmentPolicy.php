<?php

namespace App\Policies;

use App\Models\HealthTreatment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class HealthTreatmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view generations');
    }

    public function view(User $user, HealthTreatment $treatment)
    {
        return $user->hasPermissionTo('view generations');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('create generations');
    }

    public function update(User $user, HealthTreatment $treatment)
    {
        return $user->hasPermissionTo('create generations');
    }

    public function delete(User $user, HealthTreatment $treatment)
    {
        return $user->hasPermissionTo('create generations');
    }
}
