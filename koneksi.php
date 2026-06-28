<?php
// Pengaturan konfigurasi database (Cocok untuk Laragon/XAMPP bawaan)
$host       = "localhost";
$username   = "root";       // Secara default username database lokal adalah 'root'
$password   = "";           // Secara default password kosong
$database   = "db_kos";     // Nama database sesuai dengan file SQL yang sudah kita buat

// Melakukan koneksi ke database menggunakan ekstensi MySQLi
$koneksi = mysqli_connect($host, $username, $password, $database);

// Menangkap error jika koneksi gagal (Error Handling)
if (!$koneksi) {
    // Fungsi die() akan menghentikan eksekusi PHP dan menampilkan pesan error
    die("Koneksi ke database gagal, Cek kembali Laragon-nya: " . mysqli_connect_error());
}

// Catatan Penting: Jangan pernah menaruh echo "Koneksi Berhasil" di file ini,
// karena bisa merusak fungsi header() saat proses login atau pindah halaman!
?>