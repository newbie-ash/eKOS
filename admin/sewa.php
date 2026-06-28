<?php
require_once 'layout/header.php';

// --- STANDAR PROSEDUR 1: LOGIKA PEMROSESAN DATABASE (DI ATAS) ---

// 1. PROSES TAMBAH TAGIHAN BARU
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['buat_tagihan'])) {
    // Sanitasi Input (Keamanan Anti SQL-Injection Dasar)
    $id_sewa = mysqli_real_escape_string($koneksi, $_POST['id_sewa']);
    $bulan = mysqli_real_escape_string($koneksi, $_POST['bulan']);
    $tahun = mysqli_real_escape_string($koneksi, $_POST['tahun']);
    $jumlah = mysqli_real_escape_string($koneksi, $_POST['jumlah']);
    
    // Validasi Kelogisan Data (Mencegah duplikasi tagihan di bulan yang sama)
    $cek_tagihan = mysqli_query($koneksi, "SELECT id_tagihan FROM tagihan WHERE id_sewa = '$id_sewa' AND bulan_tagihan = '$bulan' AND tahun_tagihan = '$tahun'");
    
    if (mysqli_num_rows($cek_tagihan) > 0) {
        $error = "Tagihan untuk penghuni ini pada periode $bulan $tahun sudah ada!";
    } else {
        // Auto-Generate ID Tagihan (Format: INV-001)
        $q_id = mysqli_query($koneksi, "SELECT MAX(id_tagihan) as max_id FROM tagihan");
        $d_id = mysqli_fetch_assoc($q_id);
        $urutan = (int) substr($d_id['max_id'], 4, 3);
        $urutan++;
        $id_tagihan = "INV-" . sprintf("%03s", $urutan);

        // Eksekusi Insert
        $query_insert = "INSERT INTO tagihan (id_tagihan, id_sewa, bulan_tagihan, tahun_tagihan, jumlah_tagihan) 
                         VALUES ('$id_tagihan', '$id_sewa', '$bulan', '$tahun', '$jumlah')";
        
        if (mysqli_query($koneksi, $query_insert)) {
            $sukses = "Invoice Tagihan untuk bulan $bulan berhasil diterbitkan.";
        } else {
            $error = "Terjadi kesalahan sistem: " . mysqli_error($koneksi);
        }
    }
}

// 2. PROSES KONFIRMASI LUNAS (MANUAL OLEH ADMIN)
if (isset($_GET['lunas'])) {
    $id_lunas = mysqli_real_escape_string($koneksi, $_GET['lunas']);
    $tgl_sekarang = date('Y-m-d');
    
    $q_lunas = "UPDATE tagihan SET status_pembayaran = 'Lunas', tanggal_pembayaran = '$tgl_sekarang' WHERE id_tagihan = '$id_lunas'";
    if (mysqli_query($koneksi, $q_lunas)) {
        $sukses = "Pembayaran berhasil dikonfirmasi. Status tagihan menjadi LUNAS.";
    } else {
        $error = "Gagal memperbarui status: " . mysqli_error($koneksi);
    }
}

// 3. PROSES HAPUS TAGIHAN (Jika salah input)
if (isset($_GET['hapus'])) {
    $id_hapus = mysqli_real_escape_string($koneksi, $_GET['hapus']);
    if (mysqli_query($koneksi, "DELETE FROM tagihan WHERE id_tagihan = '$id_hapus'")) {
        $sukses = "Data tagihan berhasil dihapus dari sistem.";
    } else {
        $error = "Gagal menghapus tagihan.";
    }
}
?>

<!-- --- STANDAR PROSEDUR 2: TAMPILAN ANTARMUKA (DI BAWAH) --- -->
<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
        <h1 class="text-2xl font-bold text-slate-800">Manajemen Tagihan</h1>
        <p class="text-slate-500">Kelola invoice bulanan dan konfirmasi pembayaran penghuni.</p>
    </div>
</div>

<!-- Pesan Notifikasi (Standar UX) -->
<?php if (isset($sukses)): ?>
    <div class="bg-emerald-50 text-emerald-600 p-4 rounded-lg mb-6 border border-emerald-200 flex items-center shadow-sm">
        <i class="fa-solid fa-circle-check text-xl mr-3"></i> <span class="font-medium"><?php echo $sukses; ?></span>
    </div>
<?php endif; ?>
<?php if (isset($error)): ?>
    <div class="bg-rose-50 text-rose-600 p-4 rounded-lg mb-6 border border-rose-200 flex items-center shadow-sm">
        <i class="fa-solid fa-triangle-exclamation text-xl mr-3"></i> <span class="font-medium"><?php echo $error; ?></span>
    </div>
<?php endif; ?>

