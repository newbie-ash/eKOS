<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use App\Models\Sewa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagihanController extends Controller
{
    public function index()
    {
        // Ambil tagihan beserta relasinya (kamar dan penghuninya)
        $tagihans = Tagihan::with(['sewa.penghuni', 'sewa.kamar'])->latest()->get();
        
        // Data sewa aktif untuk form pembuatan tagihan baru
        $sewas = Sewa::with(['penghuni', 'kamar'])->get();

        return Inertia::render('Admin/Tagihan', [
            'tagihans' => $tagihans,
            'sewas' => $sewas
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sewa_id' => 'required|exists:sewas,id',
            'bulan_tagihan' => 'required|string',
            'tahun_tagihan' => 'required|string',
            'jumlah_tagihan' => 'required|integer',
        ]);

        Tagihan::create($request->all());

        return redirect()->back()->with('message', 'Tagihan bulanan berhasil dibuat!');
    }

    public function update(Request $request, Tagihan $tagihan)
    {
        $request->validate([
            'status_pembayaran' => 'required|string',
        ]);

        $tagihan->update(['status_pembayaran' => $request->status_pembayaran]);

        return redirect()->back()->with('message', 'Status pembayaran berhasil diperbarui!');
    }

    public function destroy(Tagihan $tagihan)
    {
        $tagihan->delete();
        return redirect()->back()->with('message', 'Tagihan berhasil dihapus!');
    }
}