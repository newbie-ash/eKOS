<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sewa;
use App\Models\Kamar;
use App\Models\Penghuni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SewaController extends Controller
{
    public function index()
    {
        // Ambil riwayat sewa lengkap dengan nama penghuni, nomor kamar, dan petugasnya
        $sewas = Sewa::with(['penghuni', 'kamar', 'petugas'])->latest()->get();
        
        // Ambil daftar kamar yang statusnya masih 'Kosong' saja untuk dipilih di form
        $kamars = Kamar::where('status_kamar', 'Kosong')->get();
        
        // Ambil daftar semua penghuni
        $penghunis = Penghuni::all();
        
        return Inertia::render('Admin/Sewa', [
            'sewas' => $sewas,
            'kamars' => $kamars,
            'penghunis' => $penghunis
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'penghuni_id' => 'required|exists:penghunis,id',
            'kamar_id' => 'required|exists:kamars,id',
            'tanggal_masuk' => 'required|date',
        ]);

        // Catat data sewa
        Sewa::create([
            'penghuni_id' => $request->penghuni_id,
            'kamar_id' => $request->kamar_id,
            'user_id' => Auth::id(), // Petugas/Admin yang sedang login
            'tanggal_masuk' => $request->tanggal_masuk,
        ]);

        // Otomatis ubah status kamar menjadi 'Terisi'
        Kamar::find($request->kamar_id)->update(['status_kamar' => 'Terisi']);

        return redirect()->back()->with('message', 'Penempatan kamar berhasil diproses!');
    }

    public function destroy(Sewa $sewa)
    {
        // Otomatis kembalikan status kamar menjadi 'Kosong' sebelum datanya dihapus
        Kamar::find($sewa->kamar_id)->update(['status_kamar' => 'Kosong']);
        
        $sewa->delete();

        return redirect()->back()->with('message', 'Data Sewa berhasil diakhiri! Kamar kembali kosong.');
    }
}