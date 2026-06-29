<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migration (Menambah kolom).
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Kita tambah kolom string 'role' untuk membedakan admin dan penghuni
            $table->string('role')->default('user'); 
        });
    }

    /**
     * Batalkan migration (Menghapus kolom jika di-rollback).
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};