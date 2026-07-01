<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Définition des permissions par module (issues des policies et de la sidebar)
        $permissions = [
            // Administration
            'view companies', 'edit companies',
            'view sites', 'create sites', 'edit sites', 'delete sites',
            'view units', 'create units', 'edit units', 'delete units',
            'view categories', 'create categories', 'edit categories', 'delete categories',
            'view items', 'create items', 'edit items', 'delete items',

            // Zootechnie
            'view species', 'manage species',
            'view breeds', 'manage breeds',
            'view breed_standards', 'manage breed_standards',
            'view generations', 'create generations', 'edit generations', 'delete generations',
            'view daily_productions', 'create daily_productions', 'edit daily_productions', 'delete daily_productions',
            'view feed_consumptions', 'create feed_consumptions', 'edit feed_consumptions', 'delete feed_consumptions',
            'view flock_mortalities', 'create flock_mortalities', 'edit flock_mortalities', 'delete flock_mortalities',
            'view flock_cullings', 'create flock_cullings', 'edit flock_cullings', 'delete flock_cullings',
            'view flock_weighings', 'create flock_weighings', 'edit flock_weighings', 'delete flock_weighings',
            'view health_treatments', 'create health_treatments', 'edit health_treatments', 'delete health_treatments',
            'view scheduled_treatments', 'manage scheduled_treatments',

            // Prophylaxie
            'view prophylaxis', 'manage prophylaxis',

            // Ventes
            'view sales', 'manage sales',

            // Achats
            'view purchases', 'manage purchases',

            // RH
            'manage hr',

            // Stocks
            'manage stocks',

            // Comptabilité
            'manage accounting',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }
    }
}