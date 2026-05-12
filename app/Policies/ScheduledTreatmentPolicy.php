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
        return true;
    }

    public function view(User $user, ScheduledTreatment $treatment)
    {
        return true;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, ScheduledTreatment $treatment)
    {
        return true;
    }

    public function delete(User $user, ScheduledTreatment $treatment)
    {
        return true;
    }
}
