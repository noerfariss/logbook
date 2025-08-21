<?php

namespace App\Http\Controllers;

use App\Class\ImageClass;
use App\Http\Requests\PasswordUpdateRequest;
use App\Http\Requests\ProfilePhotoUpdateRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function index()
    {
        return inertia()->render('Profile/Profile');
    }

    public function update(ProfileUpdateRequest $request)
    {
        try {
            User::find(Auth::id())->update($request->only(['name', 'email']));
            return redirect()->back()->with('message', 'Profile berhasil diperbarui');
        } catch (\Throwable $th) {
            info($th->getMessage());
            return redirect()->back()->withErrors('Terjadi kesalahan');
        }
    }

    public function updatePhoto(ProfilePhotoUpdateRequest $request)
    {
        $compress = ImageClass::generate($request->photo, 'profile');
        try {
            User::find(Auth::id())->update([
                'photo' => $compress
            ]);
            return redirect()->back()->with('message', 'Foto profil berhasil diperbarui');
        } catch (\Throwable $th) {
            info($th->getMessage());
            return redirect()->back()->withErrors('Terjadi kesalahan');
        }
    }

    public function deletePhoto(Request $request)
    {
        try {
            $user = User::find(Auth::id());

            // Hapus file lama kalau ada
            if ($user->photo && Storage::exists('/profile' . '/' . $user->photo)) {
                Storage::delete('/profile' . '/' . $user->photo);
                Storage::delete('/profile' . '/thumb_' . $user->photo);
            }

            $user->update([
                'photo' => null
            ]);

            return redirect()->back()->with('message', 'Foto profil berhasil dihapus');
        } catch (\Throwable $th) {
            info($th->getMessage());
            return redirect()->back()->withErrors('Terjadi kesalahan');
        }
    }


    public function password()
    {
        return inertia()->render('Profile/Password');
    }

    public function passwordUpdate(PasswordUpdateRequest $request)
    {
        if (! Hash::check($request->password_old, Auth::user()->password)) {
            return redirect()->back()->withErrors('Password lama salah!');
        }

        try {
            User::find(Auth::id())->update([
                'password' => Hash::make($request->password)
            ]);

            return redirect()->back()->with('message', 'Password berhasil diperbaruhi');
        } catch (\Throwable $th) {
            info($th->getMessage());
            return redirect()->back()->withErrors(__('errors.500'));
        }
    }
}
