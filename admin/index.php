<?php
require_once 'layout/header.php';

// 1. Hitung Total Kamar
$q_kamar = mysqli_query($koneksi, "SELECT COUNT(*) as total FROM kamar");
$d_kamar = mysqli_fetch_assoc($q_kamar);
$total_kamar = $d_kamar['total'];

// 2. Hitung Kamar Kosong
$q_kosong = mysqli_query($koneksi, "SELECT COUNT(*) as kosong FROM kamar WHERE status_kamar = 'Kosong'");
$d_kosong = mysqli_fetch_assoc($q_kosong);
$kamar_kosong = $d_kosong['kosong'];

// 3. Hitung Total Penghuni Aktif (Yang sedang menyewa)
$q_penghuni = mysqli_query($koneksi, "SELECT COUNT(DISTINCT id_penghuni) as total FROM sewa");
$d_penghuni = mysqli_fetch_assoc($q_penghuni);
$total_penghuni = $d_penghuni['total'];

// 4. Hitung Tagihan Nunggak bulan ini
$bulan_ini = date('F'); // Format: January, February, etc
$tahun_ini = date('Y');
$q_nunggak = mysqli_query($koneksi, "SELECT COUNT(*) as nunggak FROM tagihan WHERE status_pembayaran = 'Belum Bayar' AND bulan_tagihan = '$bulan_ini' AND tahun_tagihan = '$tahun_ini'");
$d_nunggak = mysqli_fetch_assoc($q_nunggak);
$total_nunggak = $d_nunggak['nunggak'];
?>

<!-- Pesan Selamat Datang -->
<div class="bg-indigo-600 rounded-xl p-6 mb-6 text-white shadow-lg bg-gradient-to-r from-indigo-600 to-indigo-800">
    <h1 class="text-2xl font-bold mb-1">Halo, <?php echo $_SESSION['nama_petugas']; ?>! 👋</h1>
    <p class="text-indigo-100">Selamat datang di Panel Admin E-Kos. Berikut adalah ringkasan sistem Anda hari ini.</p>
</div>

<!-- Grid Widget Statistik -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    
    <!-- Widget 1: Total Kamar -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center transition-transform hover:-translate-y-1 duration-300">
        <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl mr-4">
            <i class="fa-solid fa-door-closed"></i>
        </div>
        <div>
            <p class="text-sm text-slate-500 font-medium">Total Kamar</p>
            <h3 class="text-2xl font-bold text-slate-800"><?php echo $total_kamar; ?></h3>
        </div>
    </div>

    <!-- Widget 2: Kamar Kosong -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center transition-transform hover:-translate-y-1 duration-300">
        <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mr-4">
            <i class="fa-solid fa-bed"></i>
        </div>
        <div>
            <p class="text-sm text-slate-500 font-medium">Kamar Kosong</p>
            <h3 class="text-2xl font-bold text-slate-800"><?php echo $kamar_kosong; ?></h3>
        </div>
    </div>

    <!-- Widget 3: Total Penghuni -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center transition-transform hover:-translate-y-1 duration-300">
        <div class="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl mr-4">
            <i class="fa-solid fa-users"></i>
        </div>
        <div>
            <p class="text-sm text-slate-500 font-medium">Penghuni Aktif</p>
            <h3 class="text-2xl font-bold text-slate-800"><?php echo $total_penghuni; ?></h3>
        </div>
    </div>

    <!-- Widget 4: Nunggak Bulan Ini -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center transition-transform hover:-translate-y-1 duration-300">
        <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mr-4">
            <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
            <p class="text-sm text-slate-500 font-medium">Nunggak (<?php echo $bulan_ini; ?>)</p>
            <h3 class="text-2xl font-bold text-rose-600"><?php echo $total_nunggak; ?></h3>
        </div>
    </div>
</div>

<!-- Informasi Tambahan / Petunjuk Cepat -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <h3 class="text-lg font-bold text-slate-800 border-b pb-3 mb-4">Aksi Cepat</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="penghuni.php" class="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
            <i class="fa-solid fa-user-plus text-2xl mb-2"></i>
            <span class="font-medium">Tambah Penghuni Baru</span>
        </a>
        <a href="sewa.php" class="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
            <i class="fa-solid fa-key text-2xl mb-2"></i>
            <span class="font-medium">Input Sewa Kamar</span>
        </a>
        <a href="tagihan.php" class="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
            <i class="fa-solid fa-receipt text-2xl mb-2"></i>
            <span class="font-medium">Buat Tagihan Baru</span>
        </a>
    </div>
</div>

<?php
require_once 'layout/footer.php';
?>