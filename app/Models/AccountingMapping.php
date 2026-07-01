<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountingMapping extends Model
{
    protected $fillable = [
        'event_type',
        'name',
        'accounting_journal_id',
        'debit_account_id',
        'credit_account_id',
        'analytical_nature_id',
    ];

    public function journal(): BelongsTo
    {
        return $this->belongsTo(AccountingJournal::class, 'accounting_journal_id');
    }

    public function debitAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'debit_account_id');
    }

    public function creditAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'credit_account_id');
    }

    public function analyticalNature(): BelongsTo
    {
        return $this->belongsTo(AnalyticalNature::class, 'analytical_nature_id');
    }
}