<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/Login');
    }

    public function login(LoginRequest $request)
    {
        if (! Auth::attempt($request->only(['username', 'password']), true)) {
            return redirect()->back()->withErrors('Username atau password salah');
        }

        return redirect()->route('dashboard');
    }

    public function logout()
    {
        Auth::logout();

        return redirect()->route('login')->with('message', 'Logout berhasil');
    }

    public function returnToAdmin(Request $request)
    {
        $adminId = $request->session()->get('impersonator_id');

        if (! $adminId) {
            return redirect()->route('dashboard');
        }

        $admin = User::find($adminId);
        $request->session()->forget('impersonator_id');

        if (! $admin) {
            Auth::logout();

            return redirect()->route('login')->with('message', 'Akun admin tidak ditemukan, silakan login ulang');
        }

        Auth::login($admin);

        return redirect()->route('management-user.index')->with('message', 'Kembali ke akun admin');
    }
}
