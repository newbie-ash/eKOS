<?php
session_start();

//// Cek apakah user (anak kos) sudah login
if (!isset($_SESSION['user_login']) || $_SESSION['user_login'] !== true) {
    header("Location: login.php");
    exit;
}

require_once '../koneksi.php';
$current_page = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Penghuni - E-Kos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #a7f3d0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #34d399; }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-800 antialiased flex h-screen overflow-hidden relative">

    <!-- -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-slate-900/60 z-20 hidden backdrop-blur-sm transition-opacity" onclick="toggleSidebar()"></div>

    <!-- -->
    <aside id="sidebar" class="fixed md:relative inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-emerald-900 text-white flex flex-col shadow-2xl z-30">
        
        <div class="h-16 flex items-center justify-between px-6 border-b border-emerald-800 bg-emerald-950 shrink-0">
            <div class="flex items-center">
                <i class="fa-solid fa-leaf text-xl text-emerald-400 mr-3"></i>
                <span class="text-xl font-bold tracking-wider">E-KOS <span class="text-emerald-400">USER</span></span>
            </div>
            <button onclick="toggleSidebar()" class="md:hidden text-emerald-300 hover:text-white focus:outline-none">
                <i class="fa-solid fa-xmark text-2xl"></i>
            </button>
        </div>

        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <p class="px-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 mt-4">Menu Utama</p>
            
            <a href="index.php" class="flex items-center px-3 py-2.5 rounded-lg transition-colors <?php echo $current_page == 'index.php' ? 'bg-emerald-700 text-white font-medium' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'; ?>">
                <i class="fa-solid fa-house-user w-6"></i> Kamar Saya
            </a>
            
            <a href="tagihan_saya.php" class="flex items-center px-3 py-2.5 rounded-lg transition-colors <?php echo $current_page == 'tagihan_saya.php' ? 'bg-emerald-700 text-white font-medium' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'; ?>">
                <i class="fa-solid fa-receipt w-6"></i> Tagihan & Pembayaran
            </a>
        </nav>

        <div class="p-4 border-t border-emerald-800 bg-emerald-950 shrink-0">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold border-2 border-emerald-400">
                    <?php echo substr($_SESSION['nama_penghuni'], 0, 1); ?>
                </div>
                <div>
                    <p class="text-sm font-medium text-white line-clamp-1"><?php echo $_SESSION['nama_penghuni']; ?></p>
                    <p class="text-xs text-emerald-300">Penghuni Aktif</p>
                </div>
            </div>
            <a href="logout.php" onclick="return confirm('Yakin ingin keluar dari portal?');" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-100 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                <i class="fa-solid fa-arrow-right-from-bracket mr-2"></i> Keluar
            </a>
        </div>
    </aside>

    <!-- -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm shrink-0">
            <div class="flex items-center gap-3 md:gap-0">
                <button onclick="toggleSidebar()" class="md:hidden text-slate-500 hover:text-emerald-600 focus:outline-none">
                    <i class="fa-solid fa-bars text-xl"></i>
                </button>
                <h2 class="text-lg md:text-xl font-bold text-slate-800 capitalize line-clamp-1">
                    <?php 
                        $page_title = str_replace('.php', '', $current_page);
                        echo $page_title == 'index' ? 'Kamar Saya' : str_replace('_', ' ', $page_title); 
                    ?>
                </h2>
            </div>
            <div class="text-xs md:text-sm text-slate-500 font-medium whitespace-nowrap hidden sm:block">
                <i class="fa-regular fa-calendar mr-1"></i> <?php echo date('d M Y'); ?>
            </div>
        </header>

        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-6">