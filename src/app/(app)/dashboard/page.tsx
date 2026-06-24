import type { CSSProperties } from "react";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  Bot,
  ChevronRight,
  Clock,
  PackagePlus,
  PlusCircle,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { RevenueExpenseChart } from "@/components/charts/revenue-expense-chart";
import { getDashboardSummary } from "@/lib/services/dashboard.service";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

export default async function DashboardPage() {
  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const summary = await getDashboardSummary(business.id);

  const isProfit = summary.last7DaysProfit >= 0;
  const dailyTarget =
    summary.last7DaysIncome > 0
      ? Math.max(Math.round(summary.last7DaysIncome / 7), 1000000)
      : 1350000;

  const salesProgress =
    dailyTarget > 0
      ? Math.min(100, Math.round((summary.last7DaysIncome / 7 / dailyTarget) * 100))
      : 0;

  const efficiencyProgress =
    summary.last7DaysIncome + summary.last7DaysExpense > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              (summary.last7DaysIncome /
                (summary.last7DaysIncome + summary.last7DaysExpense)) *
                100
            )
          )
        )
      : 0;

  return (
    <section
      className="content-section is-active"
      id="dashboard"
      data-title="Dashboard"
      data-desc="Ringkasan performa hari ini, rekomendasi AI, dan sinyal bisnis yang perlu dipantau."
    >
      <div className="grid stat-grid">
        <article className="card stat-card hover-card">
          <div className="stat-top">
            <span className="stat-label">Pemasukan 7 Hari</span>
            <span className="stat-icon">
              <TrendingUp />
            </span>
          </div>

          <div className="stat-value count">
  <AnimatedCounter value={summary.last7DaysIncome} prefix="Rp " />
</div>

          <div className="stat-note">
            <span className="delta">
              <ArrowUpRight /> Aktif
            </span>{" "}
            dari transaksi tercatat
          </div>
        </article>

        <article className="card stat-card hover-card">
          <div className="stat-top">
            <span className="stat-label">Pengeluaran</span>
            <span
              className="stat-icon"
              style={{ background: "var(--red-soft)", color: "#991b1b" }}
            >
              <Wallet />
            </span>
          </div>

          <div className="stat-value count">
  <AnimatedCounter value={summary.last7DaysExpense} prefix="Rp " />
</div>

          <div className="stat-note">
            <span className="delta is-down">
              <ArrowDownRight /> Biaya
            </span>{" "}
            7 hari terakhir
          </div>
        </article>

        <article className="card stat-card hover-card">
          <div className="stat-top">
            <span className="stat-label">Estimasi Laba</span>
            <span
              className="stat-icon"
              style={{ background: "var(--blue-soft)", color: "#1d4ed8" }}
            >
              <BadgeDollarSign />
            </span>
          </div>

          <div className="stat-value count">
  <AnimatedCounter value={summary.last7DaysProfit} prefix="Rp " />
</div>

          <div className="stat-note">
            <span className={isProfit ? "delta" : "delta is-down"}>
              <Sparkles /> {isProfit ? "Stabil" : "Perlu cek"}
            </span>{" "}
            estimasi 7 hari
          </div>
        </article>

        <article className="card stat-card hover-card">
          <div className="stat-top">
            <span className="stat-label">Stok Perlu Restock</span>
            <span
              className="stat-icon"
              style={{ background: "var(--amber-soft)", color: "#a34700" }}
            >
              <TriangleAlert />
            </span>
          </div>

          <div className="stat-value count">
  <AnimatedCounter value={summary.lowStock} suffix=" produk" />
</div>

          <div className="stat-note">
            <span className="delta is-down">
              <Clock /> Hari ini
            </span>{" "}
            {summary.productCount} produk terdaftar
          </div>
        </article>
      </div>

      <div className="grid dashboard-grid">
        <article className="card chart-card hover-card">
          <div className="panel-header">
            <div>
              <h2>Revenue vs Expense</h2>
              <p>Pergerakan kas usaha selama 7 hari terakhir.</p>
            </div>

            <div className="legend">
              <span style={{ "--dot": "var(--emerald)" } as CSSProperties}>
                Revenue
              </span>
              <span style={{ "--dot": "var(--red)" } as CSSProperties}>
                Expense
              </span>
            </div>
          </div>

          <div className="chart-wrap">
            <RevenueExpenseChart data={summary.chartData} />
          </div>
        </article>

        <aside className="insight-card hover-card">
          <span className="kicker">Insight AI</span>
          <h2>
            {isProfit
              ? "Margin laba sedang kuat, tetapi stok tetap perlu dipantau."
              : "Pengeluaran sedang lebih besar dari pemasukan."}
          </h2>

          <p>
            {summary.recentTransactions.length === 0
              ? "Belum ada transaksi yang cukup untuk dianalisis. Mulai catat pemasukan dan pengeluaran harian agar AI bisa membaca kondisi bisnis."
              : isProfit
                ? "Pemasukan 7 hari terakhir masih lebih besar dari pengeluaran. Pantau produk stok rendah agar penjualan tidak tertahan."
                : "Cek pengeluaran terbesar dan evaluasi transaksi terbaru agar arus kas kembali positif."}
          </p>

          <div className="ai-summary">
            <small className="kicker">Target harian</small>
            <strong className="count">
  <AnimatedCounter value={dailyTarget} prefix="Rp " />
</strong>

            <div className="progress-list">
              <div className="progress-item">
                <div className="progress-row">
                  <span>Penjualan tercapai</span>
                  <span>{salesProgress}%</span>
                </div>
                <div className="progress-track">
                  <span
                    className="progress-fill"
                    style={{ width: `${salesProgress}%` }}
                  />
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-row">
                  <span>Efisiensi biaya</span>
                  <span>{efficiencyProgress}%</span>
                </div>
                <div className="progress-track">
                  <span
                    className="progress-fill"
                    style={{ width: `${efficiencyProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid section-grid" style={{ marginTop: 18 }}>
        <article className="card table-card hover-card">
          <div className="panel-header">
            <div>
              <h2>Transaksi Terbaru</h2>
              <p>Arus kas terbaru dari kasir dan pencatatan manual.</p>
            </div>

            <Link href="/transactions" className="ghost-button">
              Lihat semua
            </Link>
          </div>

          <div className="list">
            {summary.recentTransactions.length === 0 ? (
              <div className="data-row">
                <div className="row-title">
                  <span className="tag info">Kosong</span>
                  <strong>Belum ada transaksi</strong>
                  <small>Tambahkan transaksi pertama untuk mulai membaca arus kas.</small>
                </div>

                <span className="amount">Rp 0</span>

                <Link
                  href="/transactions/new"
                  className="icon-button"
                  aria-label="Tambah transaksi"
                >
                  <ChevronRight />
                </Link>
              </div>
            ) : (
              summary.recentTransactions.slice(0, 3).map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <div className="data-row" key={transaction.id}>
                    <div className="row-title">
                      <span className={`tag ${isIncome ? "income" : "expense"}`}>
                        {isIncome ? "Pemasukan" : "Pengeluaran"}
                      </span>
                      <strong>{transaction.description || "Tanpa deskripsi"}</strong>
                      <small>
                        {transaction.transaction_date} •{" "}
                        {isIncome ? "Pemasukan usaha" : "Pengeluaran usaha"}
                      </small>
                    </div>

                    <span className={`amount ${isIncome ? "income" : "expense"}`}>
                      {isIncome ? "+" : "-"}Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        Number(transaction.amount)
                      )}
                    </span>

                    <Link
                      href="/transactions"
                      className="icon-button"
                      aria-label="Detail transaksi"
                    >
                      <ChevronRight />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </article>

        <article className="card hover-card">
          <div className="panel-header">
            <div>
              <h2>Aksi Cepat</h2>
              <p>Operasi yang paling sering dipakai pemilik usaha.</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link href="/transactions/new" className="chip-button">
              <span>Tambah transaksi kasir</span>
              <PlusCircle />
            </Link>

            <Link href="/stocks" className="chip-button">
              <span>Catat stok masuk</span>
              <PackagePlus />
            </Link>

            <Link href="/assistant" className="chip-button">
              <span>Tanya rekomendasi AI</span>
              <Bot />
            </Link>

            <Link href="/reports/profit" className="chip-button">
              <span>Buka laporan laba rugi</span>
              <BarChart3 />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}