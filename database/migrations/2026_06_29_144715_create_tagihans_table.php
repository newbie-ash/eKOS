<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tagihans', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke data sewa
            $table->foreignId('sewa_id')->constrained()->cascadeOnDelete();
            
            $table->string('bulan_tagihan', 20);
            $table->string('tahun_tagihan', 4);
            $table->integer('jumlah_tagihan');
            $table->string('status_pembayaran', 30)->default('Belum Bayar');
            $table->date('tanggal_pembayaran')->nullable();
            $table->string('bukti_bayar')->nullable(); // Untuk path foto struk
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tagihans');
    }
};