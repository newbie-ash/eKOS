<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kamar extends Model
{
    use HasFactory;

    // Mengizinkan semua kolom diisi, kecuali 'id' yang otomatis
    protected $guarded = ['id'];

    // Relasi: Satu kamar bisa memiliki banyak riwayat sewa
    public function sewa()
    {
        return $this->hasMany(Sewa::class);
    }
}