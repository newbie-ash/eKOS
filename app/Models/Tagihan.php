<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tagihan extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Relasi: Tagihan ini untuk data sewa yang mana
    public function sewa()
    {
        return $this->belongsTo(Sewa::class);
    }
}