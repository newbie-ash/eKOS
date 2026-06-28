<?php
require_once 'layout/header.php';

// --- LOGIKA FILTER LAPORAN ---
$filter_bulan = isset($_GET['bulan']) ? mysqli_real_escape_string($koneksi, $_GET['bulan']) : '';
$filter_tahun = isset($_GET['tahun']) ? mysqli_real_escape_string($koneksi, $_GET['tahun']) : date('Y');

// Susun Query Dasar (JOIN 4 Tabel)
$query_laporan = "SELECT t.*, p.nama, k.nomor_kamar 
                  FROM tagihan t
                  JOIN sewa s ON t.id_sewa = s.id_sewa
                  JOIN penghuni p ON s.id_penghuni = p.id_penghuni
                  JOIN kamar k ON s.id_kamar = k.id_kamar
                  WHERE t.tahun_tagihan = '$filter_tahun'";

if ($filter_bulan != '') {
    $query_laporan .= " AND t.bulan_tagihan = '$filter_bulan'";
}

$query_laporan .= " ORDER BY t.created_at DESC";
$result_laporan = mysqli_query($koneksi, $query_laporan);

// Hitung Rekapitulasi Uang
$total_lunas = 0;
$total_nunggak = 0;

// Kita loop datanya untuk hitung totalan, lalu kita reset pointer querynya biar bisa di-loop lagi di tabel HTML
$data_laporan = [];
while ($row = mysqli_fetch_assoc($result_laporan)) {
    $data_laporan[] = $row; // Simpan ke array
    if ($row['status_pembayaran'] == 'Lunas') {
        $total_lunas += $row['jumlah_tagihan'];
    } else {
        $total_nunggak += $row['jumlah_tagihan'];
    }
}
$total_tagihan = $total_lunas + $total_nunggak;
?>

<!-- --- CSS KHUSUS CETAK (Menghilangkan tombol saat di print) --- -->
<style>
    @media print {
        body { background-color: white; }
        #sidebar, header, .no-print { display: none !important; }
        main { padding: 0 !important; margin: 0 !important; background-color: white !important; }
        .print-area { width: 100% !important; border: none !important; box-shadow: none !important; }
        .print-header { display: block !important; text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
    }
    .print-header { display: none; } /* Sembunyikan di layar normal */
</style>

<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
    <div>
        <h1 class="text-2xl font-bold text-slate-800">Laporan Keuangan Kos</h1>
        <p class="text-slate-500">Cetak rekapitulasi pendapatan dan tunggakan tagihan.</p>
    </div>
    <!-- Tombol Print -->
    <button onclick="window.print()" class="bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center shadow-sm">
        <i class="fa-solid fa-print mr-2"></i> Cetak / PDF
    </button>
</div>

<!-- Form Filter (Tidak ikut terprint) -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 no-print">
    <form action="" method="GET" class="flex flex-col sm:flex-row gap-4 items-end">
        <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Filter Bulan</label>
            <select name="bulan" class="border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2">
                <option value="">-- Semua Bulan --</option>
                <?php
                $bulan_list = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                foreach ($bulan_list as $b) {
                    $sel = ($b == $filter_bulan) ? 'selected' : '';
                    echo "<option value='$b' $sel>$b</option>";
                }
                ?>
            </select>
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Filter Tahun</label>
            <input type="number" name="tahun" value="<?php echo $filter_tahun; ?>" class="border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2 w-32">
        </div>
        <button type="submit" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-4 py-2 rounded-lg transition-colors border border-indigo-200">
            Tampilkan
        </button>
    </form>
</div>

<!-- AREA YANG AKAN DI-PRINT -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 print-area">
    
    <!-- Header Khusus Print Kertas -->
    <div class="print-header">
        <h2 style="font-size: 24px; font-weight: bold; margin: 0;">LAPORAN KEUANGAN E-KOS</h2>
        <p style="margin: 5px 0;">Periode: <?php echo ($filter_bulan == '') ? 'Semua Bulan' : $filter_bulan; ?> Tahun <?php echo $filter_tahun; ?></p>
        <p style="margin: 0; font-size: 12px;">Dicetak pada: <?php echo date('d-m-Y H:i'); ?> oleh Admin</p>
    </div>

    <!-- Kotak Ringkasan Finansial -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Tagihan (Rp)</p>
            <h3 class="text-xl font-bold text-slate-800"><?php echo number_format($total_tagihan, 0, ',', '.'); ?></h3>
        </div>
        <div class="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
            <p class="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">Uang Masuk / Lunas</p>
            <h3 class="text-xl font-bold text-emerald-700"><?php echo number_format($total_lunas, 0, ',', '.'); ?></h3>
        </div>
        <div class="border border-rose-200 rounded-lg p-4 bg-rose-50">
            <p class="text-xs text-rose-700 font-bold uppercase tracking-wider mb-1">Tunggakan / Piutang</p>
            <h3 class="text-xl font-bold text-rose-700"><?php echo number_format($total_nunggak, 0, ',', '.'); ?></h3>
        </div>
    </div>

    <!-- Tabel Data Laporan -->
    <table class="w-full text-left border-collapse border border-slate-200">
        <thead>
            <tr class="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-semibold">
                <th class="p-3 border border-slate-200">No. Invoice</th>
                <th class="p-3 border border-slate-200">Penghuni</th>
                <th class="p-3 border border-slate-200">Periode</th>
                <th class="p-3 border border-slate-200 text-right">Nominal (Rp)</th>
                <th class="p-3 border border-slate-200 text-center">Status</th>
            </tr>
        </thead>
        <tbody class="text-sm text-slate-800">
            <?php
            if (count($data_laporan) > 0) {
                foreach ($data_laporan as $baris) {
                    // Warna teks beda untuk status di kertas print
                    $color_class = ($baris['status_pembayaran'] == 'Lunas') ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold';
            ?>
            <tr>
                <td class="p-3 border border-slate-200 font-mono text-xs"><?php echo $baris['id_tagihan']; ?></td>
                <td class="p-3 border border-slate-200">
                    <?php echo $baris['nama']; ?><br>
                    <span class="text-xs text-slate-500 font-normal">Kamar <?php echo $baris['nomor_kamar']; ?></span>
                </td>
                <td class="p-3 border border-slate-200"><?php echo $baris['bulan_tagihan'] . ' ' . $baris['tahun_tagihan']; ?></td>
                <td class="p-3 border border-slate-200 text-right"><?php echo number_format($baris['jumlah_tagihan'], 0, ',', '.'); ?></td>
                <td class="p-3 border border-slate-200 text-center <?php echo $color_class; ?>"><?php echo strtoupper($baris['status_pembayaran']); ?></td>
            </tr>
            <?php 
                }
            } else {
                echo "<tr><td colspan='5' class='p-8 text-center text-slate-500'>Tidak ada data transaksi pada periode ini.</td></tr>";
            }
            ?>
        </tbody>
    </table>
    
    <!-- Tanda Tangan Khusus Print -->
    <div class="print-header" style="border:none; margin-top: 40px; text-align: right; display: flex; justify-content: flex-end;">
        <div style="width: 200px; text-align: center;">
            <p style="margin-bottom: 70px;">Mengetahui,<br>Pengelola Kos</p>
            <p style="font-weight: bold; text-decoration: underline;"><?php echo $_SESSION['nama_petugas']; ?></p>
        </div>
    </div>
</div>

<?php require_once 'layout/footer.php'; ?>