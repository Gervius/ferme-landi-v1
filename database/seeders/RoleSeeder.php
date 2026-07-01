<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Création des rôles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $gestionnaire = Role::firstOrCreate(['name' => 'gestionnaire', 'guard_name' => 'web']);
        $secretaire = Role::firstOrCreate(['name' => 'secretaire', 'guard_name' => 'web']);
        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);

        // Récupération des permissions
        $allPermissions = Permission::all();

        // Super Admin : toutes les permissions
        $superAdmin->syncPermissions($allPermissions);

        // Gestionnaire : toutes sauf éventuellement les "delete" sur les configurations critiques (mais on donne tout)
        $gestionnaire->syncPermissions($allPermissions);

        // Secrétaire : accès en lecture et création/modification sur les modules opérationnels, pas de suppression, pas de comptabilité ni configuration
        $excluded = [
            'delete companies', 'edit companies', 'view companies',
            'delete sites', 'create sites', 'edit sites',
            'delete units', 'create units', 'edit units',
            'delete categories', 'create categories', 'edit categories',
            'delete items', 'create items', 'edit items',
            'manage species', 'manage breeds', 'manage breed_standards',
            'manage prophylaxis',
            'manage accounting',
            'manage hr', // on restreint pour la secrétaire
        ];
        $secretairePerms = Permission::whereNotIn('name', $excluded)->get();
        $secretaire->syncPermissions($secretairePerms);

        // Manager : accès complet en lecture, peut modifier/valider (edit) mais pas créer ni supprimer
        $managerPerms = Permission::where(function ($query) {
            $query->where('name', 'like', 'view%')
                  ->orWhere('name', 'like', 'edit%')
                  ->orWhere('name', 'like', 'manage%'); // certains "manage" sont des autorisations globales
        })->get();
        // On retire les permissions de création/suppression explicites
        $managerPerms = $managerPerms->filter(function ($perm) {
            return !str_contains($perm->name, 'create') && !str_contains($perm->name, 'delete');
        });
        $manager->syncPermissions($managerPerms);
    }
}