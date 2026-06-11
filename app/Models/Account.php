<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use SoftDeletes;

    public const CODE_CLIENTS = '4111';
    public const CODE_SUPPLIERS = '4011';
    public const CODE_SALES = '7011';
    public const CODE_PURCHASES = '6011';
    public const CODE_SALARIES_EXPENSE = '6611';
    public const CODE_SALARIES_PAYABLE = '422';
    public const CODE_SALARIES_ADVANCES = '421';

    protected $fillable = [
        'number',
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
