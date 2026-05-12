<?php

namespace App\Policies;

use App\Models\ProphylaxisProgram;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProphylaxisProgramPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view prophylaxis');
    }

    public function view(User $user, ProphylaxisProgram $program)
    {
        return $user->hasPermissionTo('view prophylaxis');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage prophylaxis');
    }

    public function update(User $user, ProphylaxisProgram $program)
    {
        return $user->hasPermissionTo('manage prophylaxis');
    }

    public function delete(User $user, ProphylaxisProgram $program)
    {
        return $user->hasPermissionTo('manage prophylaxis');
    }
}
