# AI Design — AI UMKM Co-Pilot

## 1. Tujuan Dokumen

Dokumen ini menjelaskan rancangan fitur AI Assistant pada aplikasi AI UMKM Co-Pilot.

AI Assistant dibuat untuk membantu pemilik UMKM memahami kondisi bisnisnya menggunakan bahasa sederhana.

AI tidak bertugas menggantikan akuntan, konsultan pajak, penasihat hukum, atau penasihat keuangan profesional. AI hanya membantu membaca dan menjelaskan data usaha yang sudah dicatat oleh pengguna.

---

## 2. Tujuan AI Assistant

AI Assistant memiliki tujuan utama:

- Menjawab pertanyaan pengguna tentang kondisi bisnis
- Menjelaskan data keuangan dengan bahasa sederhana
- Membantu pengguna memahami pemasukan, pengeluaran, laba, dan stok
- Memberikan insight ringan berdasarkan data
- Mengingatkan jika data belum cukup
- Membantu pengguna mengambil keputusan operasional sederhana

---

## 3. Prinsip Utama AI

AI Assistant harus mengikuti prinsip berikut:

1. AI hanya menjawab berdasarkan data yang tersedia.
2. AI tidak boleh mengarang angka.
3. AI harus menjelaskan jika data belum cukup.
4. AI menggunakan bahasa sederhana.
5. AI tidak menggunakan istilah akuntansi rumit jika tidak diperlukan.
6. AI tidak memberikan saran legal, pajak, pinjaman, atau investasi berisiko.
7. AI harus menjelaskan sumber perhitungan secara singkat.
8. AI harus mendorong pengguna untuk mencatat data lebih lengkap.

---

## 4. Batasan AI

AI Assistant pada MVP tidak boleh melakukan hal berikut:

- Memberikan diagnosis legal atau pajak
- Menyarankan pinjaman tertentu
- Menjamin keuntungan bisnis
- Membuat prediksi yang terlalu pasti
- Mengarang data transaksi
- Mengakses data pengguna lain
- Mengambil keputusan otomatis tanpa persetujuan pengguna
- Menghapus, mengubah, atau membuat transaksi tanpa konfirmasi
- Membaca seluruh database secara bebas tanpa filter

---

## 5. Jenis Pertanyaan yang Didukung MVP

AI Assistant MVP akan mendukung pertanyaan seperti:

### 5.1 Pertanyaan Keuangan

Contoh:

```txt
Bulan ini saya untung berapa?
Pemasukan bulan ini berapa?
Pengeluaran bulan ini berapa?
Apakah bisnis saya rugi?
Apakah bulan ini lebih baik dari bulan lalu?
```

### 5.2 Pertanyaan Pengeluaran

Contoh:

```txt
Pengeluaran terbesar saya apa?
Kategori pengeluaran paling besar apa?
Kenapa pengeluaran bulan ini besar?
Pengeluaran operasional saya berapa?
```

### 5.3 Pertanyaan Produk dan Stok

Contoh:

```txt
Produk apa yang stoknya hampir habis?
Produk mana yang harus segera restock?
Produk mana yang margin-nya paling besar?
Produk apa yang stoknya masih banyak?
```

### 5.4 Pertanyaan Rekomendasi Ringan

Contoh:

```txt
Apa yang harus saya perbaiki dari bisnis saya?
Bagaimana cara mengurangi pengeluaran?
Produk mana yang sebaiknya saya perhatikan?
Apa insight bisnis saya bulan ini?
```

---

## 6. Jenis Pertanyaan yang Tidak Didukung MVP

AI Assistant MVP belum mendukung:

```txt
Buatkan laporan pajak resmi
Ajukan pinjaman untuk saya
Prediksi omzet 1 tahun ke depan secara pasti
Hubungkan ke rekening bank
Ambil data dari marketplace
Kirim pesan WhatsApp ke pelanggan
Buat invoice otomatis
Hitung gaji karyawan
```

Jika pengguna bertanya di luar cakupan, AI harus menjawab dengan sopan dan menjelaskan batasannya.

