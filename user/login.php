<?php
session_start();
require '../koneksi.php'; // Panggil koneksi dari luar folder user

// PENGATURAN ANTI BRUTE FORCE KHUSUS USER
$max_attempts = 5;
$lockout_time = 3 * 60;

if (isset($_SESSION['lockout_until_user'])) {
    if (time() < $_SESSION['lockout_until_user']) {
        $sisa_waktu = $_SESSION['lockout_until_user'] - time();
        $error = "Terlalu banyak percobaan. Coba lagi dalam " . $sisa_waktu . " detik.";
        $is_locked = true;
    } else {
        unset($_SESSION['login_attempts_user']);
        unset($_SESSION['lockout_until_user']);
        $is_locked = false;
    }
} else {
    $is_locked = false;
}

if (empty($_SESSION['csrf_token_user'])) {
    $_SESSION['csrf_token_user'] = bin2hex(random_bytes(32));
}

// LOGIK PROSES LOGIN USER
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$is_locked) {
    
    if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token_user'], $_POST['csrf_token'])) {
        die("Security Alert: Token CSRF tidak valid!");
    }

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // CEK KE TABEL PENGHUNI (Bukan petugas!)
    $query = "SELECT id_penghuni, nama, password FROM penghuni WHERE username = ?";
    $stmt = mysqli_prepare($koneksi, $query);
    
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($row = mysqli_fetch_assoc($result)) {
            // Verifikasi Password
            if (password_verify($password, $row['password'])) {
                
                // LOGIN SUKSES
                session_regenerate_id(true);
                $_SESSION['user_login'] = true;
                $_SESSION['id_penghuni'] = $row['id_penghuni'];
                $_SESSION['nama_penghuni'] = $row['nama'];
                unset($_SESSION['login_attempts_user']);
                
                header("Location: index.php"); // Arahkan ke dashboard user
                exit;
            } else {
                $login_failed = true;
            }
        } else {
            $login_failed = true;
        }
        mysqli_stmt_close($stmt);
    }

    if (isset($login_failed)) {
        sleep(1); 
        $_SESSION['login_attempts_user'] = ($_SESSION['login_attempts_user'] ?? 0) + 1;
        $error = "Username atau Password salah!";
        
        if ($_SESSION['login_attempts_user'] >= $max_attempts) {
            $_SESSION['lockout_until_user'] = time() + $lockout_time;
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
    <title>Login Anak Kos - E-Kos</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 flex items-center justify-center h-screen">

    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-emerald-600 tracking-tight">Portal Penghuni</h1>
            <p class="text-slate-500 text-sm mt-2 font-medium">Cek Tagihan & Riwayat Kos</p>
        </div>

        <?php if(isset($error)): ?>
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md animate-pulse">
            <p class="font-bold text-sm">Akses Ditolak</p>
            <p class="text-xs"><?php echo htmlspecialchars($error); ?></p>
        </div>
        <?php endif; ?>

        <form action="" method="POST" class="<?php echo $is_locked ? 'opacity-50 pointer-events-none' : ''; ?>">
            <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token_user']; ?>">

            <div class="mb-5">
                <label for="username" class="block text-slate-700 text-sm font-semibold mb-2">Username / No. KTP</label>
                <input type="text" id="username" name="username" placeholder="Masukkan username dari Admin" required autocomplete="off"
                    class="appearance-none border border-slate-300 rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
            </div>

            <div class="mb-6">
                <label for="password" class="block text-slate-700 text-sm font-semibold mb-2">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required
                    class="appearance-none border border-slate-300 rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
            </div>

            <div class="mt-8">
                <button type="submit" <?php echo $is_locked ? 'disabled' : ''; ?>
                    class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg w-full transition duration-200 disabled:bg-slate-400">
                    <?php echo $is_locked ? 'Terkunci 🔒' : 'Masuk Portal 🚪'; ?>
                </button>
            </div>
        </form>
    </div>
</body>
</html>