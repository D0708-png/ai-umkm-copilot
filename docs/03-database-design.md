# Database Design — AI UMKM Co-Pilot

## 1. Tujuan Dokumen

Dokumen ini menjelaskan desain database awal untuk aplikasi AI UMKM Co-Pilot.

Database digunakan untuk menyimpan data:

- Pengguna
- Profil usaha
- Kategori transaksi
- Transaksi pemasukan dan pengeluaran
- Produk
- Pergerakan stok
- Ringkasan data yang akan digunakan oleh AI assistant

Database utama yang digunakan adalah PostgreSQL melalui Supabase.

---

## 2. Prinsip Desain Database

Desain database MVP mengikuti prinsip berikut:

1. Setiap user hanya boleh mengakses data miliknya sendiri.
2. Satu user dapat memiliki satu atau lebih usaha.
3. Setiap transaksi harus terhubung ke satu usaha.
4. Setiap produk harus terhubung ke satu usaha.
5. Perubahan stok harus tercatat sebagai riwayat.
6. AI assistant tidak mengambil data sembarangan, tetapi menggunakan data ringkasan dari sistem.
7. Struktur dibuat sederhana agar mudah dikembangkan.

---

## 3. Entity Relationship Overview

Relasi utama:

```txt
auth.users
   ↓
businesses
   ↓
categories
   ↓
transactions

businesses
   ↓
products
   ↓
stock_movements
```

Penjelasan:

- `auth.users` disediakan oleh Supabase Auth.
- `businesses` menyimpan profil usaha.
- `categories` menyimpan kategori pemasukan dan pengeluaran.
- `transactions` menyimpan pemasukan dan pengeluaran.
- `products` menyimpan produk usaha.
- `stock_movements` menyimpan riwayat stok masuk, stok keluar, dan penyesuaian stok.

---

## 4. Tabel: auth.users

Tabel ini disediakan otomatis oleh Supabase Auth.

Kita tidak membuat tabel ini secara manual.

Data penting yang digunakan:

```txt
id
email
created_at
```

`id` dari `auth.users` akan digunakan sebagai `owner_id` di tabel `businesses`.

---

## 5. Tabel: businesses

Tabel `businesses` menyimpan profil usaha milik user.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | uuid | yes | Primary key |
| owner_id | uuid | yes | ID user dari Supabase Auth |
| name | text | yes | Nama usaha |
| business_type | text | yes | Jenis usaha |
| currency | text | yes | Mata uang, default IDR |
| location | text | no | Lokasi usaha |
| created_at | timestamptz | yes | Waktu data dibuat |
| updated_at | timestamptz | yes | Waktu data diperbarui |

### Contoh Data

```txt
id            : uuid
owner_id      : uuid user
name          : Warung Bu Ani
business_type : Makanan dan Minuman
currency      : IDR
location      : Bandung
```

---

## 6. Tabel: categories

Tabel `categories` menyimpan kategori transaksi.

Kategori akan dibedakan menjadi:

- income
- expense

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | uuid | yes | Primary key |
| business_id | uuid | yes | Relasi ke businesses |
| name | text | yes | Nama kategori |
| type | text | yes | income atau expense |
| created_at | timestamptz | yes | Waktu data dibuat |
| updated_at | timestamptz | yes | Waktu data diperbarui |

### Contoh Kategori Income

```txt
Penjualan produk
Jasa
Pendapatan lain
```

### Contoh Kategori Expense

```txt
Belanja bahan
Operasional
Transportasi
Gaji
Sewa
Listrik
Internet
Lainnya
```

---

## 7. Tabel: transactions

Tabel `transactions` menyimpan data pemasukan dan pengeluaran usaha.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | uuid | yes | Primary key |
| business_id | uuid | yes | Relasi ke businesses |
| category_id | uuid | no | Relasi ke categories |
| type | text | yes | income atau expense |
| amount | numeric | yes | Nominal transaksi |
| description | text | no | Catatan transaksi |
| transaction_date | date | yes | Tanggal transaksi |
| created_at | timestamptz | yes | Waktu data dibuat |
| updated_at | timestamptz | yes | Waktu data diperbarui |

### Contoh Data Pemasukan

