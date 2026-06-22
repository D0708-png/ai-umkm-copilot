# User Flow — AI UMKM Co-Pilot

## 1. Tujuan Dokumen

Dokumen ini menjelaskan alur penggunaan aplikasi AI UMKM Co-Pilot dari sisi pengguna.

User flow dibuat agar proses pengembangan fitur lebih jelas, terutama untuk menentukan halaman, aksi pengguna, dan data yang dibutuhkan pada setiap tahap.

---

## 2. Aktor Utama

Aktor utama dalam aplikasi ini adalah pemilik UMKM.

Contoh:

- Pemilik warung
- Pemilik toko kecil
- Online seller
- Reseller
- Penjual makanan dan minuman
- Pemilik usaha rumahan
- Pemilik jasa kecil

---

## 3. Alur Utama Aplikasi

Alur utama pengguna:

```txt
User membuka aplikasi
↓
User register atau login
↓
User membuat profil usaha
↓
User masuk ke dashboard
↓
User mencatat transaksi
↓
User menambahkan produk
↓
User mencatat stok
↓
User melihat laporan
↓
User bertanya kepada AI assistant
```

---

## 4. User Flow: Register

### 4.1 Tujuan

Pengguna membuat akun agar data bisnisnya tersimpan secara pribadi.

### 4.2 Alur

```txt
User membuka halaman register
↓
User mengisi nama, email, dan password
↓
User klik tombol register
↓
Sistem membuat akun
↓
User diarahkan ke halaman pembuatan profil usaha
```

### 4.3 Data yang Dibutuhkan

- Nama pengguna
- Email
- Password

### 4.4 Kondisi Berhasil

- Akun berhasil dibuat
- User otomatis login atau diarahkan ke login
- User masuk ke proses onboarding profil usaha

### 4.5 Kondisi Gagal

- Email sudah digunakan
- Password terlalu pendek
- Format email tidak valid
- Koneksi gagal

---

## 5. User Flow: Login

### 5.1 Tujuan

Pengguna masuk ke aplikasi menggunakan akun yang sudah dibuat.

### 5.2 Alur

```txt
User membuka halaman login
↓
User mengisi email dan password
↓
User klik tombol login
↓
Sistem memverifikasi akun
↓
Jika berhasil, user masuk ke dashboard
```

### 5.3 Data yang Dibutuhkan

- Email
- Password

### 5.4 Kondisi Berhasil

- User berhasil login
- User diarahkan ke dashboard

### 5.5 Kondisi Gagal

- Email tidak ditemukan
- Password salah
- Akun belum terverifikasi
- Koneksi gagal

---

## 6. User Flow: Membuat Profil Usaha

### 6.1 Tujuan

Setelah register, pengguna perlu membuat profil usaha agar seluruh data transaksi dan produk terhubung ke usaha tersebut.

### 6.2 Alur

```txt
User login pertama kali
↓
Sistem mengecek apakah user sudah punya profil usaha
↓
Jika belum, user diarahkan ke halaman buat profil usaha
↓
User mengisi data usaha
↓
User klik simpan
↓
Sistem menyimpan profil usaha
↓
User diarahkan ke dashboard
```

### 6.3 Data yang Dibutuhkan

- Nama usaha
- Jenis usaha
- Mata uang
- Lokasi opsional

### 6.4 Contoh Data

```txt
Nama usaha : Warung Bu Ani
Jenis usaha: Makanan dan Minuman
Mata uang  : IDR
Lokasi     : Bandung
```

### 6.5 Kondisi Berhasil

- Profil usaha berhasil dibuat
- User bisa mengakses dashboard

### 6.6 Kondisi Gagal

- Nama usaha kosong
- Jenis usaha belum dipilih
- Gagal menyimpan data

---

## 7. User Flow: Dashboard

### 7.1 Tujuan

Dashboard memberikan ringkasan kondisi bisnis secara cepat.

### 7.2 Alur

```txt
User login
↓
Sistem mengambil data usaha
↓
Sistem menghitung ringkasan bisnis bulan ini
↓
Dashboard menampilkan data utama
```

### 7.3 Data yang Ditampilkan

- Total pemasukan bulan ini
- Total pengeluaran bulan ini
- Estimasi laba bulan ini
- Jumlah produk
- Produk stok rendah
- Transaksi terbaru

### 7.4 Contoh Tampilan Data

```txt
Pemasukan bulan ini   : Rp8.500.000
Pengeluaran bulan ini : Rp5.200.000
Estimasi laba         : Rp3.300.000
Produk stok rendah    : 3 produk
```

### 7.5 Aksi dari Dashboard

User bisa masuk ke:

- Tambah transaksi
- Daftar transaksi
- Produk
- Stok
- Laporan
- AI assistant

