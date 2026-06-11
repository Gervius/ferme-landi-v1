<?php

namespace App\Enums;


enum SiteType: string
{
    case FERME_AVICOLE = 'ferme_avicole';
    case FERME_PORCINE = 'ferme_porcine';
    case USINE_TRANSFORMATION = 'usine_transformation';
    case ENTREPOT = 'entrepot';
    case BUREAU = 'bureau';

    public function label(): string
    {
        return match($this) {
            self::FERME_AVICOLE => 'Ferme Avicole',
            self::FERME_PORCINE => 'Ferme Porcine',
            self::USINE_TRANSFORMATION => 'Usine de Transformation',
            self::ENTREPOT => 'Entrepôt',
            self::BUREAU => 'Bureau Administratif',
        };
    }
}