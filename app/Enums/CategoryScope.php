<?php

namespace App\Enums;

enum CategoryScope: string
{
    case FEED = 'feed';
    case ANIMAL = 'animal';
    case MEDICATION = 'medication';
    case PRODUCT = 'product';
    case EQUIPMENT = 'equipment';
}
