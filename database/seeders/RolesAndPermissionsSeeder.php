<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $domains = [
            // Domain 1: Logistics
            'companies', 'sites', 'units', 'categories',
            // Domain 2: Zootechnie
            'species', 'breeds', 'generations',
            // Domain 3: Health
            'diseases', 'medications', 'treatment_plans', 'treatment_records',
            // Domain 4: Finance
            'accounts', 'transactions', 'invoices', 'payments',
        ];

        $actions = ['view', 'create', 'edit', 'delete'];

        foreach ($domains as $domain) {
            foreach ($actions as $action) {
                Permission::findOrCreate("{$action} {$domain}");
            }
        }

        // Example Roles
        $admin = Role::findOrCreate('admin');
        $admin->givePermissionTo(Permission::all());

        $manager = Role::findOrCreate('manager');
        $manager->givePermissionTo([
            'view companies', 'edit companies',
            'view sites', 'view units', 'view categories',
            'view generations', 'create generations', 'edit generations',
        ]);
    }
}
