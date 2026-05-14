<?php

namespace App\Enums;

enum CategoryScope: string
{
    case SALES = 'sales';
    case PURCHASES = 'purchases';
    case INVENTORY = 'inventory';
    case MEDICATION = 'medication';
}
