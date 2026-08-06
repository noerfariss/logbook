<?php

use App\Http\Controllers\AjaxController;
use App\Http\Controllers\AktaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KkController;
use App\Http\Controllers\KtpController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ManagementUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuratController;
use Illuminate\Support\Facades\Route;


require __DIR__ . '/auth.php';

Route::prefix('auth')->middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('pengajuan')->name('pengajuan.')->group(function () {
        Route::get('/ajax', [DashboardController::class, 'pengajuan'])->name('ajax');
        Route::get('/getlogs', [DashboardController::class, 'getLogs'])->name('getlogs');
        Route::post('/updatelogs', [DashboardController::class, 'updateLog'])->name('updatelogs');
        Route::post('/updatedeadline', [DashboardController::class, 'updatedeadline'])->name('updatedeadline');
        Route::post('/updateppn', [DashboardController::class, 'updateppn'])->name('updateppn');
        Route::post('/updatefaktur', [DashboardController::class, 'updatefaktur'])->name('updatefaktur');
    });

    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/photo', [ProfileController::class, 'updatePhoto'])->name('profile.update.photo');
    Route::delete('/photo', [ProfileController::class, 'deletePhoto'])->name('profile.delete.photo');

    Route::get('/password', [ProfileController::class, 'password'])->name('password');
    Route::post('/password', [ProfileController::class, 'passwordUpdate'])->name('password.update');

    Route::get('/log', [LogController::class, 'index'])->name('log');
    Route::get('/log-ajax', [LogController::class, 'ajax'])->name('log.ajax');

    Route::get('/return-to-admin', [AuthController::class, 'returnToAdmin'])->name('return-to-admin');

    Route::prefix('management-user')->name('management-user.')->group(function () {
        Route::get('/', [ManagementUserController::class, 'index'])
            ->name('index')->middleware('permission:user-read|role-read|permission-read');

        Route::middleware('permission:user-read')->get('/users', [ManagementUserController::class, 'usersAjax'])->name('users.ajax');
        Route::middleware('permission:role-read')->get('/roles-options', [ManagementUserController::class, 'rolesOptions'])->name('roles.options');
        Route::middleware('permission:user-create')->post('/users', [ManagementUserController::class, 'storeUser'])->name('users.store');
        Route::middleware('permission:user-update')->put('/users/{user}', [ManagementUserController::class, 'updateUser'])->name('users.update');
        Route::middleware('permission:user-delete')->delete('/users/{user}', [ManagementUserController::class, 'destroyUser'])->name('users.destroy');
        Route::middleware('permission:user-update')->post('/users/{user}/login-as', [ManagementUserController::class, 'loginAsUser'])->name('users.login-as');

        Route::middleware('permission:role-read')->get('/roles', [ManagementUserController::class, 'rolesAjax'])->name('roles.ajax');
        Route::middleware('permission:permission-read')->get('/permissions-options', [ManagementUserController::class, 'permissionsOptions'])->name('permissions.options');
        Route::middleware('permission:role-create')->post('/roles', [ManagementUserController::class, 'storeRole'])->name('roles.store');
        Route::middleware('permission:role-update')->put('/roles/{role}', [ManagementUserController::class, 'updateRole'])->name('roles.update');
        Route::middleware('permission:role-delete')->delete('/roles/{role}', [ManagementUserController::class, 'destroyRole'])->name('roles.destroy');

        Route::middleware('permission:permission-read')->get('/permissions', [ManagementUserController::class, 'permissionsAjax'])->name('permissions.ajax');
        Route::middleware('permission:permission-create')->post('/permissions', [ManagementUserController::class, 'storePermission'])->name('permissions.store');
        Route::middleware('permission:permission-update')->put('/permissions/{permission}', [ManagementUserController::class, 'updatePermission'])->name('permissions.update');
        Route::middleware('permission:permission-delete')->delete('/permissions/{permission}', [ManagementUserController::class, 'destroyPermission'])->name('permissions.destroy');
    });
});
