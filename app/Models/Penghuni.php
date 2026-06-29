<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penghuni extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Relasi: Data penghuni ini milik salah satu akun user (Anak Kos)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Satu penghuni bisa menyewa berkali-kali (perpanjang/pindah)
    public function sewa()
    {
        return $this->hasMany(Sewa::class);
    }
}