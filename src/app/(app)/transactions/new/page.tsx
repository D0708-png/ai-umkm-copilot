import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { createTransaction } from "@/lib/actions/transaction";
import { getTransactionFormData } from "@/lib/services/transaction.service";

type NewTransactionPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewTransactionPage({
  searchParams,
}: NewTransactionPageProps) {
  const params = await searchParams;
  const { user, business, categories } = await getTransactionFormData();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const incomeCategories = categories.filter(
    (category) => category.type === "income"
  );

  const expenseCategories = categories.filter(
    (category) => category.type === "expense"
  );

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section
      className="content-section is-active"
      id="transaksi-baru"
      data-title="Tambah Transaksi"
      data-desc={`Catat pemasukan atau pengeluaran untuk ${business.name}.`}
    >
      {params.error ? (
        <div className="card" style={{ marginBottom: 18, padding: 16 }}>
          <p style={{ color: "#b91c1c", fontWeight: 800 }}>{params.error}</p>
        </div>
      ) : null}

      <div className="grid stock-grid">
        <article className="card form-card hover-card">
          <div>
            <h2>Form Transaksi</h2>
            <p>
              Masukkan data transaksi harian. Nominal akan otomatis diformat
              seperti 140.500.
            </p>
          </div>

          <form action={createTransaction} className="form-card" style={{ padding: 0 }}>
            <div className="field">
              <label htmlFor="type">Jenis Transaksi</label>
              <select id="type" name="type" required defaultValue="income">
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="category_id">Kategori</label>
              <select id="category_id" name="category_id" defaultValue="">
                <option value="">Tanpa kategori</option>

                {incomeCategories.length > 0 ? (
                  <optgroup label="Pemasukan">
                    {incomeCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null}

                {expenseCategories.length > 0 ? (
                  <optgroup label="Pengeluaran">
                    {expenseCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </select>
            </div>

            <div className="field">
              <label htmlFor="amount">Nominal</label>
              <CurrencyInput
                id="amount"
                name="amount"
                placeholder="Contoh: 140.500"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="description">Deskripsi</label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="Contoh: Jual 43 cup Es Kopi Susu"
              />
            </div>

            <div className="field">
              <label htmlFor="transaction_date">Tanggal Transaksi</label>
              <input
                id="transaction_date"
                name="transaction_date"
                type="date"
                required
                defaultValue={today}
              />
            </div>

            <button className="primary-button" type="submit">
              <Save />
              Simpan Transaksi
            </button>
          </form>
        </article>

        <article className="card hover-card">
          <div className="panel-header">
            <div>
              <h2>Panduan Input</h2>
              <p>
                Form ini tetap memakai logic Supabase yang sama, hanya UI-nya
                disesuaikan dengan prototype.
              </p>
            </div>
          </div>

          <div className="stock-list">
            <div className="stock-row">
              <div className="row-title">
                <strong>Nominal otomatis rapi</strong>
                <small>
                  Ketik 140500, sistem akan membaca sebagai 140.500.
                </small>
                <div className="bar">
                  <span style={{ "--w": "100%", "--bar": "var(--emerald)" } as React.CSSProperties} />
                </div>
              </div>
              <span className="tag income">Aktif</span>
            </div>

            <div className="stock-row">
              <div className="row-title">
                <strong>Validasi nominal</strong>
                <small>
                  Nominal kosong, 0, atau negatif akan ditolak oleh server.
                </small>
                <div className="bar">
                  <span style={{ "--w": "100%", "--bar": "var(--amber)" } as React.CSSProperties} />
                </div>
              </div>
              <span className="tag warning">Aman</span>
            </div>

            <div className="stock-row">
              <div className="row-title">
                <strong>Kategori harus sesuai</strong>
                <small>
                  Kategori pemasukan hanya untuk pemasukan, kategori pengeluaran
                  hanya untuk pengeluaran.
                </small>
                <div className="bar">
                  <span style={{ "--w": "100%", "--bar": "var(--teal)" } as React.CSSProperties} />
                </div>
              </div>
              <span className="tag info">RLS</span>
            </div>

            <Link href="/transactions" className="ghost-button">
              <ArrowLeft />
              Kembali ke Transaksi
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}