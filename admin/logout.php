<?php
session_start();
// Hancurkan semua sesi yang ada
session_unset();
session_destroy();

// Tendang balik ke halaman login
header("Location: login.php");
exit;
?>