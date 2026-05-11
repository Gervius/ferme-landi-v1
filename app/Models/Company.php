<?php

namespace App\Models;

use Database\Factories\CompanyFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    /** @use HasFactory<CompanyFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'name',
        'legal_status',
        'tax_id_number',
        'address',
        'email',
        'phone',
    ];

    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }
}
