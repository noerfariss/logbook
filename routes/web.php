<?php

use App\Http\Controllers\AjaxController;
use App\Http\Controllers\AktaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KkController;
use App\Http\Controllers\KtpController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuratController;
use Illuminate\Support\Facades\Route;


require __DIR__ . '/auth.php';

Route::prefix('auth')->middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('pengajuan')->name('pengajuan.')->group(function () {
        Route::get('/ajax', [DashboardController::class, 'pengajuan'])->name('ajax');
        Route::post('/updatelogs', [DashboardController::class, 'updateLog'])->name('updatelogs');
    });

    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/photo', [ProfileController::class, 'updatePhoto'])->name('profile.update.photo');
    Route::delete('/photo', [ProfileController::class, 'deletePhoto'])->name('profile.delete.photo');

    Route::get('/password', [ProfileController::class, 'password'])->name('password');
    Route::post('/password', [ProfileController::class, 'passwordUpdate'])->name('password.update');

    Route::get('/log', [LogController::class, 'index'])->name('log');
    Route::get('/log-ajax', [LogController::class, 'ajax'])->name('log.ajax');
});
