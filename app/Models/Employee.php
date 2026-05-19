<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        "site_id",
        "analytical_code_id",
        "first_name",
        "last_name",
        "position",
        "hire_date",
        "base_salary",
        "is_active",
    ];

    protected $casts = [
        "hire_date" => "date",
        "base_salary" => "decimal:2",
        "is_active" => "boolean",
    ];

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function analyticalCode(): BelongsTo
    {
        return $this->belongsTo(AnalyticalCode::class, "analytical_code_id");
    }

    public function payrollRecords()
    {
        return $this->hasMany(PayrollRecord::class);
    }
}
