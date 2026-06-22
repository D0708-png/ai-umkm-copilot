import { formatCurrency } from "@/lib/utils/format";

export default function DashboardPage() {
  const summary = {
    income: 8500000,
    expense: 5200000,
    profit: 3300000,
    lowStock: 3,
  };

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            AI UMKM Co-Pilot
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Ringkasan bisnis bulan ini.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pemasukan</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.income)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pengeluaran</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.expense)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Estimasi Laba</p>
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
      </section>
    </main>
  );
}