Contoh jawaban:

```txt
Saat ini saya belum bisa membantu membuat laporan pajak resmi. 
Namun, saya bisa membantu merangkum pemasukan dan pengeluaran usaha kamu sebagai bahan awal pencatatan.
```

---

## 7. Data yang Digunakan AI

AI tidak langsung membaca semua data mentah secara bebas.

Sistem akan membuat ringkasan data terlebih dahulu, lalu ringkasan itu diberikan ke AI sebagai konteks.

Data ringkasan yang dapat digunakan:

- Nama usaha
- Jenis usaha
- Periode laporan
- Total pemasukan
- Total pengeluaran
- Estimasi laba
- Perbandingan bulan ini dan bulan lalu
- Pengeluaran terbesar berdasarkan kategori
- Produk stok rendah
- Produk dengan margin terbesar
- Jumlah transaksi
- Transaksi terbaru dalam jumlah terbatas

---

## 8. Contoh Business Summary Context

Contoh data ringkasan yang dikirim ke AI:

```txt
Nama usaha: Warung Bu Ani
Jenis usaha: Makanan dan Minuman
Periode: Juni 2026

Total pemasukan bulan ini: Rp8.500.000
Total pengeluaran bulan ini: Rp5.200.000
Estimasi laba bulan ini: Rp3.300.000

Total pemasukan bulan lalu: Rp7.000.000
Total pengeluaran bulan lalu: Rp4.900.000
Estimasi laba bulan lalu: Rp2.100.000

Pengeluaran terbesar bulan ini:
1. Belanja bahan: Rp2.100.000
2. Operasional: Rp1.200.000
3. Transportasi: Rp500.000

Produk stok rendah:
1. Es Kopi Susu — stok 5, minimum 10
2. Roti Bakar — stok 3, minimum 5

Produk dengan margin terbesar:
1. Es Kopi Susu — margin Rp7.000
2. Nasi Ayam — margin Rp8.000
```

AI hanya boleh menggunakan data tersebut untuk menjawab.

---

## 9. Alur Kerja AI Assistant

Alur kerja AI:

```txt
User membuka halaman AI Assistant
↓
User mengetik pertanyaan
↓
Sistem membaca pertanyaan
↓
Sistem menentukan jenis pertanyaan
↓
Sistem mengambil ringkasan data yang relevan
↓
Sistem membuat prompt untuk AI
↓
AI menjawab berdasarkan ringkasan data
↓
Jawaban ditampilkan ke user
```

---

## 10. Intent Pertanyaan

Untuk MVP, pertanyaan pengguna dapat dikelompokkan menjadi beberapa intent sederhana:

| Intent | Tujuan |
|---|---|
| profit_summary | Menjawab laba, pemasukan, dan pengeluaran |
| expense_analysis | Menjawab pengeluaran terbesar |
| stock_analysis | Menjawab stok rendah dan restock |
| product_margin | Menjawab margin produk |
| business_comparison | Membandingkan bulan ini dan bulan lalu |
| general_advice | Memberikan insight ringan |
| unsupported | Pertanyaan di luar cakupan MVP |

---

## 11. Contoh Mapping Intent

### 11.1 profit_summary

Pertanyaan:

```txt
Bulan ini saya untung berapa?
```

Data yang dibutuhkan:

```txt
total_income
total_expense
net_profit
period
```

Jawaban:

```txt
Bulan ini pemasukan usaha kamu Rp8.500.000 dan pengeluaran Rp5.200.000.
Estimasi laba bulan ini adalah Rp3.300.000.

Rumus yang digunakan:
Pemasukan - Pengeluaran = Estimasi Laba
```

---

### 11.2 expense_analysis

Pertanyaan:

```txt
Pengeluaran terbesar saya apa?
```

Data yang dibutuhkan:

```txt
expense_by_category
period
```

Jawaban:

