<?php

namespace App\Policies;

use App\Models\ProphylaxisStep;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProphylaxisStepPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view prophylaxis');
    }

    public function view(User $user, ProphylaxisStep $step)
    {
        return $user->hasPermissionTo('view prophylaxis');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage prophylaxis');
    }

    public function update(User $user, ProphylaxisStep $step)
    {
        return $user->hasPermissionTo('manage prophylaxis');
    }

    public function delete(User $user, ProphylaxisStep $step)
    {
        return $user->hasPermissionTo('manage prophylaxis');
    }
}