```txt
type             : income
category         : Penjualan produk
amount           : 25000
description      : Jual nasi ayam 1 porsi
transaction_date : 2026-06-22
```

### Contoh Data Pengeluaran

```txt
type             : expense
category         : Belanja bahan
amount           : 120000
description      : Beli ayam dan sayur
transaction_date : 2026-06-22
```

---

## 8. Tabel: products

Tabel `products` menyimpan daftar produk yang dijual oleh usaha.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | uuid | yes | Primary key |
| business_id | uuid | yes | Relasi ke businesses |
| name | text | yes | Nama produk |
| sku | text | no | Kode produk opsional |
| cost_price | numeric | yes | Harga modal |
| selling_price | numeric | yes | Harga jual |
| current_stock | integer | yes | Stok saat ini |
| minimum_stock | integer | yes | Batas minimum stok |
| created_at | timestamptz | yes | Waktu data dibuat |
| updated_at | timestamptz | yes | Waktu data diperbarui |

### Contoh Data

```txt
name          : Es Kopi Susu
sku           : EKS-001
cost_price    : 8000
selling_price : 15000
current_stock : 25
minimum_stock : 10
```

---

## 9. Tabel: stock_movements

Tabel `stock_movements` menyimpan riwayat perubahan stok.

Jenis pergerakan stok:

- in
- out
- adjustment

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | uuid | yes | Primary key |
| business_id | uuid | yes | Relasi ke businesses |
| product_id | uuid | yes | Relasi ke products |
| type | text | yes | in, out, atau adjustment |
| quantity | integer | yes | Jumlah stok |
| note | text | no | Catatan stok |
| created_at | timestamptz | yes | Waktu data dibuat |

### Contoh Stok Masuk

```txt
product  : Es Kopi Susu
type     : in
quantity : 20
note     : Produksi pagi
```

### Contoh Stok Keluar

```txt
product  : Es Kopi Susu
type     : out
quantity : 3
note     : Terjual offline
```

---

## 10. Relasi Antar Tabel

### businesses

```txt
businesses.owner_id → auth.users.id
```

Satu user dapat memiliki banyak usaha.

### categories

```txt
categories.business_id → businesses.id
```

Satu usaha dapat memiliki banyak kategori.

### transactions

```txt
transactions.business_id → businesses.id
transactions.category_id → categories.id
```

Satu usaha dapat memiliki banyak transaksi.

### products

```txt
products.business_id → businesses.id
```

Satu usaha dapat memiliki banyak produk.

### stock_movements

```txt
stock_movements.business_id → businesses.id
stock_movements.product_id → products.id
```

Satu produk dapat memiliki banyak riwayat stok.

---

## 11. Aturan Data

### 11.1 Transaction Type

Nilai yang diperbolehkan:

```txt
income
expense
```

### 11.2 Category Type

Nilai yang diperbolehkan:

```txt
income
expense
```

### 11.3 Stock Movement Type

Nilai yang diperbolehkan:

```txt
in
out
adjustment
```

### 11.4 Amount

Nominal transaksi tidak boleh kurang dari atau sama dengan 0.

### 11.5 Stock Quantity

Jumlah stok tidak boleh kurang dari 0.

Untuk stok keluar, sistem harus memastikan stok tersedia cukup sebelum mengurangi stok.

---

## 12. Query Ringkasan Bisnis

Query ringkasan ini akan dipakai oleh dashboard dan AI assistant.

### Total Pemasukan Bulan Ini

```sql
select coalesce(sum(amount), 0) as total_income
from transactions
where business_id = :business_id
  and type = 'income'
  and transaction_date >= :start_date
  and transaction_date <= :end_date;
```

### Total Pengeluaran Bulan Ini

```sql
select coalesce(sum(amount), 0) as total_expense
from transactions
where business_id = :business_id
  and type = 'expense'
  and transaction_date >= :start_date
  and transaction_date <= :end_date;
```

### Estimasi Laba

```txt
total_income - total_expense = net_profit
```

### Produk Stok Rendah

```sql
select *
from products
where business_id = :business_id
  and current_stock <= minimum_stock;
```

### Pengeluaran per Kategori

