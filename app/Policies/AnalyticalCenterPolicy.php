<?php

namespace App\Policies;

use App\Models\AnalyticalCenter;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AnalyticalCenterPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('manage accounting');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, AnalyticalCenter $analyticalCenter): bool
    {
        return $user->hasPermissionTo('manage accounting');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage accounting');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AnalyticalCenter $analyticalCenter): bool
    {
        return $user->hasPermissionTo('manage accounting');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AnalyticalCenter $analyticalCenter): bool
    {
        return $user->hasPermissionTo('manage accounting');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, AnalyticalCenter $analyticalCenter): bool
    {
        return $user->hasPermissionTo('manage accounting');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, AnalyticalCenter $analyticalCenter): bool
    {
        return false;
    }
}
