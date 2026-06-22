import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { getDashboardSummary } from "@/lib/services/dashboard.service";
import { getCurrentUserBusiness } from "@/lib/services/business.service";
import { formatCurrency } from "@/lib/utils/format";

export default async function DashboardPage() {
  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const summary = await getDashboardSummary(business.id);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              AI UMKM Co-Pilot
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Ringkasan bisnis bulan ini untuk{" "}
              <span className="font-semibold text-slate-950">
                {business.name}
              </span>
              .
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Login sebagai: {user.email}
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Keluar
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pemasukan Bulan Ini</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.income)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pengeluaran Bulan Ini</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.expense)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Estimasi Laba Bulan Ini</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.profit)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Stok Rendah</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {summary.lowStock} produk
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-950">
                Transaksi Terbaru
              </h2>

              <Link
                href="/transactions"
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Lihat semua
              </Link>
            </div>

            {summary.recentTransactions.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <p className="font-semibold text-slate-950">
                  Belum ada transaksi.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Mulai catat pemasukan atau pengeluaran pertama kamu.
                </p>
                <Link
                  href="/transactions/new"
                  className="mt-4 inline-flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Tambah Transaksi
                </Link>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-100">
                {summary.recentTransactions.map((transaction) => {
                  const isIncome = transaction.type === "income";

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-slate-950">
                          {transaction.description || "Tanpa deskripsi"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {transaction.transaction_date}
                        </p>
                      </div>

                      <p
                        className={`font-bold ${
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

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Aksi Cepat
            </h2>

            <div className="mt-4 space-y-3">
              <Link
                href="/transactions/new"
                className="block rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Tambah Transaksi
              </Link>

              <Link
                href="/transactions"
                className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Lihat Transaksi
              </Link>

              <Link
  href="/products"
  className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
>
  Kelola Produk
</Link>

<Link
  href="/stocks"
  className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
>
  Kelola Stok
</Link>

<Link
  href="/reports/profit"
  className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
>
  Lihat Laporan
</Link>

<Link
  href="/assistant"
  className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
>
  Tanya AI Assistant
</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}