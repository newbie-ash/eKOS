<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penghuni;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PenghuniController extends Controller
{
    public function index()
    {
        // Ambil data penghuni beserta data akun user-nya
        $penghunis = Penghuni::with('user')->latest()->get();
        
        return Inertia::render('Admin/Penghuni', [
            'penghunis' => $penghunis
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi inputan dari form
        $request->validate([
            'nomor_ktp' => 'required|string|max:16',
            'nama' => 'required|string|max:100',
            // Kita wajibkan email karena ini dipakai untuk sistem login bawaan Laravel
            'email' => 'required|email|unique:users,email', 
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'nomor_telepon' => 'required|string|max:15',
        ]);

        // 2. Buat akun User terlebih dahulu agar Anak Kos bisa login
        $user = User::create([
            'name' => $request->nama,
            'email' => $request->email,
            // Kita atur password default, misalnya: kos12345 (akan dienkripsi otomatis)
            'password' => Hash::make('kos12345'), 
            'role' => 'user', // Jadikan dia sebagai user biasa (bukan admin)
        ]);

        // 3. Simpan biodata penghuni dan sambungkan ke ID akun user yang baru dibuat
        Penghuni::create([
            'user_id' => $user->id,
            'nomor_ktp' => $request->nomor_ktp,
            'nama' => $request->nama,
            'tanggal_lahir' => $request->tanggal_lahir,
            'alamat' => $request->alamat,
            'nomor_telepon' => $request->nomor_telepon,
        ]);

        return redirect()->back()->with('message', 'Penghuni berhasil ditambahkan! Password default: kos12345');
    }

    public function destroy(Penghuni $penghuni)
    {
        // Karena di database kita setting CASCADE, maka kita cukup menghapus Akun User-nya saja.
        // Otomatis biodata penghuni, data sewa, dan tagihannya akan ikut terhapus dari database!
        $user = User::find($penghuni->user_id);
        
        if ($user) {
            $user->delete();
        }

        return redirect()->back()->with('message', 'Data Penghuni beserta Akunnya berhasil dihapus!');
    }
}