---

## 8. User Flow: Tambah Pemasukan

### 8.1 Tujuan

Pengguna mencatat uang masuk dari aktivitas bisnis.

### 8.2 Alur

```txt
User membuka halaman tambah transaksi
↓
User memilih jenis transaksi: Pemasukan
↓
User memilih kategori
↓
User mengisi nominal
↓
User mengisi deskripsi opsional
↓
User memilih tanggal transaksi
↓
User klik simpan
↓
Sistem menyimpan transaksi
↓
Dashboard dan laporan diperbarui
```

### 8.3 Data yang Dibutuhkan

- Jenis transaksi
- Kategori
- Nominal
- Deskripsi
- Tanggal transaksi

### 8.4 Contoh Data

```txt
Jenis     : Pemasukan
Kategori  : Penjualan produk
Nominal   : Rp25.000
Deskripsi : Jual nasi ayam 1 porsi
Tanggal   : 2026-06-22
```

### 8.5 Kondisi Berhasil

- Transaksi tersimpan
- Total pemasukan bertambah
- Estimasi laba diperbarui

### 8.6 Kondisi Gagal

- Nominal kosong
- Nominal bukan angka
- Kategori belum dipilih
- Gagal menyimpan data

---

## 9. User Flow: Tambah Pengeluaran

### 9.1 Tujuan

Pengguna mencatat uang keluar dari aktivitas bisnis.

### 9.2 Alur

```txt
User membuka halaman tambah transaksi
↓
User memilih jenis transaksi: Pengeluaran
↓
User memilih kategori
↓
User mengisi nominal
↓
User mengisi deskripsi opsional
↓
User memilih tanggal transaksi
↓
User klik simpan
↓
Sistem menyimpan transaksi
↓
Dashboard dan laporan diperbarui
```

### 9.3 Data yang Dibutuhkan

- Jenis transaksi
- Kategori
- Nominal
- Deskripsi
- Tanggal transaksi

### 9.4 Contoh Data

```txt
Jenis     : Pengeluaran
Kategori  : Belanja bahan
Nominal   : Rp120.000
Deskripsi : Beli ayam dan sayur
Tanggal   : 2026-06-22
```

### 9.5 Kondisi Berhasil

- Transaksi tersimpan
- Total pengeluaran bertambah
- Estimasi laba diperbarui

### 9.6 Kondisi Gagal

- Nominal kosong
- Nominal bukan angka
- Kategori belum dipilih
- Gagal menyimpan data

---

## 10. User Flow: Melihat Daftar Transaksi

### 10.1 Tujuan

Pengguna dapat melihat riwayat pemasukan dan pengeluaran.

### 10.2 Alur

```txt
User membuka halaman transaksi
↓
Sistem mengambil daftar transaksi
↓
User melihat transaksi terbaru
↓
User dapat melakukan filter
```

### 10.3 Filter yang Tersedia

- Berdasarkan tanggal
- Berdasarkan jenis transaksi
- Berdasarkan kategori

### 10.4 Aksi yang Tersedia

- Tambah transaksi
- Edit transaksi
- Hapus transaksi
- Filter transaksi

---

## 11. User Flow: Tambah Produk

### 11.1 Tujuan

Pengguna dapat menyimpan daftar produk yang dijual.

### 11.2 Alur

```txt
User membuka halaman produk
↓
User klik tambah produk
↓
User mengisi data produk
↓
User klik simpan
↓
Sistem menyimpan produk
↓
Produk muncul di daftar produk
```

### 11.3 Data yang Dibutuhkan

- Nama produk
- SKU opsional
- Harga modal
- Harga jual
- Stok saat ini
- Minimum stok

### 11.4 Contoh Data

```txt
Nama produk   : Es Kopi Susu
SKU           : EKS-001
Harga modal   : Rp8.000
Harga jual    : Rp15.000
Stok saat ini : 25
Minimum stok  : 10
```

### 11.5 Kondisi Berhasil

- Produk tersimpan
- Produk tampil di daftar produk
- Produk bisa digunakan dalam fitur stok

### 11.6 Kondisi Gagal

- Nama produk kosong
- Harga jual tidak valid
- Stok tidak valid
- Gagal menyimpan data

---

## 12. User Flow: Stok Masuk

### 12.1 Tujuan

Pengguna dapat menambahkan jumlah stok produk.

### 12.2 Alur

```txt
User membuka halaman stok
↓
User memilih produk
↓
User memilih jenis stok: Stok masuk
↓
User mengisi jumlah
↓
User mengisi catatan opsional
↓
User klik simpan
↓
Sistem menambahkan stok produk
↓
Sistem menyimpan riwayat stok
```

### 12.3 Contoh Data

