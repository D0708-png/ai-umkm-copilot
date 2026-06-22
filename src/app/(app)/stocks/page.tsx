import Link from "next/link";
import { redirect } from "next/navigation";
import { createStockMovement } from "@/lib/actions/stock";
import { getStockPageData } from "@/lib/services/stock.service";

type StocksPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function StocksPage({ searchParams }: StocksPageProps) {
  const params = await searchParams;
  const { user, business, products, stockMovements, lowStockProducts } =
    await getStockPageData();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              AI UMKM Co-Pilot
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Stok</h1>
            <p className="mt-2 text-slate-600">
              Catat stok masuk dan stok keluar untuk usaha{" "}
              <span className="font-semibold text-slate-950">
                {business.name}
              </span>
              .
            </p>
          </div>

          <Link
            href="/products"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Lihat Produk
          </Link>
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

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <form
            action={createStockMovement}
            className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-1"
          >
            <h2 className="text-lg font-bold text-slate-950">
              Catat Perubahan Stok
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="product_id"
                  className="text-sm font-medium text-slate-700"
                >
                  Produk
                </label>
                <select
                  id="product_id"
                  name="product_id"
                  required
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
                >
                  <option value="" disabled>
                    Pilih produk
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} — stok {product.current_stock}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="text-sm font-medium text-slate-700"
                >
                  Jenis
                </label>
                <select
                  id="type"
                  name="type"
                  defaultValue="in"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
                >
                  <option value="in">Stok Masuk</option>
                  <option value="out">Stok Keluar</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="text-sm font-medium text-slate-700"
                >
                  Jumlah
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="Contoh: 10"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="text-sm font-medium text-slate-700"
                >
                  Catatan <span className="text-slate-400">(opsional)</span>
                </label>
                <input
                  id="note"
                  name="note"
                  type="text"
                  placeholder="Contoh: Restock pagi"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Simpan Stok
              </button>
            </div>
          </form>

          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-950">
              Produk Stok Rendah
            </h2>

            {lowStockProducts.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                Tidak ada produk dengan stok rendah.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-slate-100">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {product.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Minimum stok: {product.minimum_stock}
                      </p>
                    </div>

                    <p className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                      Stok {product.current_stock}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-bold text-slate-950">Riwayat Stok</h2>
          </div>

          {stockMovements.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-slate-950">
                Belum ada riwayat stok.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Tambahkan produk lalu catat stok masuk atau stok keluar.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stockMovements.map((movement) => {
                const isStockIn = movement.type === "in";

                return (
                  <div
                    key={movement.id}
                    className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isStockIn
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {isStockIn ? "Stok Masuk" : "Stok Keluar"}
                        </span>

                        <span className="text-sm text-slate-500">
                          {new Date(movement.created_at).toLocaleString("id-ID")}
                        </span>
                      </div>

                      <p className="mt-2 font-semibold text-slate-950">
                        {movement.product?.name || "Produk tidak ditemukan"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {movement.note || "Tanpa catatan"}
                      </p>
                    </div>

                    <p
                      className={`text-lg font-bold ${
                        isStockIn ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {isStockIn ? "+" : "-"}
                      {movement.quantity}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}