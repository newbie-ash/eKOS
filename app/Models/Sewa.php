<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sewa extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Relasi ke Penghuni
    public function penghuni()
    {
        return $this->belongsTo(Penghuni::class);
    }

    // Relasi ke Kamar
    public function kamar()
    {
        return $this->belongsTo(Kamar::class);
    }

    // Relasi ke User (Siapa admin/petugas yang memproses sewa ini)
    public function petugas()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi: Satu sewa punya banyak tagihan (tiap bulan)
    public function tagihan()
    {
        return $this->hasMany(Tagihan::class);
    }
}