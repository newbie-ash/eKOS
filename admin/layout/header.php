<?php
session_start();

// Cek apakah admin sudah login, kalau belum tendang ke halaman login!
if (!isset($_SESSION['admin_login']) || $_SESSION['admin_login'] !== true) {
    header("Location: login.php");
    exit;
}

// Panggil database (karena file ini akan dipakai di semua halaman admin)
require_once '../koneksi.php';

// Ambil nama file yang sedang dibuka untuk efek menu aktif
$current_page = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - E-Kos</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome untuk Ikon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Custom scrollbar untuk sidebar biar estetik */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-800 antialiased flex h-screen overflow-hidden relative">

    <!-- Overlay Gelap (Hanya muncul di HP saat menu dibuka) -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-slate-900/60 z-20 hidden backdrop-blur-sm transition-opacity" onclick="toggleSidebar()"></div>

    <!-- Sidebar Kiri -->
    <aside id="sidebar" class="fixed md:relative inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-indigo-900 text-white flex flex-col shadow-2xl z-30">
        <!-- Logo / Brand -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-indigo-800 bg-indigo-950 shrink-0">
            <div class="flex items-center">
                <i class="fa-solid fa-house-chimney text-xl text-indigo-400 mr-3"></i>
                <span class="text-xl font-bold tracking-wider">E-KOS <span class="text-indigo-400">ADMIN</span></span>
            </div>
            <!-- Tombol Tutup Silang (Hanya di HP) -->
            <button onclick="toggleSidebar()" class="md:hidden text-indigo-300 hover:text-white focus:outline-none">
                <i class="fa-solid fa-xmark text-2xl"></i>
            </button>
        </div>

        <!-- Menu Navigasi -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <p class="px-3 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 mt-4">Menu Utama</p>
            
            <a href="index.php" class="flex items-center px-3 py-2.5 rounded-lg transition-colors <?php echo $current_page == 'index.php' ? 'bg-indigo-700 text-white font-medium' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'; ?>">
                <i class="fa-solid fa-chart-pie w-6"></i> Dashboard
            </a>
            
            <a href="kamar.php" class="flex items-center px-3 py-2.5 rounded-lg transition-colors <?php echo $current_page == 'kamar.php' ? 'bg-indigo-700 text-white font-medium' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'; ?>">
                <i class="fa-solid fa-door-open w-6"></i> Data Kamar
            </a>
            
            <a href="penghuni.php" class="flex items-center px-3 py-2.5 rounded-lg transition-colors <?php echo $current_page == 'penghuni.php' ? 'bg-indigo-700 text-white font-medium' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'; ?>">
                <i class="fa-solid fa-users w-6"></i> Data Penghuni
            </a>
            
            <a href="sewa.php" class="flex items-center px-3 py-2.5 rounded-lg transition-colors <?php echo $current_page == 'sewa.php' ? 'bg-indigo-700 text-white font-medium' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'; ?>">
                <i class="fa-solid fa-bed w-6"></i> Pencatatan Sewa
            </a>

            <p class="px-3 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 mt-6">Keuangan</p>
            
            <a href="tagihan.php" class="flex items-center px-3 py-2.5 rounded-lg transition-colors <?php echo $current_page == 'tagihan.php' ? 'bg-indigo-700 text-white font-medium' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'; ?>">
                <i class="fa-solid fa-file-invoice-dollar w-6"></i> Kelola Tagihan
            </a>
            
            <a href="laporan.php" class="flex items-center px-3 py-2.5 rounded-lg transition-colors <?php echo $current_page == 'laporan.php' ? 'bg-indigo-700 text-white font-medium' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'; ?>">
                <i class="fa-solid fa-print w-6"></i> Laporan
            </a>
        </nav>

        <!-- User Info & Logout -->
        <div class="p-4 border-t border-indigo-800 bg-indigo-950 shrink-0">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-indigo-400">
                    <?php echo substr($_SESSION['nama_petugas'], 0, 1); ?>
                </div>
                <div>
                    <p class="text-sm font-medium text-white line-clamp-1"><?php echo $_SESSION['nama_petugas']; ?></p>
                    <p class="text-xs text-indigo-300">Administrator</p>
                </div>
            </div>
            <a href="logout.php" onclick="return confirm('Yakin ingin keluar?');" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-100 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                <i class="fa-solid fa-arrow-right-from-bracket mr-2"></i> Keluar
            </a>
        </div>
    </aside>

    <!-- Konten Utama Kanan -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <!-- Topbar (Mobile menu button & Page Title) -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm shrink-0">
            <div class="flex items-center gap-3 md:gap-0">
                <!-- Tombol Hamburger Menu (Muncul di HP) -->
                <button onclick="toggleSidebar()" class="md:hidden text-slate-500 hover:text-indigo-600 focus:outline-none">
                    <i class="fa-solid fa-bars text-xl"></i>
                </button>
                <h2 class="text-lg md:text-xl font-bold text-slate-800 capitalize line-clamp-1">
                    <?php 
                        $page_title = str_replace('.php', '', $current_page);
                        echo $page_title == 'index' ? 'Dashboard' : str_replace('_', ' ', $page_title); 
                    ?>
                </h2>
            </div>
            <div class="text-xs md:text-sm text-slate-500 font-medium whitespace-nowrap hidden sm:block">
                <i class="fa-regular fa-calendar mr-1"></i> <?php echo date('d M Y'); ?>
            </div>
        </header>

        <!-- Area Scroll Konten -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-6">
            <!-- ISI HALAMAN AKAN MUNCUL DI SINI -->