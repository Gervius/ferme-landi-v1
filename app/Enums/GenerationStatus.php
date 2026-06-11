<?php

namespace App\Enums;

enum GenerationStatus: string
{
    case ACTIF = 'actif';
    case CLOTURE = 'cloture';
}