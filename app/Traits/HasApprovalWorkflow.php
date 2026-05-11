<?php

namespace App\Traits;

use App\Models\User;

trait HasApprovalWorkflow
{
    /**
     * Scope a query to only include drafted items.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope a query to only include approved items.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include rejected items.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Check if the model is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the model is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if the model is a draft.
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Approve the model.
     */
    public function approve(int $userId): bool
    {
        if (! $this->isDraft()) {
            return false;
        }

        return $this->update([
            'status' => 'approved',
            'approved_by' => $userId,
            'approved_at' => now(),
        ]);
    }

    /**
     * Reject the model.
     */
    public function reject(int $userId): bool
    {
        if (! $this->isDraft()) {
            return false;
        }

        return $this->update([
            'status' => 'rejected',
            'approved_by' => $userId, // We keep the user ID to trace who rejected it
            'approved_at' => now(),
        ]);
    }

    /**
     * Relationship to the user who prepared this record.
     */
    public function preparer()
    {
        return $this->belongsTo(User::class, 'prepared_by');
    }

    /**
     * Relationship to the user who approved or rejected this record.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
