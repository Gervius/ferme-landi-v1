<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProphylaxisStep extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function program()
    {
        return $this->belongsTo(ProphylaxisProgram::class, 'prophylaxis_program_id');
    }

    public function medicationCategory()
    {
        return $this->belongsTo(Category::class, 'medication_category_id');
    }
}
