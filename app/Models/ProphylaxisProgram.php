<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ProphylaxisProgram extends Model
{
    use HasFactory;

    // Remplacement du $guarded pour verrouiller l'empreinte mémoire
    protected $fillable = [
        'name',
        'animal_type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Typage strict du retour de la relation
    public function steps(): HasMany
    {
        return $this->hasMany(ProphylaxisStep::class);
    }
}