import Link from "next/link";
import { redirect } from "next/navigation";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Plus, Trash2 } from "lucide-react";
import { deleteTransaction } from "@/lib/actions/transaction";
import { getTransactionsPageData } from "@/lib/services/transaction.service";

type TransactionsPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

const rupiah = new Intl.NumberFormat("id-ID");

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const params = await searchParams;
  const { user, business, transactions, summary } =
    await getTransactionsPageData();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  return (
    <section
      className="content-section is-active"
      id="transaksi"
      data-title="Transaksi"
      data-desc={`Catat dan pantau pemasukan serta pengeluaran ${business.name}.`}
    >
      {params.message ? (
        <div className="card" style={{ marginBottom: 18, padding: 16 }}>
          <p style={{ color: "#047857", fontWeight: 800 }}>
            {params.message}
          </p>
        </div>
      ) : null}

      {params.error ? (
        <div className="card" style={{ marginBottom: 18, padding: 16 }}>
          <p style={{ color: "#b91c1c", fontWeight: 800 }}>{params.error}</p>
        </div>
      ) : null}

      <div className="grid stat-grid three-stat-grid">
        <article className="card stat-card hover-card">
          <span className="stat-label">Total Pemasukan</span>
          <div className="stat-value count">
  <AnimatedCounter value={summary.income} prefix="Rp " />
</div>
          <p>Termasuk semua transaksi pemasukan yang sudah dicatat.</p>
        </article>

        <article className="card stat-card hover-card">
          <span className="stat-label">Total Pengeluaran</span>
          <div className="stat-value count">
  <AnimatedCounter value={summary.expense} prefix="Rp " />
</div>
          <p>Belanja bahan, operasional, listrik, gaji, dan biaya lain.</p>
        </article>

        <article className="card stat-card hover-card">
          <span className="stat-label">Estimasi Laba</span>
          <div className="stat-value count">
  <AnimatedCounter value={summary.profit} prefix="Rp " />
</div>
          <p>Belum termasuk pajak, piutang, utang, dan penyusutan aset.</p>
        </article>
      </div>

      <article className="card table-card hover-card">
        <div className="panel-header">
          <div>
            <h2>Daftar Transaksi</h2>
            <p>
              Rows dibuat lebih visual dengan tag, konteks tanggal, kategori,
              dan aksi cepat.
            </p>
          </div>

          <Link href="/transactions/new" className="primary-button">
            <Plus />
            Tambah
          </Link>
        </div>

        <div className="list">
          {transactions.length === 0 ? (
            <div className="data-row">
              <div className="row-title">
                <span className="tag info">Kosong</span>
                <strong>Belum ada transaksi</strong>
                <small>
                  Tambahkan transaksi pemasukan atau pengeluaran pertama.
                </small>
              </div>

              <span className="amount">Rp 0</span>

              <Link href="/transactions/new" className="ghost-button">
                Tambah
              </Link>
            </div>
          ) : (
            transactions.map((transaction) => {
              const isIncome = transaction.type === "income";

              return (
                <div className="data-row" key={transaction.id}>
                  <div className="row-title">
                    <span className={`tag ${isIncome ? "income" : "expense"}`}>
                      {isIncome ? "Pemasukan" : "Pengeluaran"}
                    </span>

                    <strong>
                      {transaction.description || "Tanpa deskripsi"}
                    </strong>

                    <small>
                      {transaction.transaction_date} •{" "}
                      {transaction.category?.name || "Tanpa kategori"}
                    </small>
                  </div>

                  <span className={`amount ${isIncome ? "income" : "expense"}`}>
                    {isIncome ? "+" : "-"}Rp{" "}
                    {rupiah.format(Number(transaction.amount))}
                  </span>

                  <form action={deleteTransaction}>
                    <input
                      type="hidden"
                      name="transaction_id"
                      value={transaction.id}
                    />
                    <button className="ghost-button" type="submit">
                      <Trash2 />
                      Hapus
                    </button>
                  </form>
                </div>
              );
            })
          )}
        </div>
      </article>
    </section>
  );
}