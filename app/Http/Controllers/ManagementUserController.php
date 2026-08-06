<?php

namespace App\Http\Controllers;

use App\Http\Requests\ManagementUser\StorePermissionRequest;
use App\Http\Requests\ManagementUser\StoreRoleRequest;
use App\Http\Requests\ManagementUser\StoreUserRequest;
use App\Http\Requests\ManagementUser\UpdatePermissionRequest;
use App\Http\Requests\ManagementUser\UpdateRoleRequest;
use App\Http\Requests\ManagementUser\UpdateUserRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ManagementUserController extends Controller
{
    public function index()
    {
        return inertia()->render('ManagementUser/Index');
    }

    // ==================== USERS ====================

    public function usersAjax(Request $request)
    {
        $search = $request->search;

        $data = User::query()
            ->with('roles:id,name')
            ->when($search, function ($e, $search) {
                $e->where(function ($e) use ($search) {
                    $e->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return response()->json($data);
    }

    public function rolesOptions()
    {
        return response()->json(Role::query()->orderBy('name')->pluck('name'));
    }

    public function storeUser(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->syncRoles($request->roles ?? []);

        return redirect()->back()->with('message', 'User berhasil ditambahkan');
    }

    public function updateUser(UpdateUserRequest $request, User $user)
    {
        $user->update([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            ...($request->filled('password') ? ['password' => Hash::make($request->password)] : []),
        ]);

        $user->syncRoles($request->roles ?? []);

        return redirect()->back()->with('message', 'User berhasil diperbarui');
    }

    public function destroyUser(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->withErrors('Tidak bisa menghapus akun sendiri');
        }

        $user->delete();

        return redirect()->back()->with('message', 'User berhasil dihapus');
    }

    public function loginAsUser(Request $request, User $user)
    {
        if ($request->session()->has('impersonator_id')) {
            return redirect()->back()->withErrors('Kembali ke akun admin terlebih dahulu sebelum login sebagai user lain');
        }

        if ($user->id === Auth::id()) {
            return redirect()->back()->withErrors('Tidak bisa login sebagai akun sendiri');
        }

        $request->session()->put('impersonator_id', Auth::id());
        Auth::login($user);

        return redirect()->route('dashboard')->with('message', "Anda login sebagai {$user->name}");
    }

    // ==================== ROLE ====================

    public function rolesAjax(Request $request)
    {
        $search = $request->search;

        $data = Role::query()
            ->with('permissions:id,name')
            ->withCount('permissions')
            ->when($search, function ($e, $search) {
                $e->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return response()->json($data);
    }

    public function permissionsOptions()
    {
        return response()->json(Permission::query()->orderBy('name')->pluck('name'));
    }

    public function storeRole(StoreRoleRequest $request)
    {
        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);

        return redirect()->back()->with('message', 'Role berhasil ditambahkan');
    }

    public function updateRole(UpdateRoleRequest $request, Role $role)
    {
        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);

        return redirect()->back()->with('message', 'Role berhasil diperbarui');
    }

    public function destroyRole(Role $role)
    {
        if ($role->name === 'superadmin') {
            return redirect()->back()->withErrors('Role superadmin tidak bisa dihapus');
        }

        $role->delete();

        return redirect()->back()->with('message', 'Role berhasil dihapus');
    }

    // ==================== PERMISSION ====================

    public function permissionsAjax(Request $request)
    {
        $search = $request->search;

        $data = Permission::query()
            ->when($search, function ($e, $search) {
                $e->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return response()->json($data);
    }

    public function storePermission(StorePermissionRequest $request)
    {
        Permission::create(['name' => $request->name]);

        return redirect()->back()->with('message', 'Permission berhasil ditambahkan');
    }

    public function updatePermission(UpdatePermissionRequest $request, Permission $permission)
    {
        $permission->update(['name' => $request->name]);

        return redirect()->back()->with('message', 'Permission berhasil diperbarui');
    }

    public function destroyPermission(Permission $permission)
    {
        $permission->delete();

        return redirect()->back()->with('message', 'Permission berhasil dihapus');
    }
}
