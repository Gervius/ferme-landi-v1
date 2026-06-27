<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProphylaxisStep extends Model
{
    use HasFactory;

    // Déclaration explicite des attributs modifiables
    protected $fillable = [
        'prophylaxis_program_id',
        'day_offset',
        'medication_category_id',
        'description',
        'alert_days_before',
    ];

    // Typage strict du retour de la relation
    public function program(): BelongsTo
    {
        return $this->belongsTo(ProphylaxisProgram::class, 'prophylaxis_program_id');
    }

    // Typage strict du retour de la relation
    public function medicationCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'medication_category_id');
    }
}