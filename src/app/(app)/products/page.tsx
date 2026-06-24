import Link from "next/link";
import { redirect } from "next/navigation";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Coffee, Package, Plus, Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/product";
import { getProductsPageData } from "@/lib/services/product.service";

type ProductsPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

const rupiah = new Intl.NumberFormat("id-ID");

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
    <section
      className="content-section is-active"
      id="produk"
      data-title="Produk"
      data-desc="Kelola katalog produk, margin, dan stok minimum secara cepat."
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

      <div className="grid stat-grid three-stat-grid" style={{ marginBottom: 18 }}>
        <article className="card stat-card hover-card">
          <span className="stat-label">Jumlah Produk</span>
          <div className="stat-value count">
  <AnimatedCounter value={summary.productCount} suffix=" produk" />
</div>
          <p>Total produk yang sudah terdaftar untuk usaha ini.</p>
        </article>

        <article className="card stat-card hover-card">
          <span className="stat-label">Produk Stok Rendah</span>
          <div className="stat-value count">
  <AnimatedCounter value={summary.lowStockCount} suffix=" produk" />
</div>
          <p>Produk dengan stok saat ini di bawah atau sama dengan minimum stok.</p>
        </article>

        <article className="card stat-card hover-card">
          <span className="stat-label">Aksi Produk</span>
          <div className="stat-value">Katalog</div>
          <p>Tambah, pantau, dan hapus produk dari satu halaman.</p>
        </article>
      </div>

      <div style={{ marginBottom: 18, display: "flex", justifyContent: "flex-end" }}>
        <Link href="/products/new" className="primary-button">
          <Plus />
          Tambah Produk
        </Link>
      </div>

      {products.length === 0 ? (
        <article className="card table-card hover-card">
          <div className="panel-header">
            <div>
              <h2>Daftar Produk</h2>
              <p>Belum ada produk yang dicatat.</p>
            </div>
          </div>

          <div className="list">
            <div className="data-row">
              <div className="row-title">
                <span className="tag info">Kosong</span>
                <strong>Belum ada produk</strong>
                <small>Tambahkan produk pertama untuk mulai mengelola stok.</small>
              </div>

              <span className="amount">0 produk</span>

              <Link href="/products/new" className="ghost-button">
                Tambah
              </Link>
            </div>
          </div>
        </article>
      ) : (
        <div className="grid product-grid">
          {products.map((product, index) => {
            const currentStock = Number(product.current_stock);
            const minimumStock = Number(product.minimum_stock);
            const costPrice = Number(product.cost_price);
            const sellingPrice = Number(product.selling_price);
            const margin = sellingPrice - costPrice;
            const isLowStock = currentStock <= minimumStock;
            const isHighMargin = margin > 0 && margin >= costPrice;

            return (
              <article className="card product-card hover-card" key={product.id}>
                <div className="product-head">
                  <div className="product-icon">
                    {index % 2 === 0 ? <Coffee /> : <Package />}
                  </div>

                  {isLowStock ? (
                    <span className="tag warning">Stok rendah</span>
                  ) : isHighMargin ? (
                    <span className="tag info">Margin tinggi</span>
                  ) : (
                    <span className="tag income">Aman</span>
                  )}
                </div>

                <div>
                  <h2>{product.name}</h2>
                  <p>SKU: {product.sku || "-"} • Produk usaha</p>
                </div>

                <div className="product-meta">
                  <div className="mini-stat">
                    <small>Modal</small>
                    <strong>Rp {rupiah.format(costPrice)}</strong>
                  </div>

                  <div className="mini-stat">
                    <small>Jual</small>
                    <strong>Rp {rupiah.format(sellingPrice)}</strong>
                  </div>

                  <div className="mini-stat">
                    <small>Stok</small>
                    <strong>
                      {currentStock} / min {minimumStock}
                    </strong>
                  </div>
                </div>

                <form action={deleteProduct}>
                  <input type="hidden" name="product_id" value={product.id} />
                  <button className="ghost-button" type="submit">
                    <Trash2 />
                    Hapus Produk
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}