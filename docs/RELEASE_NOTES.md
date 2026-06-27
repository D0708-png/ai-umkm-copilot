# Release Notes

## v1.0.0 — Premium MVP Release

AI UMKM Co-Pilot v1.0.0 adalah rilis MVP production-ready yang mencakup fitur inti untuk membantu pelaku UMKM mencatat transaksi, mengelola stok, membaca laporan, dan memahami kondisi usaha.

### Added

- Authentication dengan register, login, logout, dan protected routes.
- Business profile onboarding untuk setiap user.
- Default transaction categories setelah profil usaha dibuat.
- Dashboard ringkasan usaha.
- Ringkasan aktivitas terbaru berdasarkan transaksi aktual.
- Manajemen transaksi pemasukan dan pengeluaran.
- Currency input dengan format Rupiah.
- Manajemen produk.
- Manajemen stok masuk dan stok keluar.
- Validasi stok agar tidak menjadi negatif.
- Laporan laba rugi.
- Donut chart kategori pengeluaran.
- AI Assistant MVP berbasis data usaha.
- Contoh data untuk mencoba aplikasi.
- Fitur bersihkan contoh data.
- Fitur hapus seluruh data usaha dengan verifikasi password.
- Premium UI layout.
- Sidebar navigation.
- Route loading indicator.
- Animated counter.
- GSAP hover interaction yang aman untuk Next.js hydration.
- Production copy polish untuk website.

### Changed

- Landing page diarahkan langsung ke register.
- Dashboard insight diganti dari target statis menjadi ringkasan aktivitas aktual.
- Settings copy diperbaiki agar lebih product-ready.
- Register, login, dan onboarding dipoles agar konsisten dengan UI aplikasi.
- Report chart diperkecil dan detail kategori ditata lebih rapi.

### Fixed

- Hydration error dari GSAP DOM mutation.
- Key warning pada navigation list.
- Dashboard insight kosong saat transaksi terbaru tidak berada di tanggal hari ini.
- Register tetap bisa dibuka walaupun user masih memiliki session aktif.
- UI copy yang masih bernuansa development/internal.

### Known Limitations

- AI Assistant masih menggunakan rule-based logic, belum memakai LLM API eksternal.
- Preferensi switch di Settings masih bersifat UI state lokal, belum disimpan ke database.
- Export laporan belum tersedia sebagai file PDF/CSV.
- Mobile layout sudah memiliki fondasi responsive, tetapi polish utama masih desktop-first.

### Next

- Persistent user preferences.
- Export laporan.
- Custom business targets.
- Real LLM integration.
- Improved analytics.
- Full mobile polish.