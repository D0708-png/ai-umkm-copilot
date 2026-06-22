import { redirect } from "next/navigation";
import { createBusinessProfile } from "@/lib/actions/business";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

type BusinessOnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function BusinessOnboardingPage({
  searchParams,
}: BusinessOnboardingPageProps) {
  const params = await searchParams;

  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (business) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8">
        <div>
          <p className="text-sm font-medium text-emerald-300">
            AI UMKM Co-Pilot
          </p>
          <h1 className="mt-2 text-2xl font-bold">Buat Profil Usaha</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Lengkapi data usaha agar transaksi, produk, stok, dan laporan kamu
            tersimpan dengan rapi.
          </p>
        </div>

        {params.error ? (
          <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {params.error}
          </div>
        ) : null}

        <form action={createBusinessProfile} className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-200">
              Nama Usaha
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Contoh: Warung Bu Ani"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <div>
            <label
              htmlFor="business_type"
              className="text-sm font-medium text-slate-200"
            >
              Jenis Usaha
            </label>
            <select
              id="business_type"
              name="business_type"
              required
              defaultValue=""
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
            >
              <option value="" disabled>
                Pilih jenis usaha
              </option>
              <option value="Makanan dan Minuman">Makanan dan Minuman</option>
              <option value="Toko Kelontong">Toko Kelontong</option>
              <option value="Online Seller">Online Seller</option>
              <option value="Reseller">Reseller</option>
              <option value="Fashion">Fashion</option>
              <option value="Jasa">Jasa</option>
              <option value="Produk Digital">Produk Digital</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="currency"
              className="text-sm font-medium text-slate-200"
            >
              Mata Uang
            </label>
            <select
              id="currency"
              name="currency"
              defaultValue="IDR"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
            >
              <option value="IDR">IDR — Rupiah Indonesia</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="location"
              className="text-sm font-medium text-slate-200"
            >
              Lokasi Usaha <span className="text-slate-500">(opsional)</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="Contoh: Bandung"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Simpan Profil Usaha
          </button>
        </form>
      </div>
    </main>
  );
}