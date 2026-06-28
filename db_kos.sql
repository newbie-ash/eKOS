-- Hapus database kalau sebelumnya udah pernah dibuat biar bersih total
DROP DATABASE IF EXISTS db_kos;
CREATE DATABASE db_kos;
USE db_kos;

-- 1. TABEL PETUGAS (Khusus untuk login Admin / Bapak Kos)
CREATE TABLE petugas (
    id_petugas VARCHAR(10) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Ingat! Ini nanti isinya Hash Bcrypt, bukan teks biasa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_petugas)
);

-- 2. TABEL KAMAR (Master data kos-kosan)
CREATE TABLE kamar (
    id_kamar VARCHAR(10) NOT NULL,
    nomor_kamar VARCHAR(10) NOT NULL,
    tipe_kamar VARCHAR(50) NOT NULL, -- Contoh: 'Kamar Mandi Dalam + AC'
    harga_per_bulan INT NOT NULL,
    status_kamar VARCHAR(20) DEFAULT 'Kosong', -- Isinya cuma boleh: 'Kosong' atau 'Terisi'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_kamar)
);

-- 3. TABEL PENGHUNI (Anak Kos - Udah ditambahin Username & Password buat mereka login)
CREATE TABLE penghuni (
    id_penghuni VARCHAR(10) NOT NULL,
    nomor_ktp VARCHAR(16) NOT NULL, -- Tipe data udah bener, aman dari error overflow
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    nomor_telepon VARCHAR(15) NOT NULL,
    username VARCHAR(50) NOT NULL,   -- Username khusus anak kos login
    password VARCHAR(255) NOT NULL,  -- Password khusus anak kos login (Di-hash)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_penghuni)
);

-- 4. TABEL SEWA (Penempatan anak kos ke kamar mana)
CREATE TABLE sewa (
    id_sewa VARCHAR(10) NOT NULL,
    id_penghuni VARCHAR(10) NOT NULL,
    id_kamar VARCHAR(10) NOT NULL,
    id_petugas VARCHAR(10) NOT NULL, -- Siapa admin yang melayani masuknya anak kos ini
    tanggal_masuk DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_sewa),
    
    -- Relasi Tabel (ON DELETE CASCADE: Kalau data anak kos dihapus, data sewanya ikut kehapus)
    FOREIGN KEY (id_penghuni) REFERENCES penghuni(id_penghuni) ON DELETE CASCADE,
    FOREIGN KEY (id_kamar) REFERENCES kamar(id_kamar) ON DELETE CASCADE,
    FOREIGN KEY (id_petugas) REFERENCES petugas(id_petugas) ON DELETE CASCADE
);

-- 5. TABEL TAGIHAN (Siklus penagihan bulanan)
CREATE TABLE tagihan (
    id_tagihan VARCHAR(10) NOT NULL,
    id_sewa VARCHAR(10) NOT NULL,
    bulan_tagihan VARCHAR(20) NOT NULL, -- Contoh: 'Januari'
    tahun_tagihan VARCHAR(4) NOT NULL,  -- Contoh: '2026'
    jumlah_tagihan INT NOT NULL,
    status_pembayaran VARCHAR(30) DEFAULT 'Belum Bayar', -- Isinya: 'Belum Bayar', 'Menunggu Konfirmasi', 'Lunas'
    tanggal_pembayaran DATE NULL,
    bukti_bayar VARCHAR(255) NULL,      -- Nama file foto struk transfer yang di-upload anak kos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_tagihan),
    
    FOREIGN KEY (id_sewa) REFERENCES sewa(id_sewa) ON DELETE CASCADE
);