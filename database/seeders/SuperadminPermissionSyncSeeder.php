<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

/**
 * Idempotent: aman dijalankan berulang kali di server live.
 * - Hanya menambah permission yang belum ada (tidak menghapus / mengubah yang lama).
 * - Hanya menambahkan permission ke role superadmin (tidak menghapus yang sudah terpasang).
 * - Tidak menyentuh role, user, atau tabel lain.
 *
 * Jalankan: php artisan db:seed --class=SuperadminPermissionSyncSeeder
 */
class SuperadminPermissionSyncSeeder extends Seeder
{
    public function run(): void
    {
        $names = [];

        foreach (['settings', 'role', 'permission', 'user'] as $module) {
            foreach (['create', 'read', 'update', 'delete', 'print'] as $action) {
                $names[] = "$module-$action";
            }
        }

        $names = array_merge($names, [
            'profile-read',
            'profile-update',
            'password-read',
            'password-update',
            'activitylog-read',
            'dashboard-read',
            'vendor-list-read',
            'vendor-list-update',
        ]);

        $permissions = [];
        foreach ($names as $name) {
            $permissions[] = Permission::firstOrCreate(['name' => $name]);
        }

        $superadmin = Role::where('name', 'superadmin')->first();

        if (! $superadmin) {
            $this->command?->warn('Role "superadmin" tidak ditemukan, permission dibuat tapi belum dipasang ke role.');
        } else {
            // givePermissionTo = additive, tidak melepas permission yang sudah ada.
            $superadmin->givePermissionTo($permissions);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
