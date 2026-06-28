<?php
// Memulai sesi untuk melacak login dan keamanan
session_start();

// Panggil file koneksi yang ada di luar folder admin
require '../koneksi.php';

// --- PENGATURAN ANTI BRUTE FORCE ---
$max_attempts = 5;       // Maksimal coba login gagal
$lockout_time = 3 * 60;  // Waktu kunci (3 menit)

// Cek apakah user sedang dihukum (Lockout)
if (isset($_SESSION['lockout_until_admin'])) {
    if (time() < $_SESSION['lockout_until_admin']) {
        $sisa_waktu = $_SESSION['lockout_until_admin'] - time();
        $error = "Terlalu banyak percobaan. Silakan coba lagi dalam " . $sisa_waktu . " detik.";
        $is_locked = true;
    } else {
        unset($_SESSION['login_attempts_admin']);
        unset($_SESSION['lockout_until_admin']);
        $is_locked = false;
    }
} else {
    $is_locked = false;
}

if (empty($_SESSION['csrf_token_admin'])) {
    $_SESSION['csrf_token_admin'] = bin2hex(random_bytes(32));
}

// --- LOGIK PROSES LOGIN ADMIN ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$is_locked) {
    
    // 1. Validasi CSRF Token
    if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token_admin'], $_POST['csrf_token'])) {
        die("Security Alert: Token CSRF tidak valid! Serangan dihentikan.");
    }

    // 2. Ambil dan bersihkan input
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // 3. Anti SQL Injection: Gunakan Prepared Statement
    $query = "SELECT id_petugas, nama, password FROM petugas WHERE username = ?";
    $stmt = mysqli_prepare($koneksi, $query);
    
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($row = mysqli_fetch_assoc($result)) {
            // 4. Verifikasi Password
            if (password_verify($password, $row['password'])) {
                
                // LOGIN SUKSES
                session_regenerate_id(true);
                $_SESSION['admin_login'] = true;
                $_SESSION['id_petugas'] = $row['id_petugas'];
                $_SESSION['nama_petugas'] = $row['nama'];
                unset($_SESSION['login_attempts_admin']);
                
                header("Location: index.php");
                exit;
            } else {
                $login_failed = true;
            }
        } else {
            $login_failed = true;
        }
        mysqli_stmt_close($stmt);
    }

    // JIKA LOGIN GAGAL
    if (isset($login_failed)) {
        sleep(1); // Anti Timing Attack
        $_SESSION['login_attempts_admin'] = ($_SESSION['login_attempts_admin'] ?? 0) + 1;
        $error = "Username atau Password salah!";
        
        if ($_SESSION['login_attempts_admin'] >= $max_attempts) {
            $_SESSION['lockout_until_admin'] = time() + $lockout_time;
            $error = "Akun dikunci sementara. Coba lagi dalam 3 menit.";
            $is_locked = true;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - E-Kos</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 flex items-center justify-center h-screen">

    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-indigo-600 tracking-tight">Portal Admin</h1>
            <p class="text-slate-500 text-sm mt-2 font-medium">Sistem Manajemen E-Kos</p>
        </div>

        <?php if(isset($error)): ?>
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md animate-pulse">
            <p class="font-bold text-sm">Akses Ditolak</p>
            <p class="text-xs"><?php echo htmlspecialchars($error); ?></p>
        </div>
        <?php endif; ?>

        <form action="" method="POST" class="<?php echo $is_locked ? 'opacity-50 pointer-events-none' : ''; ?>">
            <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token_admin']; ?>">

            <div class="mb-5">
                <label for="username" class="block text-slate-700 text-sm font-semibold mb-2">Username Admin</label>
                <input type="text" id="username" name="username" placeholder="Masukkan username admin" required autocomplete="off"
                    class="appearance-none border border-slate-300 rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
            </div>

            <div class="mb-6">
                <label for="password" class="block text-slate-700 text-sm font-semibold mb-2">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required
                    class="appearance-none border border-slate-300 rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
            </div>

            <div class="mt-8">
                <button type="submit" <?php echo $is_locked ? 'disabled' : ''; ?>
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg w-full transition duration-200 disabled:bg-slate-400">
                    <?php echo $is_locked ? 'Terkunci 🔒' : 'Masuk Admin 🔐'; ?>
                </button>
            </div>
        </form>
    </div>
</body>
</html>