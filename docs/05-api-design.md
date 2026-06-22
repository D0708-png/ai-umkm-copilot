# API Design — AI UMKM Co-Pilot

## 1. Tujuan Dokumen

Dokumen ini menjelaskan rancangan API untuk aplikasi AI UMKM Co-Pilot.

API digunakan untuk menghubungkan frontend dengan data bisnis pengguna seperti profil usaha, transaksi, produk, stok, laporan, dan AI assistant.

Pada MVP, aplikasi akan menggunakan Next.js sebagai frontend dan backend. Database menggunakan Supabase PostgreSQL.

---

## 2. Prinsip API

API MVP mengikuti prinsip berikut:

1. Setiap request harus berasal dari user yang sudah login.
2. User hanya boleh mengakses data usaha miliknya sendiri.
3. API tidak boleh mengembalikan data user lain.
4. Validasi data dilakukan sebelum data disimpan.
5. Error message harus jelas dan mudah dipahami.
6. Data angka utama dihitung oleh sistem, bukan oleh AI.
7. AI hanya menerima ringkasan data bisnis yang sudah diproses sistem.

---

## 3. Format Response API

Format response sukses:

```json
{
  "success": true,
  "data": {}
}
```

Format response error:

```json
{
  "success": false,
  "message": "Pesan error yang mudah dipahami"
}
```

Contoh error:

```json
{
  "success": false,
  "message": "Nominal transaksi harus lebih besar dari 0"
}
```

---

## 4. Authentication

Authentication akan menggunakan Supabase Auth.

Fitur authentication:

- Register
- Login
- Logout
- Reset password
- Get current user session

Karena menggunakan Supabase Auth, sebagian besar proses authentication tidak perlu dibuat manual dari nol.

---

## 5. Business Profile API

Business Profile digunakan untuk menyimpan data usaha pengguna.

---

### 5.1 Get Current Business

Endpoint:

```txt
GET /api/business
```

Tujuan:

Mengambil profil usaha milik user yang sedang login.

Response sukses:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Warung Bu Ani",
    "business_type": "Makanan dan Minuman",
    "currency": "IDR",
    "location": "Bandung"
  }
}
```

Response jika belum punya usaha:

```json
{
  "success": true,
  "data": null
}
```

---

### 5.2 Create Business

Endpoint:

```txt
POST /api/business
```

Tujuan:

Membuat profil usaha baru untuk user.

Request body:

```json
{
  "name": "Warung Bu Ani",
  "business_type": "Makanan dan Minuman",
  "currency": "IDR",
  "location": "Bandung"
}
```

Validasi:

- name wajib diisi
- business_type wajib diisi
- currency default IDR jika kosong
- location opsional

Response sukses:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Warung Bu Ani",
    "business_type": "Makanan dan Minuman",
    "currency": "IDR",
    "location": "Bandung"
  }
}
```

---

### 5.3 Update Business

Endpoint:

```txt
PUT /api/business/:id
```

Tujuan:

Mengubah profil usaha.

Request body:

```json
{
  "name": "Warung Bu Ani",
  "business_type": "Makanan dan Minuman",
  "currency": "IDR",
  "location": "Bandung"
}
```

Response sukses:

```json
{
  "success": true,
  "message": "Profil usaha berhasil diperbarui"
}
```

---

## 6. Categories API

Categories digunakan untuk mengelompokkan transaksi pemasukan dan pengeluaran.

---

### 6.1 Get Categories

Endpoint:

```txt
GET /api/categories?type=income
GET /api/categories?type=expense
```

Tujuan:

Mengambil daftar kategori berdasarkan jenis transaksi.

Response sukses:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Penjualan produk",
      "type": "income"
    }
  ]
}
```

---

### 6.2 Create Category

Endpoint:

```txt
POST /api/categories
```

Request body:

```json
{
  "name": "Belanja bahan",
  "type": "expense"
}
```

Validasi:

- name wajib diisi
- type harus income atau expense

Response sukses:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Belanja bahan",
    "type": "expense"
  }
}
```

---

## 7. Transactions API

Transactions adalah API utama untuk mencatat pemasukan dan pengeluaran.

---

### 7.1 Get Transactions

Endpoint:

```txt
GET /api/transactions
```

Query params opsional:

```txt
type=income
type=expense
category_id=uuid
start_date=2026-06-01
end_date=2026-06-30
```

