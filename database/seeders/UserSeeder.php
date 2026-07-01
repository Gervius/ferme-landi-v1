<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@ferme.com',
                'password' => 'password',
                'role' => 'Super Admin',
            ],
            [
                'name' => 'Gestionnaire',
                'email' => 'gestionnaire@ferme.com',
                'password' => 'password',
                'role' => 'gestionnaire',
            ],
            [
                'name' => 'Secrétaire',
                'email' => 'secretaire@ferme.com',
                'password' => 'password',
                'role' => 'secretaire',
            ],
            [
                'name' => 'Manager',
                'email' => 'manager@ferme.com',
                'password' => 'password',
                'role' => 'manager',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                ]
            );
            // Assigner le rôle
            $role = Role::where('name', $userData['role'])->first();
            if ($role) {
                $user->assignRole($role);
            }
        }
    }
}