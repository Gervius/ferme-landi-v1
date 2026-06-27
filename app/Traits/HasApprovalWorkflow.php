<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasApprovalWorkflow
{
    /**
     * Scope a query to only include drafted items.
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope a query to only include approved items.
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include rejected items.
     */
    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Check if the model is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved'; // Ou utiliser ton Enum WorkflowStatus
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
            'approved_by' => $userId,
            'approved_at' => now(),
        ]);
    }

    /**
     * Relationship to the user who prepared this record.
     * TYPAGE STRICT PHP 8.4+
     */
    public function preparer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prepared_by');
    }

    /**
     * Relationship to the user who approved or rejected this record.
     * TYPAGE STRICT PHP 8.4+
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}