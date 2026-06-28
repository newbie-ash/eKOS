<?php
require_once 'layout/header.php';
$id_penghuni = $_SESSION['id_penghuni'];

//if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_bukti'])) {
    $id_tagihan = mysqli_real_escape_string($koneksi, $_POST['id_tagihan']);
    
    // Konfigurasi Upload
    $ekstensi_diperbolehkan = array('png', 'jpg', 'jpeg');
    $nama_file = $_FILES['foto_struk']['name'];
    $x = explode('.', $nama_file);
    $ekstensi = strtolower(end($x));
    $ukuran = $_FILES['foto_struk']['size'];
    $file_tmp = $_FILES['foto_struk']['tmp_name'];
    
    // Ganti nama file biar unik dan gak tertimpa
    $nama_file_baru = time() . '_' . $id_tagihan . '.' . $ekstensi;
    $direktori = '../assets/bukti_bayar/';

    // Validasi
    if (in_array($ekstensi, $ekstensi_diperbolehkan) === true) {
        if ($ukuran < 2048000) { // Maks 2MB
            if (move_uploaded_file($file_tmp, $direktori . $nama_file_baru)) {
                // Update ke database
                $q_update = "UPDATE tagihan SET bukti_bayar = '$nama_file_baru', status_pembayaran = 'Menunggu Konfirmasi' WHERE id_tagihan = '$id_tagihan'";
                if (mysqli_query($koneksi, $q_update)) {
                    $sukses = "Bukti pembayaran berhasil diunggah. Menunggu konfirmasi Admin.";
                } else {
                    $error = "Gagal menyimpan ke database.";
                }
            } else {
                $error = "Gagal memindahkan file yang diupload. Pastikan folder assets/bukti_bayar sudah dibuat!";
            }
        } else {
            $error = "Ukuran file terlalu besar! Maksimal 2MB.";
        }
    } else {
        $error = "Ekstensi file tidak diperbolehkan. Hanya JPG dan PNG.";
    }

?>

<div class="mb-6">
    <h1 class="text-2xl font-bold text-slate-800">Tagihan & Pembayaran</h1>
    <p class="text-slate-500">Lihat riwayat tagihan dan upload bukti transfer Anda di sini.</p>
</div>

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

<!-- -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-100/70 text-slate-600 text-xs uppercase tracking-wider font-semibold border-y border-slate-200">
                    <th class="p-4">No. Invoice</th>
                    <th class="p-4">Periode</th>
                    <th class="p-4">Nominal</th>
                    <th class="p-4">Status</th>
                    <th class="p-4">Aksi / Bukti</th>
                </tr>
            </thead>
            <tbody class="text-sm divide-y divide-slate-100">
                <?php
                // Cari tagihan khusus anak kos yang lagi login
                $q_tagihan = mysqli_query($koneksi, "SELECT t.* 
                                                     FROM tagihan t
                                                     JOIN sewa s ON t.id_sewa = s.id_sewa
                                                     WHERE s.id_penghuni = '$id_penghuni'
                                                     ORDER BY t.created_at DESC");

                if (mysqli_num_rows($q_tagihan) > 0) {
                    while ($row = mysqli_fetch_assoc($q_tagihan)) {
                        
                        if ($row['status_pembayaran'] == 'Lunas') {
                            $badge = '<span class="px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-700 border-emerald-200"><i class="fa-solid fa-check-double mr-1"></i>Lunas</span>';
                        } elseif ($row['status_pembayaran'] == 'Menunggu Konfirmasi') {
                            $badge = '<span class="px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-100 text-amber-700 border-amber-200"><i class="fa-solid fa-clock mr-1"></i>Menunggu ACC</span>';
                        } else {
                            $badge = '<span class="px-2.5 py-1 rounded-full text-xs font-medium border bg-rose-100 text-rose-700 border-rose-200"><i class="fa-solid fa-xmark mr-1"></i>Belum Bayar</span>';
                        }
                ?>
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-4 font-mono font-semibold text-slate-600"><?php echo $row['id_tagihan']; ?></td>
                    <td class="p-4 font-medium"><?php echo $row['bulan_tagihan'] . ' ' . $row['tahun_tagihan']; ?></td>
                    <td class="p-4 font-bold text-slate-800">Rp <?php echo number_format($row['jumlah_tagihan'],0,',','.'); ?></td>
                    <td class="p-4"><?php echo $badge; ?></td>
                    <td class="p-4">
                        <?php if ($row['status_pembayaran'] == 'Belum Bayar'): ?>
                            <!-- Form Upload Struk -->
                            <form action="" method="POST" enctype="multipart/form-data" class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                <input type="hidden" name="id_tagihan" value="<?php echo $row['id_tagihan']; ?>">
                                <input type="file" name="foto_struk" required accept="image/png, image/jpeg" class="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer w-full sm:w-auto">
                                <button type="submit" name="upload_bukti" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors shrink-0">Upload</button>
                            </form>
                        <?php else: ?>
                            <!-- Lihat Bukti -->
                            <?php if($row['bukti_bayar']): ?>
                                <a href="../assets/bukti_bayar/<?php echo $row['bukti_bayar']; ?>" target="_blank" class="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium hover:underline">
                                    <i class="fa-solid fa-image mr-1.5"></i> Lihat Struk
                                </a>
                            <?php else: ?>
                                <span class="text-xs text-slate-400 italic">Lunas Manual</span>
                            <?php endif; ?>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php 
                    }
                } else {
                    echo "<tr><td colspan='5' class='p-8 text-center text-slate-500 font-medium'>Belum ada riwayat tagihan.</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once 'layout/footer.php'; ?>