```txt
Produk  : Es Kopi Susu
Jenis   : Stok masuk
Jumlah  : 20
Catatan : Produksi pagi
```

### 12.4 Kondisi Berhasil

- Stok produk bertambah
- Riwayat stok tercatat

---

## 13. User Flow: Stok Keluar

### 13.1 Tujuan

Pengguna dapat mengurangi jumlah stok produk.

### 13.2 Alur

```txt
User membuka halaman stok
↓
User memilih produk
↓
User memilih jenis stok: Stok keluar
↓
User mengisi jumlah
↓
User mengisi catatan opsional
↓
User klik simpan
↓
Sistem mengurangi stok produk
↓
Sistem menyimpan riwayat stok
```

### 13.3 Contoh Data

```txt
Produk  : Es Kopi Susu
Jenis   : Stok keluar
Jumlah  : 3
Catatan : Terjual offline
```

### 13.4 Kondisi Berhasil

- Stok produk berkurang
- Riwayat stok tercatat
- Jika stok berada di bawah minimum, produk ditandai sebagai stok rendah

### 13.5 Kondisi Gagal

- Jumlah stok kosong
- Jumlah stok bukan angka
- Jumlah stok keluar lebih besar dari stok tersedia
- Produk belum dipilih

---

## 14. User Flow: Laporan Laba

### 14.1 Tujuan

Pengguna dapat melihat estimasi laba bisnis dalam periode tertentu.

### 14.2 Alur

```txt
User membuka halaman laporan
↓
User memilih periode
↓
Sistem menghitung total pemasukan
↓
Sistem menghitung total pengeluaran
↓
Sistem menghitung estimasi laba
↓
Sistem menampilkan laporan
```

### 14.3 Rumus MVP

```txt
Total Pemasukan - Total Pengeluaran = Estimasi Laba
```

### 14.4 Contoh Data

```txt
Periode            : Juni 2026
Total pemasukan    : Rp8.500.000
Total pengeluaran  : Rp5.200.000
Estimasi laba      : Rp3.300.000
```

---

## 15. User Flow: AI Assistant

### 15.1 Tujuan

Pengguna dapat bertanya tentang kondisi bisnis menggunakan bahasa sederhana.

### 15.2 Alur

```txt
User membuka halaman AI Assistant
↓
User mengetik pertanyaan
↓
Sistem membaca pertanyaan
↓
Sistem mengambil data ringkasan bisnis yang relevan
↓
AI membuat jawaban berdasarkan data tersebut
↓
Jawaban ditampilkan ke user
```

### 15.3 Contoh Pertanyaan

- Bulan ini saya untung berapa?
- Pengeluaran terbesar saya apa?
- Produk apa yang stoknya hampir habis?
- Apakah bisnis saya membaik dibanding bulan lalu?
- Produk mana yang margin-nya paling besar?

### 15.4 Contoh Jawaban

```txt
Bulan ini pemasukan usaha kamu Rp8.500.000 dan pengeluaran Rp5.200.000.
Estimasi laba bulan ini adalah Rp3.300.000.

Pengeluaran terbesar berasal dari kategori Belanja bahan sebesar Rp2.100.000.
```

### 15.5 Batasan AI

- AI hanya menjawab berdasarkan data bisnis pengguna
- AI tidak boleh mengarang angka
- AI harus menjelaskan jika data belum cukup
- AI tidak memberikan nasihat legal, pajak, pinjaman, atau investasi
- AI menggunakan bahasa sederhana

---

## 16. Halaman yang Dibutuhkan MVP

Berdasarkan user flow, halaman awal yang dibutuhkan adalah:

```txt
/login
/register
/onboarding/business
/dashboard
/transactions
/transactions/new
/products
/products/new
/stocks
/reports/profit
/assistant
/settings
```

---

## 17. Navigasi Utama

Navigasi utama aplikasi:

```txt
Dashboard
Transaksi
Produk
Stok
Laporan
AI Assistant
Pengaturan
```

Untuk tampilan mobile, navigasi dapat dibuat sebagai bottom navigation:

```txt
Dashboard | Transaksi | Produk | Laporan | AI
```

Menu tambahan seperti Stok dan Pengaturan dapat ditempatkan di halaman Produk atau menu lainnya.

---

## 18. Catatan UX

Aplikasi harus dibuat mobile-first karena target pengguna kemungkinan lebih sering menggunakan HP.

Prinsip UX:

- Form singkat
- Tombol aksi jelas
- Bahasa sederhana
- Tidak terlalu banyak istilah akuntansi
- Input nominal mudah digunakan
- Dashboard langsung menunjukkan angka penting
- AI menjawab dengan kalimat praktis

---

## 19. Catatan

Dokumen ini dapat berubah mengikuti hasil validasi pengguna dan pengembangan MVP.