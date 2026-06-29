<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KamarController extends Controller
{
    /**
     * Menampilkan daftar kamar (Pengganti SELECT * FROM kamar)
     */
    public function index()
    {
        // Ambil semua data kamar dari database, urutkan dari yang terbaru
        $kamars = Kamar::latest()->get();
        
        // Kirim data ke tampilan React (Fase 4 nanti)
        return Inertia::render('Admin/Kamar', [
            'kamars' => $kamars
        ]);
    }

    /**
     * Menyimpan data kamar baru (Pengganti INSERT INTO kamar)
     */
    public function store(Request $request)
    {
        // Validasi: Pastikan admin tidak mengosongkan form
        $request->validate([
            'nomor_kamar' => 'required|string|max:10',
            'tipe_kamar' => 'required|string|max:50',
            'harga_per_bulan' => 'required|integer',
            'status_kamar' => 'required|string|max:20',
        ]);

        // Simpan ke database secara otomatis dengan Eloquent ORM
        Kamar::create($request->all());

        // Kembalikan halaman dengan pesan sukses
        return redirect()->back()->with('message', 'Kamar berhasil ditambahkan!');
    }

    /**
     * Mengubah data kamar (Pengganti UPDATE kamar SET ...)
     */
    public function update(Request $request, Kamar $kamar)
    {
        // Validasi inputan
        $request->validate([
            'nomor_kamar' => 'required|string|max:10',
            'tipe_kamar' => 'required|string|max:50',
            'harga_per_bulan' => 'required|integer',
            'status_kamar' => 'required|string|max:20',
        ]);

        // Update data yang dipilih
        $kamar->update($request->all());

        return redirect()->back()->with('message', 'Data Kamar berhasil diperbarui!');
    }

    /**
     * Menghapus data kamar (Pengganti DELETE FROM kamar)
     */
    public function destroy(Kamar $kamar)
    {
        // Hapus data dari database
        $kamar->delete();

        return redirect()->back()->with('message', 'Kamar berhasil dihapus!');
    }
}