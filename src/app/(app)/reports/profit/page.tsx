import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfitReportData } from "@/lib/services/report.service";
import { formatCurrency } from "@/lib/utils/format";

type ProfitReportPageProps = {
  searchParams: Promise<{
    start_date?: string;
    end_date?: string;
  }>;
};

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

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              AI UMKM Co-Pilot
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Laporan Laba Rugi
            </h1>
            <p className="mt-2 text-slate-600">
              Laporan sederhana untuk usaha{" "}
              <span className="font-semibold text-slate-950">
                {business.name}
              </span>
              .
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Kembali ke Dashboard
          </Link>
        </div>

        <form
          action="/reports/profit"
          className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="font-bold text-slate-950">Filter Periode</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label
                htmlFor="start_date"
                className="text-sm font-medium text-slate-700"
              >
                Tanggal Mulai
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={period.startDate}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="end_date"
                className="text-sm font-medium text-slate-700"
              >
                Tanggal Selesai
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                defaultValue={period.endDate}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Terapkan
            </button>
          </div>
        </form>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Pemasukan</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.income)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Pengeluaran</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.expense)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Estimasi Laba</p>
            <p
              className={`mt-2 text-2xl font-bold ${
                isProfit ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {formatCurrency(summary.profit)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Jumlah Transaksi</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {summary.transactionCount}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Ringkasan Perhitungan
          </h2>

          <div className="mt-4 rounded-xl bg-slate-50 p-5">
            <p className="text-sm leading-6 text-slate-700">
              Estimasi laba dihitung dengan rumus sederhana:
            </p>

            <p className="mt-3 text-lg font-bold text-slate-950">
              {formatCurrency(summary.income)} -{" "}
              {formatCurrency(summary.expense)} ={" "}
              <span className={isProfit ? "text-emerald-700" : "text-red-700"}>
                {formatCurrency(summary.profit)}
              </span>
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Catatan: laporan MVP ini belum menghitung HPP, pajak, penyusutan,
              piutang, utang, atau neraca. Ini adalah estimasi sederhana dari
              pemasukan dikurangi pengeluaran.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Pengeluaran per Kategori
            </h2>

            {expenseByCategory.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                Belum ada pengeluaran pada periode ini.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-slate-100">
                {expenseByCategory.map((item) => (
                  <div
                    key={item.categoryName}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <p className="font-semibold text-slate-950">
                      {item.categoryName}
                    </p>
                    <p className="font-bold text-red-700">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Insight Sederhana
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
              {summary.transactionCount === 0 ? (
                <p>
                  Belum ada transaksi pada periode ini. Mulai catat pemasukan
                  dan pengeluaran agar laporan bisa terbaca.
                </p>
              ) : isProfit ? (
                <p>
                  Berdasarkan data yang dicatat, usaha kamu menghasilkan
                  estimasi laba sebesar{" "}
                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(summary.profit)}
                  </span>{" "}
                  pada periode ini.
                </p>
              ) : (
                <p>
                  Berdasarkan data yang dicatat, usaha kamu mengalami estimasi
                  rugi sebesar{" "}
                  <span className="font-semibold text-red-700">
                    {formatCurrency(Math.abs(summary.profit))}
                  </span>{" "}
                  pada periode ini.
                </p>
              )}

              {expenseByCategory[0] ? (
                <p>
                  Pengeluaran terbesar berasal dari kategori{" "}
                  <span className="font-semibold text-slate-950">
                    {expenseByCategory[0].categoryName}
                  </span>{" "}
                  sebesar{" "}
                  <span className="font-semibold text-slate-950">
                    {formatCurrency(expenseByCategory[0].total)}
                  </span>
                  .
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-bold text-slate-950">
              Transaksi dalam Periode Ini
            </h2>
          </div>

          {transactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-slate-950">
                Belum ada transaksi.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Tambahkan transaksi untuk melihat laporan periode ini.
              </p>
              <Link
                href="/transactions/new"
                className="mt-6 inline-flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Tambah Transaksi
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <div
                    key={transaction.id}
                    className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </span>

                        <span className="text-sm text-slate-500">
                          {transaction.transaction_date}
                        </span>
                      </div>

                      <p className="mt-2 font-semibold text-slate-950">
                        {transaction.description || "Tanpa deskripsi"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Kategori: {transaction.category?.name || "-"}
                      </p>
                    </div>

                    <p
                      className={`text-lg font-bold ${
                        isIncome ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(Number(transaction.amount))}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}