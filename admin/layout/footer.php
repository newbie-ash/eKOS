</main> <!-- Penutup tag main dari header -->
    </div> <!-- Penutup flex kanan dari header -->
    
    <!-- Script tambahan untuk responsivitas Mobile -->
    <script>
        // Ambil elemen dari HTML
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        // Fungsi untuk buka/tutup menu samping
        function toggleSidebar() {
            // Geser sidebar masuk atau keluar layar
            sidebar.classList.toggle('-translate-x-full');
            // Munculkan atau hilangkan layar gelap di belakangnya
            overlay.classList.toggle('hidden');
        }
    </script>
</body>
</html>