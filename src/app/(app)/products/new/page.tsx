import Link from "next/link";
import { redirect } from "next/navigation";
import { createProduct } from "@/lib/actions/product";
import { getProductFormData } from "@/lib/services/product.service";

type NewProductPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewProductPage({
  searchParams,
}: NewProductPageProps) {
  const params = await searchParams;
  const { user, business } = await getProductFormData();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-3xl">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            AI UMKM Co-Pilot
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Tambah Produk
          </h1>
          <p className="mt-2 text-slate-600">
            Tambahkan produk untuk usaha{" "}
            <span className="font-semibold text-slate-950">
              {business.name}
            </span>
            .
          </p>
        </div>

        {params.error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {params.error}
          </div>
        ) : null}

        <form
          action={createProduct}
          className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Nama Produk
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Contoh: Es Kopi Susu"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="sku"
                className="text-sm font-medium text-slate-700"
              >
                SKU <span className="text-slate-400">(opsional)</span>
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                placeholder="Contoh: EKS-001"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cost_price"
                  className="text-sm font-medium text-slate-700"
                >
                  Harga Modal
                </label>
                <input
                  id="cost_price"
                  name="cost_price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Contoh: 8000"
                  defaultValue="0"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="selling_price"
                  className="text-sm font-medium text-slate-700"
                >
                  Harga Jual
                </label>
                <input
                  id="selling_price"
                  name="selling_price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Contoh: 15000"
                  defaultValue="0"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="current_stock"
                  className="text-sm font-medium text-slate-700"
                >
                  Stok Saat Ini
                </label>
                <input
                  id="current_stock"
                  name="current_stock"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue="0"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="minimum_stock"
                  className="text-sm font-medium text-slate-700"
                >
                  Minimum Stok
                </label>
                <input
                  id="minimum_stock"
                  name="minimum_stock"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue="0"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/products"
              className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}