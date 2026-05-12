<?php

namespace App\Policies;

use App\Models\DeliveryNote;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DeliveryNotePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function view(User $user, DeliveryNote $deliveryNote)
    {
        return $user->hasPermissionTo('view sales');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function update(User $user, DeliveryNote $deliveryNote)
    {
        return $user->hasPermissionTo('manage sales');
    }

    public function delete(User $user, DeliveryNote $deliveryNote)
    {
        return $user->hasPermissionTo('manage sales');
    }
}