<!-- Form Pembuatan Tagihan Baru -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
    <h3 class="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
        <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
            <i class="fa-solid fa-file-invoice-dollar"></i>
        </div>
        Terbitkan Tagihan Baru
    </h3>
    
    <form action="" method="POST" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        <!-- Pilihan Penghuni (Hanya yang sedang menyewa aktif) -->
        <div class="lg:col-span-2">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Pilih Penghuni Aktif</label>
            <select name="id_sewa" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2.5">
                <option value="">-- Pilih Penghuni & Kamar --</option>
                <?php
                // Relasi 3 Tabel untuk memunculkan nama dan kamar yang disewa
                $q_sewa = mysqli_query($koneksi, "SELECT s.id_sewa, p.nama, k.nomor_kamar, k.harga_per_bulan 
                                                  FROM sewa s 
                                                  JOIN penghuni p ON s.id_penghuni = p.id_penghuni 
                                                  JOIN kamar k ON s.id_kamar = k.id_kamar 
                                                  ORDER BY k.nomor_kamar ASC");
                while ($s = mysqli_fetch_assoc($q_sewa)) {
                    echo "<option value='{$s['id_sewa']}'>Kamar {$s['nomor_kamar']} - {$s['nama']} (Rp " . number_format($s['harga_per_bulan'],0,',','.') . ")</option>";
                }
                ?>
            </select>
        </div>

        <!-- Periode Bulan -->
        <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Bulan</label>
            <select name="bulan" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2.5">
                <?php
                $bulan_list = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                $bln_skrg = date('n') - 1; // Index bulan ini
                foreach ($bulan_list as $index => $nama_bulan) {
                    $selected = ($index == $bln_skrg) ? 'selected' : '';
                    echo "<option value='$nama_bulan' $selected>$nama_bulan</option>";
                }
                ?>
            </select>
        </div>

        <!-- Periode Tahun -->
        <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Tahun</label>
            <input type="number" name="tahun" value="<?php echo date('Y'); ?>" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2.5">
        </div>

        <!-- Input Nominal Nominal Manual (Bisa beda kalau ada denda/diskon) -->
        <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Total (Rp)</label>
            <input type="number" name="jumlah" placeholder="Contoh: 1500000" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2.5">
        </div>

        <!-- Tombol Submit -->
        <div class="lg:col-span-5 mt-2 flex justify-end">
            <button type="submit" name="buat_tagihan" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center">
                <i class="fa-solid fa-paper-plane mr-2"></i> Terbitkan Invoice
            </button>
        </div>
    </form>
</div>

<!-- Tabel Data Tagihan Terbit -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="p-5 border-b border-slate-200 bg-slate-50/50">
        <h3 class="font-bold text-slate-800"><i class="fa-solid fa-list-check mr-2 text-indigo-600"></i>Monitoring Tagihan Aktif</h3>
    </div>
    
    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-100/70 text-slate-600 text-xs uppercase tracking-wider font-semibold border-y border-slate-200">
                    <th class="p-4">No. Invoice</th>
                    <th class="p-4">Penghuni & Kamar</th>
                    <th class="p-4">Periode</th>
                    <th class="p-4">Nominal</th>
                    <th class="p-4">Status</th>
                    <th class="p-4 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody class="text-sm divide-y divide-slate-100">
                <?php
                // Standar Prosedur: JOIN Kompleks untuk menyajikan informasi utuh
                $query_tampil = "SELECT t.*, p.nama, k.nomor_kamar 
                                 FROM tagihan t
                                 JOIN sewa s ON t.id_sewa = s.id_sewa
                                 JOIN penghuni p ON s.id_penghuni = p.id_penghuni
                                 JOIN kamar k ON s.id_kamar = k.id_kamar
                                 ORDER BY t.created_at DESC";
                $result = mysqli_query($koneksi, $query_tampil);

                if (mysqli_num_rows($result) > 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        // Tentukan style badge berdasarkan status
                        if ($row['status_pembayaran'] == 'Lunas') {
                            $badge_color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                            $icon = 'fa-check-double';
                        } elseif ($row['status_pembayaran'] == 'Menunggu Konfirmasi') {
                            $badge_color = 'bg-amber-100 text-amber-700 border-amber-200';
                            $icon = 'fa-clock';
                        } else {
                            $badge_color = 'bg-rose-100 text-rose-700 border-rose-200';
                            $icon = 'fa-xmark';
                        }
                ?>
                <tr class="hover:bg-slate-50 transition-colors group">
                    <td class="p-4 font-mono font-medium text-slate-700"><?php echo $row['id_tagihan']; ?></td>
                    <td class="p-4">
                        <div class="font-semibold text-slate-800"><?php echo $row['nama']; ?></div>
                        <div class="text-xs text-slate-500">Kamar <?php echo $row['nomor_kamar']; ?></div>
                    </td>
                    <td class="p-4 font-medium text-slate-600"><?php echo $row['bulan_tagihan'] . ' ' . $row['tahun_tagihan']; ?></td>
                    <td class="p-4 font-bold text-slate-800">Rp <?php echo number_format($row['jumlah_tagihan'],0,',','.'); ?></td>
                    <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border <?php echo $badge_color; ?>">
                            <i class="fa-solid <?php echo $icon; ?> mr-1.5"></i> <?php echo $row['status_pembayaran']; ?>
                        </span>
                        <?php if($row['bukti_bayar']): ?>
                            <div class="mt-2 text-xs">
                                <a href="../assets/bukti_bayar/<?php echo $row['bukti_bayar']; ?>" target="_blank" class="text-indigo-600 hover:underline flex items-center">
                                    <i class="fa-solid fa-paperclip mr-1"></i> Lihat Struk
                                </a>
                            </div>
                        <?php endif; ?>
                    </td>
                    <td class="p-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <?php if ($row['status_pembayaran'] != 'Lunas'): ?>
                                <a href="?lunas=<?php echo $row['id_tagihan']; ?>" onclick="return confirm('Konfirmasi bahwa uang telah diterima dan tagihan lunas?');" class="inline-flex items-center justify-center px-3 py-1.5 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors text-xs font-semibold" title="Konfirmasi Lunas">
                                    ACC Lunas
                                </a>
                            <?php endif; ?>
                            
                            <a href="?hapus=<?php echo $row['id_tagihan']; ?>" onclick="return confirm('Yakin ingin menghapus tagihan ini secara permanen?');" class="inline-flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Hapus">
                                <i class="fa-solid fa-trash-can"></i>
                            </a>
                        </div>
                    </td>
                </tr>
                <?php 
                    }
                } else {
                    echo "<tr><td colspan='6' class='p-8 text-center text-slate-500 font-medium'>Belum ada tagihan yang diterbitkan.</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once 'layout/footer.php'; ?>