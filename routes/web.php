<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\KamarController;

// ... existing code ...
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    // Route khusus Anak Kos (User Biasa)
    Route::get('/tagihan-saya', [\App\Http\Controllers\User\TagihanSayaController::class, 'index'])->name('tagihan-saya.index');
});

// Route Khusus ADMIN (Dilindungi middleware 'admin' yang baru kita buat)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // CRUD untuk Kamar
    Route::get('/kamar', [\App\Http\Controllers\Admin\KamarController::class, 'index'])->name('kamar.index');
    Route::post('/kamar', [\App\Http\Controllers\Admin\KamarController::class, 'store'])->name('kamar.store');
    Route::put('/kamar/{kamar}', [\App\Http\Controllers\Admin\KamarController::class, 'update'])->name('kamar.update');
    Route::delete('/kamar/{kamar}', [\App\Http\Controllers\Admin\KamarController::class, 'destroy'])->name('kamar.destroy');
    
    // CRUD untuk Penghuni
    Route::get('/penghuni', [\App\Http\Controllers\Admin\PenghuniController::class, 'index'])->name('penghuni.index');
    Route::post('/penghuni', [\App\Http\Controllers\Admin\PenghuniController::class, 'store'])->name('penghuni.store');
    Route::delete('/penghuni/{penghuni}', [\App\Http\Controllers\Admin\PenghuniController::class, 'destroy'])->name('penghuni.destroy');

    // CRUD untuk Sewa
    Route::get('/sewa', [\App\Http\Controllers\Admin\SewaController::class, 'index'])->name('sewa.index');
    Route::post('/sewa', [\App\Http\Controllers\Admin\SewaController::class, 'store'])->name('sewa.store');
    Route::delete('/sewa/{sewa}', [\App\Http\Controllers\Admin\SewaController::class, 'destroy'])->name('sewa.destroy');

    // CRUD untuk Tagihan
    Route::get('/tagihan', [\App\Http\Controllers\Admin\TagihanController::class, 'index'])->name('tagihan.index');
    Route::post('/tagihan', [\App\Http\Controllers\Admin\TagihanController::class, 'store'])->name('tagihan.store');
    Route::put('/tagihan/{tagihan}', [\App\Http\Controllers\Admin\TagihanController::class, 'update'])->name('tagihan.update');
    Route::delete('/tagihan/{tagihan}', [\App\Http\Controllers\Admin\TagihanController::class, 'destroy'])->name('tagihan.destroy');
});

require __DIR__.'/settings.php';
// ... existing code ...