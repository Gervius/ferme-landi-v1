<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password'); // Mot de passe universel pour les tests

        $users = [
            ['name' => 'Administrateur', 'email' => 'admin@ferme.bf', 'role' => 'Super Admin'],
            ['name' => 'Oumar (Gestionnaire)', 'email' => 'oumar@ferme.bf', 'role' => 'Gestionnaire'],
            ['name' => 'Awa (Comptable)', 'email' => 'awa@ferme.bf', 'role' => 'Comptable'],
            ['name' => 'Drissa (Zootechnicien)', 'email' => 'drissa@ferme.bf', 'role' => 'Chef Zootechnicien'],
            ['name' => 'Salif (Magasinier)', 'email' => 'salif@ferme.bf', 'role' => 'Magasinier'],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                ['name' => $userData['name'], 'password' => $password]
            );
            // On s'assure qu'il a le bon rôle
            if (!$user->hasRole($userData['role'])) {
                $user->assignRole($userData['role']);
            }
        }
    }
}