<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sewas', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke anak kos dan kamar
            $table->foreignId('penghuni_id')->constrained()->cascadeOnDelete();
            $table->foreignId('kamar_id')->constrained()->cascadeOnDelete();
            
            // Relasi ke admin/petugas (menggunakan tabel users)
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            $table->date('tanggal_masuk');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sewas');
    }
};