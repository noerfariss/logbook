<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = User::create([
            'name' => 'superadmin',
            'username' => 'superadmin',
            'email' => 'support@biginovasiglobal.com',
            'password' => Hash::make('password')
        ]);

        $superadmin->syncRoles('superadmin');
    }
}