Contoh:

```txt
GET /api/transactions?type=expense&start_date=2026-06-01&end_date=2026-06-30
```

Response sukses:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "income",
      "category": {
        "id": "uuid",
        "name": "Penjualan produk"
      },
      "amount": 25000,
      "description": "Jual nasi ayam 1 porsi",
      "transaction_date": "2026-06-22"
    }
  ]
}
```

---

### 7.2 Create Transaction

Endpoint:

```txt
POST /api/transactions
```

Request body:

```json
{
  "type": "income",
  "category_id": "uuid",
  "amount": 25000,
  "description": "Jual nasi ayam 1 porsi",
  "transaction_date": "2026-06-22"
}
```

Validasi:

- type wajib income atau expense
- amount wajib lebih besar dari 0
- transaction_date wajib diisi
- category_id opsional, tetapi disarankan diisi
- description opsional

Response sukses:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "income",
    "amount": 25000,
    "description": "Jual nasi ayam 1 porsi",
    "transaction_date": "2026-06-22"
  }
}
```

---

### 7.3 Update Transaction

Endpoint:

```txt
PUT /api/transactions/:id
```

Request body:

```json
{
  "type": "expense",
  "category_id": "uuid",
  "amount": 120000,
  "description": "Beli ayam dan sayur",
  "transaction_date": "2026-06-22"
}
```

Response sukses:

```json
{
  "success": true,
  "message": "Transaksi berhasil diperbarui"
}
```

---

### 7.4 Delete Transaction

Endpoint:

```txt
DELETE /api/transactions/:id
```

Response sukses:

```json
{
  "success": true,
  "message": "Transaksi berhasil dihapus"
}
```

---

## 8. Products API

Products digunakan untuk mengelola daftar produk usaha.

---

### 8.1 Get Products

Endpoint:

```txt
GET /api/products
```

Response sukses:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Es Kopi Susu",
      "sku": "EKS-001",
      "cost_price": 8000,
      "selling_price": 15000,
      "current_stock": 25,
      "minimum_stock": 10
    }
  ]
}
```

---

### 8.2 Create Product

Endpoint:

```txt
POST /api/products
```

Request body:

```json
{
  "name": "Es Kopi Susu",
  "sku": "EKS-001",
  "cost_price": 8000,
  "selling_price": 15000,
  "current_stock": 25,
  "minimum_stock": 10
}
```

Validasi:

- name wajib diisi
- cost_price minimal 0
- selling_price minimal 0
- current_stock minimal 0
- minimum_stock minimal 0
- sku opsional

Response sukses:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Es Kopi Susu",
    "sku": "EKS-001",
    "cost_price": 8000,
    "selling_price": 15000,
    "current_stock": 25,
    "minimum_stock": 10
  }
}
```

---

### 8.3 Update Product

Endpoint:

```txt
PUT /api/products/:id
```

Request body:

```json
{
  "name": "Es Kopi Susu",
  "sku": "EKS-001",
  "cost_price": 8000,
  "selling_price": 15000,
  "minimum_stock": 10
}
```

Catatan:

`current_stock` sebaiknya tidak diedit langsung dari update product. Perubahan stok dilakukan lewat Stock Movement agar riwayat stok tetap tercatat.

Response sukses:

```json
{
  "success": true,
  "message": "Produk berhasil diperbarui"
}
```

---

### 8.4 Delete Product

Endpoint:

```txt
DELETE /api/products/:id
```

Response sukses:

```json
{
  "success": true,
  "message": "Produk berhasil dihapus"
}
```

---

## 9. Stock API

Stock API digunakan untuk mencatat stok masuk, stok keluar, dan penyesuaian stok.

---

### 9.1 Get Stock Movements

Endpoint:

```txt
GET /api/stocks/movements
```

Query params opsional:

```txt
product_id=uuid
start_date=2026-06-01
end_date=2026-06-30
```

