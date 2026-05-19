<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnalyticalNature extends Model
{
    use SoftDeletes;

    public const CODE_SALES = '06';
    public const CODE_PURCHASES = '04';
    public const CODE_HEALTH = '05';
    public const CODE_PAYROLL = '07';

    protected $fillable = [
        'code',
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function centers(): HasMany
    {
        return $this->hasMany(AnalyticalCenter::class, 'analytical_nature_id');
    }
}
