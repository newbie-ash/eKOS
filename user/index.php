<?php
require_once 'layout/header.php';

$id_penghuni = $_SESSION['id_penghuni'];

// Ini kodingan yang benar, query-nya sudah aktif
$q_sewa = mysqli_query($koneksi, "SELECT s.*, k.nomor_kamar, k.tipe_kamar, k.harga_per_bulan 
                                  FROM sewa s 
                                  JOIN kamar k ON s.id_kamar = k.id_kamar 
                                  WHERE s.id_penghuni = '$id_penghuni' 
                                  ORDER BY s.created_at DESC LIMIT 1");
$d_sewa = mysqli_fetch_assoc($q_sewa);

//$tagihan_nunggak = 0;
if ($d_sewa) {
    $id_sewa = $d_sewa['id_sewa'];
    $q_tagihan = mysqli_query($koneksi, "SELECT COUNT(*) as nunggak FROM tagihan WHERE id_sewa = '$id_sewa' AND status_pembayaran = 'Belum Bayar'");
    $d_tagihan = mysqli_fetch_assoc($q_tagihan);
    $tagihan_nunggak = $d_tagihan['nunggak'];
}
?>

<div class="bg-emerald-600 rounded-xl p-6 mb-8 text-white shadow-lg bg-gradient-to-r from-emerald-600 to-emerald-800">
    <h1 class="text-2xl font-bold mb-2">Halo, <?php echo $_SESSION['nama_penghuni']; ?>! 👋</h1>
    <p class="text-emerald-100">Selamat datang di Portal Penghuni. Selalu periksa tagihan Anda tepat waktu ya.</p>
</div>

<?php if(isset($d_sewa) && $d_sewa): ?>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Informasi Kamar -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 class="font-bold text-slate-800 text-lg"><i class="fa-solid fa-bed text-emerald-600 mr-2"></i>Kamar Saat Ini</h3>
                <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Aktif</span>
            </div>
            
            <div class="space-y-4">
                <div>
                    <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Nomor Kamar</p>
                    <p class="text-3xl font-black text-slate-800"><?php echo $d_sewa['nomor_kamar']; ?></p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p class="text-xs text-slate-500 font-semibold mb-1">Fasilitas</p>
                        <p class="text-sm font-medium text-slate-800"><?php echo $d_sewa['tipe_kamar']; ?></p>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p class="text-xs text-slate-500 font-semibold mb-1">Harga Sewa</p>
                        <p class="text-sm font-bold text-emerald-600">Rp <?php echo number_format($d_sewa['harga_per_bulan'],0,',','.'); ?> <span class="text-slate-400 font-normal text-xs">/ bln</span></p>
                    </div>
                </div>
                <div class="pt-2">
                    <p class="text-xs text-slate-500"><i class="fa-regular fa-calendar-check mr-1"></i> Mulai menyewa sejak: <b><?php echo date('d M Y', strtotime($d_sewa['tanggal_masuk'])); ?></b></p>
                </div>
            </div>
        </div>

        <!-- Status Tagihan -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center items-center text-center">
            <?php if(isset($tagihan_nunggak) && $tagihan_nunggak > 0): ?>
                <div class="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mb-4">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Ada <?php echo $tagihan_nunggak; ?> Tagihan Belum Dibayar</h3>
                <p class="text-slate-500 mb-6 text-sm">Segera selesaikan pembayaran agar tidak terkena denda.</p>
                <a href="tagihan_saya.php" class="bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto">Bayar Sekarang</a>
            <?php else: ?>
                <div class="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mb-4">
                    <i class="fa-solid fa-shield-check"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Semua Tagihan Lunas</h3>
                <p class="text-slate-500 text-sm">Terima kasih telah membayar tagihan kos tepat waktu!</p>
            <?php endif; ?>
        </div>
    </div>
<?php else: ?>
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <i class="fa-solid fa-house-circle-exclamation text-5xl text-slate-300 mb-4"></i>
        <h3 class="text-xl font-bold text-slate-800 mb-2">Belum Ada Kamar</h3>
        <p class="text-slate-500">Anda belum dialokasikan ke kamar manapun. Silakan hubungi Bapak Kos.</p>
    </div>
<?php endif; ?>

<?php require_once 'layout/footer.php'; ?>
```

Sekarang coba kelen *refresh* lagi halaman Dashboard anak kos-nya. Harusnya udah tampil data kamar dan tagihannya! 

Ada lagi yang *error* atau mau kelen tambahin fiturnya?