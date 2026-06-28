<?php
require_once 'layout/header.php';

// --- BAGIAN 1: LOGIKA PEMROSESAN DATABASE ---

// 1. Proses Tambah Penghuni Baru
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['tambah_penghuni'])) {
    $ktp = mysqli_real_escape_string($koneksi, $_POST['nomor_ktp']);
    $nama = mysqli_real_escape_string($koneksi, $_POST['nama']);
    $tgl_lahir = mysqli_real_escape_string($koneksi, $_POST['tanggal_lahir']);
    $telp = mysqli_real_escape_string($koneksi, $_POST['nomor_telepon']);
    $alamat = mysqli_real_escape_string($koneksi, $_POST['alamat']);

    // Cek KTP ganda
    $cek = mysqli_query($koneksi, "SELECT id_penghuni FROM penghuni WHERE nomor_ktp = '$ktp'");
    if (mysqli_num_rows($cek) > 0) {
        $error = "Penghuni dengan Nomor KTP $ktp sudah terdaftar!";
    } else {
        // Auto-Generate ID (Contoh: PGN-001)
        $q_id = mysqli_query($koneksi, "SELECT MAX(id_penghuni) as max_id FROM penghuni");
        $d_id = mysqli_fetch_assoc($q_id);
        $urutan = (int) substr($d_id['max_id'], 4, 3);
        $urutan++;
        $id_penghuni = "PGN-" . sprintf("%03s", $urutan);

        // Otomatis buatkan Username (pakai no KTP) dan Password default 'kos123'
        $username = $ktp;
        $password_hash = password_hash('kos123', PASSWORD_BCRYPT);

        $query = "INSERT INTO penghuni (id_penghuni, nomor_ktp, nama, tanggal_lahir, alamat, nomor_telepon, username, password) 
                  VALUES ('$id_penghuni', '$ktp', '$nama', '$tgl_lahir', '$alamat', '$telp', '$username', '$password_hash')";
        
        if (mysqli_query($koneksi, $query)) {
            $sukses = "Penghuni baru ditambahkan. Username: <b>$username</b> | Password default: <b>kos123</b>";
        } else {
            $error = "Gagal menambah data: " . mysqli_error($koneksi);
        }
    }
}

// 2. Proses Hapus Penghuni
if (isset($_GET['hapus'])) {
    $id_hapus = mysqli_real_escape_string($koneksi, $_GET['hapus']);
    // Note: Karena pake ON DELETE CASCADE di database, hapus penghuni bakal otomatis nghapus riwayat sewa & tagihannya.
    if (mysqli_query($koneksi, "DELETE FROM penghuni WHERE id_penghuni = '$id_hapus'")) {
        $sukses = "Data penghuni beserta riwayatnya berhasil dihapus.";
    } else {
        $error = "Gagal menghapus data.";
    }
}
?>

<!-- --- BAGIAN 2: TAMPILAN ANTARMUKA / UI --- -->
<div class="mb-6">
    <h1 class="text-2xl font-bold text-slate-800">Master Data Penghuni</h1>
    <p class="text-slate-500">Kelola identitas penyewa / anak kos.</p>
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

<!-- Form Tambah Penghuni -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
    <h3 class="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2"><i class="fa-solid fa-user-plus mr-2 text-indigo-600"></i>Registrasi Anak Kos Baru</h3>
    <form action="" method="POST" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nomor KTP (NIK)</label>
            <input type="text" name="nomor_ktp" required maxlength="16" class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2">
        </div>
        <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input type="text" name="nama" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2">
        </div>
        <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nomor HP / WA</label>
            <input type="text" name="nomor_telepon" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2">
        </div>
        <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
            <input type="date" name="tanggal_lahir" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2">
        </div>
        <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-700 mb-1">Alamat Asal</label>
            <input type="text" name="alamat" required class="w-full border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2">
        </div>
        <div class="lg:col-span-3 flex justify-end mt-2">
            <button type="submit" name="tambah_penghuni" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm">
                Simpan & Buat Akun
            </button>
        </div>
    </form>
</div>

<!-- Tabel Data Penghuni -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                    <th class="p-4 border-b">ID / KTP</th>
                    <th class="p-4 border-b">Informasi Penghuni</th>
                    <th class="p-4 border-b">Kontak</th>
                    <th class="p-4 border-b">Akun Login</th>
                    <th class="p-4 border-b text-center">Aksi</th>
                </tr>
            </thead>
            <tbody class="text-sm divide-y divide-slate-100">
                <?php
                $query = mysqli_query($koneksi, "SELECT * FROM penghuni ORDER BY created_at DESC");
                if (mysqli_num_rows($query) > 0) {
                    while ($row = mysqli_fetch_assoc($query)) {
                ?>
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-4">
                        <span class="font-mono text-xs text-slate-500 block"><?php echo $row['id_penghuni']; ?></span>
                        <span class="font-semibold text-slate-800"><?php echo $row['nomor_ktp']; ?></span>
                    </td>
                    <td class="p-4">
                        <div class="font-bold text-indigo-600"><?php echo $row['nama']; ?></div>
                        <div class="text-xs text-slate-500 mt-1"><i class="fa-solid fa-location-dot mr-1"></i><?php echo $row['alamat']; ?></div>
                    </td>
                    <td class="p-4 text-slate-700 font-medium">
                        <i class="fa-solid fa-phone text-slate-400 mr-1"></i> <?php echo $row['nomor_telepon']; ?>
                    </td>
                    <td class="p-4">
                        <span class="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded text-xs font-mono">
                            User: <?php echo $row['username']; ?>
                        </span>
                    </td>
                    <td class="p-4 text-center">
                        <a href="?hapus=<?php echo $row['id_penghuni']; ?>" onclick="return confirm('Hapus penghuni ini beserta seluruh riwayat sewa dan tagihannya?');" class="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded transition-colors inline-block" title="Hapus">
                            <i class="fa-solid fa-trash-can"></i>
                        </a>
                    </td>
                </tr>
                <?php 
                    }
                } else {
                    echo "<tr><td colspan='5' class='p-8 text-center text-slate-500'>Belum ada data penghuni.</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once 'layout/footer.php'; ?>