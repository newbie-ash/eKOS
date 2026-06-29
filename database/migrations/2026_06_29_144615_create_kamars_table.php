<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kamars', function (Blueprint $table) {
            $table->id(); // Pengganti id_kamar VARCHAR(10)
            $table->string('nomor_kamar', 10);
            $table->string('tipe_kamar', 50);
            $table->integer('harga_per_bulan');
            $table->string('status_kamar', 20)->default('Kosong');
            $table->timestamps(); // Pengganti created_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kamars');
    }
};