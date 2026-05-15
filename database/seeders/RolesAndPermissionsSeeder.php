<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Vider le cache de Spatie (Crucial)
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Le dictionnaire EXACT des permissions extraites de TOUTES tes Policies
        $permissions = [
            // Logistique & Référentiels
            'view companies', 'edit companies',
            'view sites', 'create sites', 'edit sites', 'delete sites',
            'view units', 'create units', 'edit units', 'delete units',
            'view categories', 'create categories', 'edit categories', 'delete categories',
            
            // Zootechnie
            'view breeds', 'edit breeds', 'manage breeds',
            'view generations', 'create generations', 'edit generations', 'delete generations',
            'view prophylaxis', 'manage prophylaxis',
            
            // Ventes
            'view sales', 'manage sales',
            
            // Achats
            'view purchases', 'manage purchases',
        ];

        // Création des permissions en base de données
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 3. Création et assignation des Rôles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        // Le Super Admin reçoit toutes les permissions créées ci-dessus
        $superAdmin->syncPermissions(Permission::all());

        $gestionnaire = Role::firstOrCreate(['name' => 'Gestionnaire']);
        $gestionnaire->syncPermissions([
            'view companies', 'edit companies',
            'view sites', 'create sites', 'edit sites', 'delete sites',
            'view units', 'create units', 'edit units', 'delete units',
            'view categories', 'create categories', 'edit categories',
            'view breeds', 'view generations', 'view prophylaxis',
            'view sales', 'manage sales',
            'view purchases', 'manage purchases',
        ]);

        $comptable = Role::firstOrCreate(['name' => 'Comptable']);
        $comptable->syncPermissions([
            'view sales', 'manage sales',
            'view purchases', 'manage purchases',
        ]);

        $zootechnicien = Role::firstOrCreate(['name' => 'Chef Zootechnicien']);
        $zootechnicien->syncPermissions([
            'view breeds', 'edit breeds', 'manage breeds',
            'view generations', 'create generations', 'edit generations',
            'view prophylaxis', 'manage prophylaxis',
            'view categories', 'view units', 'view sites'
        ]);

        $magasinier = Role::firstOrCreate(['name' => 'Magasinier']);
        $magasinier->syncPermissions([
            'view purchases', 'manage purchases',
            'view sales',
            'view categories', 'view units'
        ]);
    }
}