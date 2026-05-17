<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccountingEntry extends Model
{
    use SoftDeletes;

    const STATUS_DRAFT = 'draft';
    const STATUS_VALIDATED = 'validated';

    protected $fillable = [
        'financial_year_id',
        'accounting_journal_id',
        'date',
        'reference',
        'description',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function financialYear(): BelongsTo
    {
        return $this->belongsTo(FinancialYear::class);
    }

    public function accountingJournal(): BelongsTo
    {
        return $this->belongsTo(AccountingJournal::class);
    }

    public function lines(): HasMany
    {
        return $this->hasMany(AccountingEntryLine::class);
    }
}
