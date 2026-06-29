<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penghunis', function (Blueprint $table) {
            $table->id(); // Pengganti id_penghuni VARCHAR(10)
            
            // Relasi ke tabel users bawaan Laravel (sebagai pengganti username/password di sini)
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            $table->string('nomor_ktp', 16);
            $table->string('nama', 100);
            $table->date('tanggal_lahir');
            $table->text('alamat');
            $table->string('nomor_telepon', 15);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penghunis');
    }
};