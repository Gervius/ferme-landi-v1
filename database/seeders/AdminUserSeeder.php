<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            [
                'name'     => 'Administrateur',
                'email'    => 'admin@ferme.bf',
                'password' => Hash::make('password'),
            ]
        );

        $admin->assignRole('Super Admin');
    }
}