```sql
select c.name, coalesce(sum(t.amount), 0) as total
from transactions t
left join categories c on c.id = t.category_id
where t.business_id = :business_id
  and t.type = 'expense'
  and t.transaction_date >= :start_date
  and t.transaction_date <= :end_date
group by c.name
order by total desc;
```

---

## 13. Draft SQL Schema

Draft ini akan digunakan saat membuat tabel di Supabase.

```sql
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  business_type text not null,
  currency text not null default 'IDR',
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14, 2) not null check (amount > 0),
  description text,
  transaction_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  sku text,
  cost_price numeric(14, 2) not null default 0 check (cost_price >= 0),
  selling_price numeric(14, 2) not null default 0 check (selling_price >= 0),
  current_stock integer not null default 0 check (current_stock >= 0),
  minimum_stock integer not null default 0 check (minimum_stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  type text not null check (type in ('in', 'out', 'adjustment')),
  quantity integer not null check (quantity > 0),
  note text,
  created_at timestamptz not null default now()
);
```

---

## 14. Index yang Dibutuhkan

Index membantu query dashboard dan laporan berjalan lebih cepat.

```sql
create index idx_businesses_owner_id on businesses(owner_id);

create index idx_categories_business_id on categories(business_id);
create index idx_categories_type on categories(type);

create index idx_transactions_business_id on transactions(business_id);
create index idx_transactions_type on transactions(type);
create index idx_transactions_transaction_date on transactions(transaction_date);

create index idx_products_business_id on products(business_id);
create index idx_products_stock_status on products(business_id, current_stock, minimum_stock);

create index idx_stock_movements_business_id on stock_movements(business_id);
create index idx_stock_movements_product_id on stock_movements(product_id);
```

---

## 15. Row Level Security

Karena aplikasi menggunakan Supabase, setiap tabel harus menggunakan Row Level Security atau RLS.

Tujuan RLS:

- User hanya bisa melihat data miliknya sendiri
- User hanya bisa membuat data untuk usahanya sendiri
- User tidak bisa mengakses data usaha milik user lain

RLS akan dibuat untuk tabel:

- businesses
- categories
- transactions
- products
- stock_movements

Contoh konsep policy:

```txt
User dapat mengakses data jika business.owner_id sama dengan auth.uid()
```

RLS detail akan dibuat pada tahap implementasi Supabase.

---

## 16. Seed Data Awal

Seed data digunakan untuk testing.

### Kategori Default Income

```txt
Penjualan produk
Jasa
Pendapatan lain
```

### Kategori Default Expense

```txt
Belanja bahan
Operasional
Transportasi
Gaji
Sewa
Listrik
Internet
Lainnya
```

### Produk Demo

```txt
Es Kopi Susu
Nasi Ayam
Roti Bakar
```

### Transaksi Demo

```txt
Pemasukan: Jual Es Kopi Susu Rp15.000
Pemasukan: Jual Nasi Ayam Rp25.000
Pengeluaran: Beli bahan baku Rp120.000
Pengeluaran: Bayar listrik Rp300.000
```

---

## 17. Data untuk AI Assistant

AI assistant tidak langsung membaca semua tabel secara bebas.

Sistem akan membuat ringkasan data terlebih dahulu, misalnya:

```txt
Periode: Juni 2026

Total pemasukan: Rp8.500.000
Total pengeluaran: Rp5.200.000
Estimasi laba: Rp3.300.000

Pengeluaran terbesar:
1. Belanja bahan: Rp2.100.000
2. Operasional: Rp1.200.000
3. Transportasi: Rp500.000

Produk stok rendah:
1. Es Kopi Susu: stok 5, minimum 10
2. Roti Bakar: stok 3, minimum 5
```

AI hanya boleh menjawab berdasarkan ringkasan tersebut.

---

## 18. Catatan Pengembangan

Untuk MVP, desain database dibuat sederhana.

Fitur yang belum dimasukkan ke database MVP:

- Invoice
- Hutang piutang
- Pelanggan
- Supplier
- Payment gateway
- Integrasi marketplace
- Multi-cabang
- Payroll
- Pajak
- Subscription atau billing aplikasi

Fitur tersebut dapat ditambahkan setelah MVP valid.