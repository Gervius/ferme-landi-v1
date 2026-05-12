<?php

namespace App\Policies;

use App\Models\ScheduledTreatment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ScheduledTreatmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view prophylaxis');
    }

    public function view(User $user, ScheduledTreatment $treatment)
    {
        return $user->hasPermissionTo('view prophylaxis');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage prophylaxis');
    }

    public function update(User $user, ScheduledTreatment $treatment)
    {
        return $user->hasPermissionTo('manage prophylaxis');
    }

    public function delete(User $user, ScheduledTreatment $treatment)
    {
        return $user->hasPermissionTo('manage prophylaxis');
    }
}
