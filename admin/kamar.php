<?php
require_once 'layout/header.php';

// --- BAGIAN 1: LOGIKA PEMROSESAN DATABASE (SOP) ---

// 1. Proses Tambah Kamar
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['tambah_kamar'])) {
    $nomor = mysqli_real_escape_string($koneksi, $_POST['nomor_kamar']);
    $tipe = mysqli_real_escape_string($koneksi, $_POST['tipe_kamar']);
    $harga = mysqli_real_escape_string($koneksi, $_POST['harga_per_bulan']);

    // Validasi nomor kamar biar gak ada yang dobel
    $cek = mysqli_query($koneksi, "SELECT id_kamar FROM kamar WHERE nomor_kamar = '$nomor'");
    if (mysqli_num_rows($cek) > 0) {
        $error = "Nomor Kamar $nomor sudah ada di database!";
    } else {
        // Auto-Generate ID Kamar (Contoh: KMR-001)
        $q_id = mysqli_query($koneksi, "SELECT MAX(id_kamar) as max_id FROM kamar");
        $d_id = mysqli_fetch_assoc($q_id);
        $urutan = (int) substr($d_id['max_id'], 4, 3);
        $urutan++;
        $id_kamar = "KMR-" . sprintf("%03s", $urutan);

        $query = "INSERT INTO kamar (id_kamar, nomor_kamar, tipe_kamar, harga_per_bulan) 
                  VALUES ('$id_kamar', '$nomor', '$tipe', '$harga')";
        
        if (mysqli_query($koneksi, $query)) {
            $sukses = "Data kamar berhasil ditambahkan.";
        } else {
            $error = "Gagal menambah data: " . mysqli_error($koneksi);
        }
    }
}

// 2. Proses Hapus Kamar
if (isset($_GET['hapus'])) {
    $id_hapus = mysqli_real_escape_string($koneksi, $_GET['hapus']);
    // Cek dulu apakah kamar sedang terisi
    $cek_status = mysqli_query($koneksi, "SELECT status_kamar FROM kamar WHERE id_kamar = '$id_hapus'");
    $status = mysqli_fetch_assoc($cek_status)['status_kamar'];
    
    if ($status == 'Terisi') {
        $error = "Gagal menghapus! Kamar sedang disewa oleh penghuni.";
    } else {
        if (mysqli_query($koneksi, "DELETE FROM kamar WHERE id_kamar = '$id_hapus'")) {
            $sukses = "Data kamar berhasil dihapus.";
        } else {
            $error = "Gagal menghapus data.";
        }
    }
}
?>

<!-- --- BAGIAN 2: TAMPILAN ANTARMUKA / UI --- -->
<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
        <h1 class="text-2xl font-bold text-slate-800">Master Data Kamar</h1>
        <p class="text-slate-500">Kelola daftar kamar, fasilitas, dan harga sewa bulanan.</p>
    </div>
</div>

<!-- Alert Pesan -->
<?php if (isset($sukses)): ?>
    <div class="bg-emerald-50 text-emerald-600 p-4 rounded-lg mb-6 border border-emerald-200 shadow-sm flex items-center">
        <i class="fa-solid fa-circle-check mr-3 text-xl"></i> <span class="font-medium"><?php echo $sukses; ?></span>
    </div>
<?php endif; ?>
<?php if (isset($error)): ?>
    <div class="bg-rose-50 text-rose-600 p-4 rounded-lg mb-6 border border-rose-200 shadow-sm flex items-center">
        <i class="fa-solid fa-triangle-exclamation mr-3 text-xl"></i> <span class="font-medium"><?php echo $error; ?></span>
    </div>
<?php endif; ?>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Form Tambah Kamar (Kolom Kiri) -->
    <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
            <h3 class="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2"><i class="fa-solid fa-plus-circle mr-2 text-indigo-600"></i>Tambah Kamar Baru</h3>
            <form action="" method="POST" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Nomor Kamar</label>
                    <input type="text" name="nomor_kamar" placeholder="Contoh: A-01" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Tipe / Fasilitas</label>
                    <input type="text" name="tipe_kamar" placeholder="Contoh: AC + Kamar Mandi Dalam" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Harga per Bulan (Rp)</label>
                    <input type="number" name="harga_per_bulan" placeholder="Contoh: 1500000" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2">
                </div>
                <button type="submit" name="tambah_kamar" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                    Simpan Data Kamar
                </button>
            </form>
        </div>
    </div>

    <!-- Tabel Data Kamar (Kolom Kanan) -->
    <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                            <th class="p-4 border-b">No. Kamar</th>
                            <th class="p-4 border-b">Tipe / Fasilitas</th>
                            <th class="p-4 border-b">Harga/Bulan</th>
                            <th class="p-4 border-b text-center">Status</th>
                            <th class="p-4 border-b text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-slate-100">
                        <?php
                        $query = mysqli_query($koneksi, "SELECT * FROM kamar ORDER BY nomor_kamar ASC");
                        if (mysqli_num_rows($query) > 0) {
                            while ($row = mysqli_fetch_assoc($query)) {
                                $badge_bg = $row['status_kamar'] == 'Kosong' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700';
                        ?>
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="p-4 font-bold text-indigo-600"><?php echo $row['nomor_kamar']; ?></td>
                            <td class="p-4 text-slate-700"><?php echo $row['tipe_kamar']; ?></td>
                            <td class="p-4 font-medium text-slate-700">Rp <?php echo number_format($row['harga_per_bulan'], 0, ',', '.'); ?></td>
                            <td class="p-4 text-center">
                                <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold <?php echo $badge_bg; ?>">
                                    <?php echo $row['status_kamar']; ?>
                                </span>
                            </td>
                            <td class="p-4 text-center">
                                <a href="?hapus=<?php echo $row['id_kamar']; ?>" onclick="return confirm('Yakin hapus kamar ini?');" class="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded transition-colors" title="Hapus">
                                    <i class="fa-solid fa-trash-can"></i>
                                </a>
                            </td>
                        </tr>
                        <?php 
                            }
                        } else {
                            echo "<tr><td colspan='5' class='p-8 text-center text-slate-500'>Belum ada data kamar.</td></tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once 'layout/footer.php'; ?>