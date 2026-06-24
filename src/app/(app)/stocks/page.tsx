import type { CSSProperties } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Save } from "lucide-react";
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
    <section
      className="content-section is-active"
      id="stok"
      data-title="Stok"
      data-desc="Pantau stok masuk, stok keluar, dan prioritas restock untuk produk usaha."
    >
      {params.message ? (
        <div className="card" style={{ marginBottom: 18, padding: 16 }}>
          <p style={{ color: "#047857", fontWeight: 800 }}>
            {params.message}
          </p>
        </div>
      ) : null}

      {params.error ? (
        <div className="card" style={{ marginBottom: 18, padding: 16 }}>
          <p style={{ color: "#b91c1c", fontWeight: 800 }}>{params.error}</p>
        </div>
      ) : null}

      <div className="grid stock-grid">
        <article className="card form-card hover-card">
          <div>
            <h2>Catat Perubahan Stok</h2>
            <p>Form lebih ringkas dengan fokus ke aksi harian.</p>
          </div>

          <form action={createStockMovement} className="form-card" style={{ padding: 0 }}>
            <div className="field">
              <label htmlFor="product_id">Produk</label>
              <select id="product_id" name="product_id" required defaultValue="">
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

            <div className="field">
              <label htmlFor="type">Jenis</label>
              <select id="type" name="type" defaultValue="in" required>
                <option value="in">Stok Masuk</option>
                <option value="out">Stok Keluar</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="quantity">Jumlah</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                step="1"
                required
                placeholder="Contoh: 10"
              />
            </div>

            <div className="field">
              <label htmlFor="note">Catatan</label>
              <input
                id="note"
                name="note"
                type="text"
                placeholder="Contoh: Restock pagi"
              />
            </div>

            <button className="primary-button" type="submit">
              <Save />
              Simpan Stok
            </button>
          </form>
        </article>

        <article className="card hover-card">
          <div className="panel-header">
            <div>
              <h2>Produk Stok Rendah</h2>
              <p>Prioritas restock berdasarkan stok minimum dan kondisi stok saat ini.</p>
            </div>
          </div>

          <div className="stock-list">
            {lowStockProducts.length === 0 ? (
              <div className="stock-row">
                <div className="row-title">
                  <strong>Tidak ada produk stok rendah</strong>
                  <small>Semua produk masih berada di atas minimum stok.</small>
                  <div className="bar">
                    <span
                      style={
                        {
                          "--w": "100%",
                          "--bar": "var(--emerald)",
                        } as CSSProperties
                      }
                    />
                  </div>
                </div>

                <span className="tag income">Aman</span>
              </div>
            ) : (
              lowStockProducts.map((product) => {
                const currentStock = Number(product.current_stock);
                const minimumStock = Number(product.minimum_stock);
                const percentage =
                  minimumStock > 0
                    ? Math.min(
                        100,
                        Math.max(8, Math.round((currentStock / minimumStock) * 100))
                      )
                    : currentStock > 0
                      ? 100
                      : 8;

                const barColor =
                  currentStock <= 0
                    ? "var(--red)"
                    : currentStock <= minimumStock
                      ? "var(--amber)"
                      : "var(--emerald)";

                return (
                  <div className="stock-row" key={product.id}>
                    <div className="row-title">
                      <strong>{product.name}</strong>
                      <small>
                        Minimum stok: {minimumStock} • stok saat ini {currentStock}
                      </small>
                      <div className="bar">
                        <span
                          style={
                            {
                              "--w": `${percentage}%`,
                              "--bar": barColor,
                            } as CSSProperties
                          }
                        />
                      </div>
                    </div>

                    <span className="tag warning">Stok {currentStock}</span>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </div>

      <article className="card table-card hover-card" style={{ marginTop: 18 }}>
        <div className="panel-header">
          <div>
            <h2>Riwayat Stok</h2>
            <p>Catatan stok masuk dan stok keluar terbaru.</p>
          </div>

          <Link href="/products" className="ghost-button">
            Lihat Produk
          </Link>
        </div>

        <div className="list">
          {stockMovements.length === 0 ? (
            <div className="data-row">
              <div className="row-title">
                <span className="tag info">Kosong</span>
                <strong>Belum ada riwayat stok</strong>
                <small>Catat stok masuk atau stok keluar untuk mulai melihat riwayat.</small>
              </div>

              <span className="amount">0</span>

              <Link href="/products/new" className="ghost-button">
                Tambah Produk
              </Link>
            </div>
          ) : (
            stockMovements.map((movement) => {
              const isStockIn = movement.type === "in";
              const isAdjustment = movement.type === "adjustment";

              return (
                <div className="data-row" key={movement.id}>
                  <div className="row-title">
                    <span
                      className={`tag ${
                        isStockIn ? "income" : isAdjustment ? "info" : "expense"
                      }`}
                    >
                      {isStockIn
                        ? "Stok Masuk"
                        : isAdjustment
                          ? "Penyesuaian"
                          : "Stok Keluar"}
                    </span>

                    <strong>
                      {movement.product?.name || "Produk tidak ditemukan"}
                    </strong>

                    <small>
                      {new Date(movement.created_at).toLocaleString("id-ID")} •{" "}
                      {movement.note || "Tanpa catatan"}
                    </small>
                  </div>

                  <span className={`amount ${isStockIn ? "income" : "expense"}`}>
                    {isStockIn ? "+" : "-"}
                    {movement.quantity}
                  </span>

                  <span className="tag info">Riwayat</span>
                </div>
              );
            })
          )}
        </div>
      </article>
    </section>
  );
}