Response sukses:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "product_name": "Es Kopi Susu",
      "type": "in",
      "quantity": 20,
      "note": "Produksi pagi",
      "created_at": "2026-06-22T08:00:00Z"
    }
  ]
}
```

---

### 9.2 Create Stock Movement

Endpoint:

```txt
POST /api/stocks/movements
```

Request body:

```json
{
  "product_id": "uuid",
  "type": "in",
  "quantity": 20,
  "note": "Produksi pagi"
}
```

Validasi:

- product_id wajib diisi
- type wajib in, out, atau adjustment
- quantity wajib lebih besar dari 0
- note opsional
- untuk type out, stok produk harus cukup

Response sukses:

```json
{
  "success": true,
  "message": "Perubahan stok berhasil disimpan"
}
```

Catatan proses:

1. Sistem menyimpan data ke `stock_movements`.
2. Sistem memperbarui `products.current_stock`.
3. Jika type `in`, stok bertambah.
4. Jika type `out`, stok berkurang.
5. Jika type `adjustment`, stok disesuaikan berdasarkan aturan implementasi.

---

### 9.3 Get Low Stock Products

Endpoint:

```txt
GET /api/stocks/low
```

Tujuan:

Mengambil daftar produk yang stoknya berada di bawah atau sama dengan minimum stok.

Response sukses:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Es Kopi Susu",
      "current_stock": 5,
      "minimum_stock": 10
    }
  ]
}
```

---

## 10. Dashboard API

Dashboard API digunakan untuk mengambil ringkasan bisnis.

---

### 10.1 Get Dashboard Summary

Endpoint:

```txt
GET /api/dashboard/summary
```

Query params opsional:

```txt
period=2026-06
```

Response sukses:

```json
{
  "success": true,
  "data": {
    "period": "2026-06",
    "total_income": 8500000,
    "total_expense": 5200000,
    "net_profit": 3300000,
    "product_count": 12,
    "low_stock_count": 3,
    "recent_transactions": [
      {
        "id": "uuid",
        "type": "income",
        "amount": 25000,
        "description": "Jual nasi ayam 1 porsi",
        "transaction_date": "2026-06-22"
      }
    ]
  }
}
```

---

## 11. Reports API

Reports API digunakan untuk laporan sederhana.

---

### 11.1 Get Profit Report

Endpoint:

```txt
GET /api/reports/profit
```

Query params:

```txt
start_date=2026-06-01
end_date=2026-06-30
```

Response sukses:

```json
{
  "success": true,
  "data": {
    "start_date": "2026-06-01",
    "end_date": "2026-06-30",
    "total_income": 8500000,
    "total_expense": 5200000,
    "net_profit": 3300000
  }
}
```

---

### 11.2 Get Expense By Category

Endpoint:

```txt
GET /api/reports/expenses-by-category
```

Query params:

```txt
start_date=2026-06-01
end_date=2026-06-30
```

Response sukses:

```json
{
  "success": true,
  "data": [
    {
      "category_name": "Belanja bahan",
      "total": 2100000
    },
    {
      "category_name": "Operasional",
      "total": 1200000
    }
  ]
}
```

---

## 12. AI Assistant API

AI Assistant API digunakan untuk menjawab pertanyaan pengguna berdasarkan data bisnis.

---

### 12.1 Send Message to AI Assistant

Endpoint:

```txt
POST /api/assistant/message
```

Request body:

```json
{
  "message": "Bulan ini saya untung berapa?"
}
```

Proses backend:

1. Validasi user login.
2. Ambil business milik user aktif.
3. Ambil ringkasan data bisnis.
4. Buat business summary context.
5. Kirim pertanyaan dan context ke AI.
6. Terima jawaban AI.
7. Kirim jawaban ke frontend.

Response sukses:

```json
{
  "success": true,
  "data": {
    "answer": "Bulan ini estimasi laba usaha kamu adalah Rp3.300.000. Angka ini berasal dari pemasukan Rp8.500.000 dikurangi pengeluaran Rp5.200.000."
  }
}
```

Response jika data belum cukup:

```json
{
  "success": true,
  "data": {
    "answer": "Saya belum bisa menghitung laba karena belum ada data pemasukan dan pengeluaran yang dicatat."
  }
}
```

---

### 12.2 Get AI Business Summary

Endpoint internal:

```txt
GET /api/assistant/summary
```

Tujuan:

Membuat ringkasan data bisnis yang akan diberikan ke AI.

Response contoh:

```json
{
  "success": true,
  "data": {
    "business_name": "Warung Bu Ani",
    "business_type": "Makanan dan Minuman",
    "period": "2026-06",
    "total_income": 8500000,
    "total_expense": 5200000,
    "net_profit": 3300000,
    "expense_by_category": [
      {
        "category_name": "Belanja bahan",
        "total": 2100000
      }
    ],
    "low_stock_products": [
      {
        "name": "Es Kopi Susu",
        "current_stock": 5,
        "minimum_stock": 10
      }
    ]
  }
}
```