```txt
Pengeluaran terbesar kamu bulan ini berasal dari kategori Belanja bahan sebesar Rp2.100.000.

Kategori terbesar berikutnya adalah Operasional sebesar Rp1.200.000 dan Transportasi sebesar Rp500.000.
```

---

### 11.3 stock_analysis

Pertanyaan:

```txt
Produk apa yang harus restock?
```

Data yang dibutuhkan:

```txt
low_stock_products
```

Jawaban:

```txt
Ada 2 produk yang perlu kamu perhatikan:

1. Es Kopi Susu, stok saat ini 5 dan minimum stok 10.
2. Roti Bakar, stok saat ini 3 dan minimum stok 5.

Sebaiknya produk ini segera dicek agar tidak kehabisan stok.
```

---

### 11.4 business_comparison

Pertanyaan:

```txt
Apakah bulan ini lebih baik dari bulan lalu?
```

Data yang dibutuhkan:

```txt
current_month_income
current_month_expense
current_month_profit
previous_month_income
previous_month_expense
previous_month_profit
```

Jawaban:

```txt
Bulan ini terlihat lebih baik dibanding bulan lalu.

Estimasi laba bulan ini Rp3.300.000, sedangkan bulan lalu Rp2.100.000.
Artinya laba naik sekitar Rp1.200.000.

Namun, pengeluaran juga perlu tetap dipantau agar kenaikan laba tetap sehat.
```

---

## 12. Prompt System Awal

System prompt adalah instruksi utama untuk AI.

Draft system prompt:

```txt
Kamu adalah AI Business Assistant untuk aplikasi AI UMKM Co-Pilot.

Tugasmu adalah membantu pemilik UMKM memahami kondisi bisnisnya berdasarkan data yang diberikan oleh sistem.

Aturan:
1. Jawab hanya berdasarkan data yang tersedia.
2. Jangan mengarang angka, transaksi, produk, atau kategori.
3. Jika data tidak cukup, katakan bahwa data belum cukup.
4. Gunakan bahasa Indonesia yang sederhana dan ramah.
5. Hindari istilah akuntansi rumit.
6. Jangan memberikan nasihat legal, pajak, pinjaman, atau investasi berisiko.
7. Jelaskan perhitungan secara singkat jika ada angka.
8. Berikan saran praktis yang aman dan mudah dilakukan.
9. Jangan menyebut bahwa kamu memiliki akses langsung ke database.
10. Jika pertanyaan di luar cakupan aplikasi, jelaskan batasanmu dengan sopan.
```

---

## 13. Template Prompt ke AI

Template prompt yang dikirim ke AI:

```txt
System:
Kamu adalah AI Business Assistant untuk aplikasi AI UMKM Co-Pilot.
Jawab hanya berdasarkan data yang diberikan.

Business Summary:
{{business_summary}}

User Question:
{{user_question}}

Instruction:
Jawab dengan bahasa Indonesia sederhana.
Jika data tidak cukup, jelaskan data apa yang perlu dicatat terlebih dahulu.
Jangan mengarang angka.
```

---

## 14. Contoh Prompt Lengkap

```txt
System:
Kamu adalah AI Business Assistant untuk aplikasi AI UMKM Co-Pilot.
Jawab hanya berdasarkan data yang diberikan.

Business Summary:
Nama usaha: Warung Bu Ani
Jenis usaha: Makanan dan Minuman
Periode: Juni 2026
Total pemasukan bulan ini: Rp8.500.000
Total pengeluaran bulan ini: Rp5.200.000
Estimasi laba bulan ini: Rp3.300.000
Pengeluaran terbesar:
1. Belanja bahan: Rp2.100.000
2. Operasional: Rp1.200.000
Produk stok rendah:
1. Es Kopi Susu — stok 5, minimum 10

User Question:
Bulan ini saya untung berapa?

Instruction:
Jawab dengan bahasa Indonesia sederhana.
Jika data tidak cukup, jelaskan data apa yang perlu dicatat terlebih dahulu.
Jangan mengarang angka.
```

Contoh output:

