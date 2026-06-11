<?php

namespace App\Enums;

enum UnitType: string
{
    case MASSE = 'masse';
    case VOLUME = 'volume';
    case LONGUEUR = 'longueur';
    case UNITAIRE = 'unitaire';
    case CONDITIONNEMENT = 'conditionnement';

    public function label(): string
    {
        return match($this) {
            self::MASSE => 'Masse',
            self::VOLUME => 'Volume',
            self::LONGUEUR => 'Longueur',
            self::UNITAIRE => 'Unitaire',
            self::CONDITIONNEMENT => 'Conditionnement',
        };
    }
}