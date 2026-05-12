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
        return true;
    }

    public function view(User $user, ProphylaxisProgram $program)
    {
        return true;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, ProphylaxisProgram $program)
    {
        return true;
    }

    public function delete(User $user, ProphylaxisProgram $program)
    {
        return true;
    }
}
