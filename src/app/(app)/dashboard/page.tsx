import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";
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

  const summary = {
    income: 8500000,
    expense: 5200000,
    profit: 3300000,
    lowStock: 3,
  };

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

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Profil Usaha Aktif
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Nama Usaha</p>
              <p className="mt-1 font-semibold text-slate-950">
                {business.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Jenis Usaha</p>
              <p className="mt-1 font-semibold text-slate-950">
                {business.business_type}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Mata Uang</p>
              <p className="mt-1 font-semibold text-slate-950">
                {business.currency}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Lokasi</p>
              <p className="mt-1 font-semibold text-slate-950">
                {business.location || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-950">
            Status Implementasi
          </h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Profil usaha sudah terhubung ke Supabase. Data dashboard masih
            memakai dummy data dan akan dihubungkan ke transaksi pada step
            berikutnya.
          </p>
        </div>
      </section>
    </main>
  );
}