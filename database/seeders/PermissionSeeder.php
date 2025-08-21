<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'settings-create']);
        Permission::create(['name' => 'settings-read']);
        Permission::create(['name' => 'settings-update']);
        Permission::create(['name' => 'settings-delete']);
        Permission::create(['name' => 'settings-print']);

        Permission::create(['name' => 'role-create']);
        Permission::create(['name' => 'role-read']);
        Permission::create(['name' => 'role-update']);
        Permission::create(['name' => 'role-delete']);
        Permission::create(['name' => 'role-print']);

        Permission::create(['name' => 'permission-create']);
        Permission::create(['name' => 'permission-read']);
        Permission::create(['name' => 'permission-update']);
        Permission::create(['name' => 'permission-delete']);
        Permission::create(['name' => 'permission-print']);

        Permission::create(['name' => 'profile-read']);
        Permission::create(['name' => 'profile-update']);
        Permission::create(['name' => 'password-read']);
        Permission::create(['name' => 'password-update']);

        Permission::create(['name' => 'user-create']);
        Permission::create(['name' => 'user-read']);
        Permission::create(['name' => 'user-update']);
        Permission::create(['name' => 'user-delete']);
        Permission::create(['name' => 'user-print']);

        Permission::create(['name' => 'activitylog-read']);
        Permission::create(['name' => 'dashboard-read']);
    }
}
