<?php

namespace App\Policies;

use App\Models\PayrollRecord;
use App\Models\User;

class PayrollRecordPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('manage hr');
    }

    public function view(User $user, PayrollRecord $payrollRecord): bool
    {
        return $user->hasPermissionTo('manage hr');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage hr');
    }

    public function update(User $user, PayrollRecord $payrollRecord): bool
    {
        return $user->hasPermissionTo('manage hr');
    }

    public function delete(User $user, PayrollRecord $payrollRecord): bool
    {
        return $user->hasPermissionTo('manage hr');
    }
}
