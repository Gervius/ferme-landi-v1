<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountingJournal extends Model
{
    use SoftDeletes;

    public const CODE_SALES = 'VE';
    public const CODE_PURCHASES = 'AC';
    public const CODE_PAYROLL = 'SA';

    protected $fillable = [
        'code',
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
