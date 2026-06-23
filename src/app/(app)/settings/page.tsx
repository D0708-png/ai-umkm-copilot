import Link from "next/link";
import { redirect } from "next/navigation";
import { seedDemoData } from "@/lib/actions/demo";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

type SettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-4xl">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            AI UMKM Co-Pilot
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Pengaturan
          </h1>
          <p className="mt-2 text-slate-600">
            Kelola pengaturan dan data demo untuk usaha{" "}
            <span className="font-semibold text-slate-950">
              {business.name}
            </span>
            .
          </p>
        </div>

        {params.message ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {params.message}
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {params.error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Data Demo
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tambahkan data demo untuk mencoba dashboard, transaksi, produk,
              stok, laporan, dan AI Assistant tanpa input manual dari awal.
            </p>

            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              Data demo akan menambahkan:
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>3 produk demo</li>
                <li>Stok awal produk</li>
                <li>Transaksi pemasukan bulan ini</li>
                <li>Transaksi pengeluaran bulan ini</li>
                <li>Transaksi pembanding bulan lalu</li>
              </ul>
            </div>

            <form action={seedDemoData} className="mt-6">
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Tambahkan Demo Data
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Navigasi Testing
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Dashboard
              </Link>

              <Link
                href="/transactions"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Transaksi
              </Link>

              <Link
                href="/products"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Produk
              </Link>

              <Link
                href="/stocks"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Stok
              </Link>

              <Link
                href="/reports/profit"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Laporan
              </Link>

              <Link
                href="/assistant"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}