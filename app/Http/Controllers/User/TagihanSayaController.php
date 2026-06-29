<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use App\Models\Penghuni;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TagihanSayaController extends Controller
{
    public function index()
    {
        // 1. Ketahui siapa user yang sedang login
        $user = Auth::user();
        
        // 2. Cari data 'penghuni' miliknya berdasarkan user_id
        $penghuni = Penghuni::where('user_id', $user->id)->first();

        // 3. Cari semua tagihan yang terhubung dengan id sewa milik penghuni ini
        $tagihans = collect(); // Kumpulan kosong (jaga-jaga kalau dia belum nyewa kamar)
        
        if ($penghuni) {
            $tagihans = Tagihan::whereHas('sewa', function($query) use ($penghuni) {
                $query->where('penghuni_id', $penghuni->id);
            })->with('sewa.kamar')->latest()->get();
        }

        return Inertia::render('User/TagihanSaya', [
            'tagihans' => $tagihans
        ]);
    }
}