```txt
Bulan ini estimasi laba usaha kamu adalah Rp3.300.000.

Angka ini berasal dari:
Pemasukan Rp8.500.000 - Pengeluaran Rp5.200.000 = Rp3.300.000.

Secara sederhana, bulan ini usaha kamu masih untung berdasarkan data yang sudah dicatat.
```

---

## 15. Handling Data Tidak Cukup

Jika data belum tersedia, AI harus menjawab dengan jelas.

Contoh:

Pertanyaan:

```txt
Bulan ini saya untung berapa?
```

Jika belum ada transaksi:

```txt
Saya belum bisa menghitung laba bulan ini karena belum ada data pemasukan dan pengeluaran yang dicatat.

Mulai catat transaksi harian terlebih dahulu, lalu saya bisa bantu menghitung estimasi laba usaha kamu.
```

---

## 16. Handling Pertanyaan Berisiko

Contoh pertanyaan:

```txt
Apakah saya harus ambil pinjaman 50 juta?
```

Jawaban yang aman:

```txt
Saya belum bisa menentukan apakah kamu harus mengambil pinjaman.

Saya bisa membantu melihat kondisi pemasukan, pengeluaran, dan estimasi laba usaha kamu. Untuk keputusan pinjaman, sebaiknya pertimbangkan kemampuan bayar, risiko usaha, dan konsultasikan dengan pihak keuangan yang terpercaya.
```

---

## 17. Format Jawaban AI

Jawaban AI sebaiknya menggunakan format:

```txt
Jawaban utama
↓
Penjelasan angka
↓
Insight singkat
↓
Saran aman jika diperlukan
```

Contoh:

```txt
Bulan ini estimasi laba usaha kamu adalah Rp3.300.000.

Perhitungannya:
Pemasukan Rp8.500.000 - Pengeluaran Rp5.200.000 = Rp3.300.000.

Insight:
Usaha kamu masih untung bulan ini. Pengeluaran terbesar berasal dari Belanja bahan, jadi bagian ini bisa kamu pantau lebih rutin.
```

---

## 18. Data Privacy

AI Assistant harus memperhatikan privasi data pengguna.

Aturan:

- Data user tidak boleh dicampur dengan data user lain
- Setiap permintaan AI harus menggunakan business_id milik user aktif
- AI hanya menerima data ringkasan yang relevan
- Jangan mengirim data sensitif yang tidak diperlukan
- Jangan menyimpan percakapan AI tanpa kebutuhan produk yang jelas

---

## 19. Error Handling

Jika AI gagal menjawab karena error sistem:

```txt
Maaf, saya belum bisa menjawab saat ini karena terjadi kendala sistem. Coba beberapa saat lagi.
```

Jika data bisnis gagal dimuat:

```txt
Saya belum bisa membaca data bisnis kamu saat ini. Coba muat ulang halaman atau periksa koneksi.
```

Jika pertanyaan terlalu umum:

```txt
Bisa saya bantu. Untuk jawaban yang lebih tepat, coba tanyakan tentang pemasukan, pengeluaran, laba, stok, atau produk usaha kamu.
```

---

## 20. Roadmap AI Setelah MVP

Fitur AI yang bisa ditambahkan setelah MVP:

- Scan struk dan ekstraksi otomatis
- Input transaksi lewat chat
- Rekomendasi harga jual
- Prediksi stok habis
- Rekomendasi restock
- Ringkasan mingguan otomatis
- Analisis pelanggan
- Analisis produk paling laku
- Rekomendasi penghematan biaya
- Pembuatan laporan PDF sederhana
- Integrasi WhatsApp untuk pencatatan cepat

---

## 21. Catatan Implementasi

Pada tahap implementasi awal:

- AI Assistant dibuat sebagai halaman chat sederhana
- Sistem membuat business summary terlebih dahulu
- AI menjawab berdasarkan business summary
- Semua perhitungan angka utama dilakukan oleh sistem, bukan oleh AI
- AI hanya menjelaskan dan memberi insight berdasarkan hasil perhitungan sistem

Dokumen ini akan diperbarui saat implementasi AI dimulai.