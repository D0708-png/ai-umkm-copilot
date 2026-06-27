import type { CSSProperties } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Download } from "lucide-react";
import { ExpenseDonutChart } from "@/components/charts/expense-donut-chart";
import { getProfitReportData } from "@/lib/services/report.service";

type ProfitReportPageProps = {
  searchParams: Promise<{
    start_date?: string;
    end_date?: string;
  }>;
};

const rupiah = new Intl.NumberFormat("id-ID");
const swatches = ["#14b8a6", "#f59e0b", "#6366f1", "#ef4444", "#0f172a"];

export default async function ProfitReportPage({
  searchParams,
}: ProfitReportPageProps) {
  const params = await searchParams;

  const { user, business, period, transactions, expenseByCategory, summary } =
    await getProfitReportData({
      startDate: params.start_date,
      endDate: params.end_date,
    });

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const isProfit = summary.profit >= 0;
  const totalExpenseByCategory = expenseByCategory.reduce(
    (total, item) => total + item.total,
    0
  );

  const topExpense = expenseByCategory[0];

  return (
    <section
      className="content-section is-active"
      id="laporan"
      data-title="Laporan Laba Rugi"
      data-desc="Laporan visual untuk membantu pemilik melihat sumber laba dan biaya terbesar."
    >
      <div className="grid stat-grid">
        <article className="card stat-card hover-card">
          <span className="stat-label">Total Pemasukan</span>
          <div className="stat-value count">
  <AnimatedCounter value={summary.income} prefix="Rp " />
</div>
          <p>
            Periode {period.startDate} sampai {period.endDate}.
          </p>
        </article>

        <article className="card stat-card hover-card">
          <span className="stat-label">Total Pengeluaran</span>
          <div className="stat-value count">
  <AnimatedCounter value={summary.expense} prefix="Rp " />
</div>
          <p>
            {topExpense
              ? `${topExpense.categoryName} menjadi kategori terbesar.`
              : "Belum ada pengeluaran pada periode ini."}
          </p>
        </article>

        <article className="card stat-card hover-card">
          <span className="stat-label">Estimasi Laba</span>
          <div className="stat-value count">
  <AnimatedCounter value={summary.profit} prefix="Rp " />
</div>
          <p>
            Estimasi sederhana pemasukan dikurangi pengeluaran.
          </p>
        </article>

        <article className="card stat-card hover-card">
          <span className="stat-label">Jumlah Transaksi</span>
          <div className="stat-value count">
  <AnimatedCounter value={summary.transactionCount} />
</div>
          <p>
            Transaksi dalam periode laporan yang sedang dibaca.
          </p>
        </article>
      </div>

      <div className="grid report-grid">
        <article className="card hover-card">
          <div className="panel-header">
            <div>
              <h2>Pengeluaran per Kategori</h2>
              <p>Donut chart interaktif untuk melihat komposisi biaya.</p>
            </div>
          </div>

          <div className="donut-wrap report-donut-wrap">
  <div className="report-donut-box">
    <ExpenseDonutChart data={expenseByCategory} />
  </div>

  <div className="category-list">
              {expenseByCategory.length === 0 ? (
                <div className="category-item">
                  <span className="category-left">
                    <span
                      className="swatch"
                      style={{ "--swatch": "#98a2b3" } as CSSProperties}
                    />
                    <strong>Belum ada pengeluaran</strong>
                  </span>
                  <span>0%</span>
                </div>
              ) : (
                expenseByCategory.slice(0, 5).map((item, index) => {
                  const percentage =
                    totalExpenseByCategory > 0
                      ? Math.round((item.total / totalExpenseByCategory) * 100)
                      : 0;

                  return (
                    <div className="category-item" key={item.categoryName}>
                      <span className="category-left">
                        <span
                          className="swatch"
                          style={
                            {
                              "--swatch": swatches[index % swatches.length],
                            } as CSSProperties
                          }
                        />
                        <strong>{item.categoryName}</strong>
                      </span>
                      <span>{percentage}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </article>

        <article className="card hero-metric hover-card">
          <span className="kicker">Ringkasan Perhitungan</span>

          <h2>
            {summary.transactionCount === 0
              ? "Belum ada data transaksi pada periode ini."
              : isProfit
                ? "Laba periode ini masih positif berdasarkan transaksi tercatat."
                : "Periode ini menunjukkan estimasi rugi dari transaksi tercatat."}
          </h2>

          <strong className="count">
  <AnimatedCounter value={summary.profit} prefix="Rp " />
</strong>

          <p>
            {summary.transactionCount === 0
              ? "Tambahkan transaksi pemasukan dan pengeluaran agar laporan bisa dibaca."
              : isProfit
                ? `Pemasukan Rp ${rupiah.format(
                    summary.income
                  )} dikurangi pengeluaran Rp ${rupiah.format(
                    summary.expense
                  )}. Pertahankan pencatatan rutin agar laporan semakin akurat.`
                : `Pengeluaran Rp ${rupiah.format(
                    summary.expense
                  )} lebih besar dari pemasukan Rp ${rupiah.format(
                    summary.income
                  )}. Coba evaluasi kategori biaya terbesar.`}
          </p>

          <Link href="/transactions" className="primary-button">
              Lihat Detail Transaksi    
          </Link>
        </article>
      </div>

      <article className="card table-card hover-card" style={{ marginTop: 18 }}>
        <div className="panel-header">
          <div>
            <h2>Transaksi dalam Periode</h2>
            <p>Daftar transaksi yang menjadi dasar laporan laba rugi.</p>
          </div>

          <Link href="/transactions" className="ghost-button">
            Lihat Transaksi
          </Link>
        </div>

        <div className="list">
          {transactions.length === 0 ? (
            <div className="data-row">
              <div className="row-title">
                <span className="tag info">Kosong</span>
                <strong>Belum ada transaksi</strong>
                <small>
                  Tidak ada transaksi pada periode laporan ini.
                </small>
              </div>

              <span className="amount">Rp 0</span>

              <Link href="/transactions/new" className="ghost-button">
                Tambah
              </Link>
            </div>
          ) : (
            transactions.slice(0, 8).map((transaction) => {
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

                  <span className="tag info">Laporan</span>
                </div>
              );
            })
          )}
        </div>
      </article>
    </section>
  );
}