Catatan:

Endpoint ini bersifat internal. Jika tidak dibutuhkan di frontend, logic-nya cukup dibuat sebagai service function, bukan endpoint publik.

---

## 13. Error Handling

Status error yang digunakan:

| Status | Arti |
|---|---|
| 400 | Request tidak valid |
| 401 | User belum login |
| 403 | Tidak punya akses |
| 404 | Data tidak ditemukan |
| 500 | Error server |

Contoh response 401:

```json
{
  "success": false,
  "message": "Kamu perlu login terlebih dahulu"
}
```

Contoh response 403:

```json
{
  "success": false,
  "message": "Kamu tidak memiliki akses ke data ini"
}
```

Contoh response 404:

```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

---

## 14. Validasi Input

Validasi umum:

### Business

- name tidak boleh kosong
- business_type tidak boleh kosong
- currency default IDR

### Transaction

- type harus income atau expense
- amount harus lebih besar dari 0
- transaction_date wajib diisi

### Product

- name tidak boleh kosong
- cost_price tidak boleh negatif
- selling_price tidak boleh negatif
- current_stock tidak boleh negatif
- minimum_stock tidak boleh negatif

### Stock Movement

- product_id wajib diisi
- type harus in, out, atau adjustment
- quantity harus lebih besar dari 0
- stok keluar tidak boleh lebih besar dari stok tersedia

### AI Assistant

- message tidak boleh kosong
- message maksimal 1000 karakter untuk MVP
- user harus sudah login
- business harus tersedia

---

## 15. Security

API harus memperhatikan keamanan berikut:

1. Semua endpoint utama harus memeriksa session user.
2. Semua query harus difilter berdasarkan business milik user.
3. Jangan menerima business_id dari frontend tanpa validasi.
4. Gunakan business_id dari data yang dimiliki user aktif.
5. Aktifkan Row Level Security di Supabase.
6. Jangan kirim API key AI ke frontend.
7. Jangan kirim data sensitif yang tidak diperlukan ke AI.
8. Validasi semua input dari user.

---

## 16. Struktur Folder API yang Disarankan

Jika menggunakan Next.js App Router:

```txt
src/
├── app/
│   ├── api/
│   │   ├── business/
│   │   │   └── route.ts
│   │   ├── categories/
│   │   │   └── route.ts
│   │   ├── transactions/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── stocks/
│   │   │   ├── low/
│   │   │   │   └── route.ts
│   │   │   └── movements/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   └── summary/
│   │   │       └── route.ts
│   │   ├── reports/
│   │   │   ├── profit/
│   │   │   │   └── route.ts
│   │   │   └── expenses-by-category/
│   │   │       └── route.ts
│   │   └── assistant/
│   │       ├── message/
│   │       │   └── route.ts
│   │       └── summary/
│   │           └── route.ts
│   ├── dashboard/
│   ├── transactions/
│   ├── products/
│   ├── stocks/
│   ├── reports/
│   └── assistant/
├── lib/
│   ├── supabase/
│   ├── services/
│   ├── validations/
│   └── utils/
└── types/
```

---

## 17. Service Layer yang Disarankan

Agar API route tidak terlalu penuh, logic bisnis sebaiknya dipisahkan ke service layer.

Contoh struktur:

```txt
src/lib/services/
├── business.service.ts
├── category.service.ts
├── transaction.service.ts
├── product.service.ts
├── stock.service.ts
├── dashboard.service.ts
├── report.service.ts
└── assistant.service.ts
```

Manfaat service layer:

- Logic lebih rapi
- Mudah dites
- Mudah dipakai ulang
- API route lebih singkat
- Perhitungan bisnis tidak tersebar di banyak file

---

## 18. Catatan Implementasi

Pada tahap coding, API Design ini bisa disesuaikan jika ada kebutuhan teknis.

Prioritas implementasi API:

1. Business Profile
2. Categories
3. Transactions
4. Dashboard Summary
5. Products
6. Stock Movements
7. Reports
8. AI Assistant

Untuk MVP, endpoint dibuat sederhana terlebih dahulu. Optimasi dan fitur lanjutan dilakukan setelah alur utama berjalan.