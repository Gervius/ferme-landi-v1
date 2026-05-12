<?php

namespace App\Policies;

use App\Models\DailyFlockMetric;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DailyFlockMetricPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view generations');
    }

    public function view(User $user, DailyFlockMetric $dailyFlockMetric)
    {
        return $user->hasPermissionTo('view generations');
    }

    // Usually metrics are generated automatically, so create/update/delete might not be needed manually
    // But adding them just in case
    public function create(User $user)
    {
        return false;
    }

    public function update(User $user, DailyFlockMetric $dailyFlockMetric)
    {
        return false;
    }

    public function delete(User $user, DailyFlockMetric $dailyFlockMetric)
    {
        return false;
    }
}
