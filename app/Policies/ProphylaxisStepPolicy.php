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
        return true;
    }

    public function view(User $user, ProphylaxisStep $step)
    {
        return true;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, ProphylaxisStep $step)
    {
        return true;
    }

    public function delete(User $user, ProphylaxisStep $step)
    {
        return true;
    }
}
