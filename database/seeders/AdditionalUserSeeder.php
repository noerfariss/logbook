<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdditionalUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $andi = User::create([
            'name' => 'andi',
            'username' => 'andi',
            'email' => 'andi@biginovasiglobal.com',
            'password' => Hash::make('password')
        ]);

        // $andi->syncRoles('superadmin');

        $fitri = User::create([
            'name' => 'fitri',
            'username' => 'fitri',
            'email' => 'fitri@biginovasiglobal.com',
            'password' => Hash::make('password')
        ]);

        // $fitri->syncRoles('superadmin');

        $gilbert = User::create([
            'name' => 'gilbert',
            'username' => 'gilbert',
            'email' => 'gilbert@biginovasiglobal.com',
            'password' => Hash::make('password')
        ]);

        // $gilbert->syncRoles('superadmin');

        $ernest = User::create([
            'name' => 'ernest',
            'username' => 'ernest',
            'email' => 'ernest@biginovasiglobal.com',
            'password' => Hash::make('password')
        ]);

        // $ernest->syncRoles('superadmin');
    }
}
