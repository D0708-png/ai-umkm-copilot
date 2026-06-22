import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteProduct } from "@/lib/actions/product";
import { getProductsPageData } from "@/lib/services/product.service";
import { formatCurrency } from "@/lib/utils/format";

type ProductsPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { user, business, products, summary } = await getProductsPageData();

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
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Produk</h1>
            <p className="mt-2 text-slate-600">
              Kelola daftar produk usaha{" "}
              <span className="font-semibold text-slate-950">
                {business.name}
              </span>
              .
            </p>
          </div>

          <Link
            href="/products/new"
            className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Tambah Produk
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Jumlah Produk</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {summary.productCount} produk
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Produk Stok Rendah</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {summary.lowStockCount} produk
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="font-bold text-slate-950">Daftar Produk</h2>

            <Link
              href="/stocks"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Kelola stok
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-slate-950">
                Belum ada produk.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Tambahkan produk pertama untuk mulai mengelola stok.
              </p>
              <Link
                href="/products/new"
                className="mt-6 inline-flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Tambah Produk
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {products.map((product) => {
                const isLowStock =
                  Number(product.current_stock) <= Number(product.minimum_stock);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">
                          {product.name}
                        </p>

                        {isLowStock ? (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            Stok rendah
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        SKU: {product.sku || "-"}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-4 lg:min-w-[640px]">
                      <div>
                        <p className="text-xs text-slate-500">Modal</p>
                        <p className="font-semibold text-slate-950">
                          {formatCurrency(Number(product.cost_price))}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Harga Jual</p>
                        <p className="font-semibold text-slate-950">
                          {formatCurrency(Number(product.selling_price))}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Stok</p>
                        <p className="font-semibold text-slate-950">
                          {product.current_stock} / min {product.minimum_stock}
                        </p>
                      </div>

                      <form action={deleteProduct}>
                        <input
                          type="hidden"
                          name="product_id"
                          value={product.id}
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
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