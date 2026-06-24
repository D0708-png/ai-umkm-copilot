import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
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
    <section
      className="content-section is-active"
      id="produk-baru"
      data-title="Tambah Produk"
      data-desc={`Tambahkan produk baru untuk ${business.name}.`}
    >
      {params.error ? (
        <div className="card" style={{ marginBottom: 18, padding: 16 }}>
          <p style={{ color: "#b91c1c", fontWeight: 800 }}>{params.error}</p>
        </div>
      ) : null}

      <div className="grid stock-grid">
        <article className="card form-card hover-card">
          <div>
            <h2>Form Produk</h2>
            <p>
              Tambahkan produk lengkap dengan harga modal, harga jual, stok
              awal, dan minimum stok.
            </p>
          </div>

          <form action={createProduct} className="form-card" style={{ padding: 0 }}>
            <div className="field">
              <label htmlFor="name">Nama Produk</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Contoh: Es Kopi Susu"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="sku">SKU</label>
              <input
                id="sku"
                name="sku"
                type="text"
                placeholder="Contoh: EKS-001"
              />
            </div>

            <div className="field">
              <label htmlFor="cost_price">Harga Modal</label>
              <input
                id="cost_price"
                name="cost_price"
                type="number"
                min="0"
                step="1"
                placeholder="Contoh: 8000"
                defaultValue="0"
              />
            </div>

            <div className="field">
              <label htmlFor="selling_price">Harga Jual</label>
              <input
                id="selling_price"
                name="selling_price"
                type="number"
                min="0"
                step="1"
                placeholder="Contoh: 15000"
                defaultValue="0"
              />
            </div>

            <div className="field">
              <label htmlFor="current_stock">Stok Saat Ini</label>
              <input
                id="current_stock"
                name="current_stock"
                type="number"
                min="0"
                step="1"
                defaultValue="0"
              />
            </div>

            <div className="field">
              <label htmlFor="minimum_stock">Minimum Stok</label>
              <input
                id="minimum_stock"
                name="minimum_stock"
                type="number"
                min="0"
                step="1"
                defaultValue="0"
              />
            </div>

            <button className="primary-button" type="submit">
              <Save />
              Simpan Produk
            </button>
          </form>
        </article>

        <article className="card hover-card">
          <div className="panel-header">
            <div>
              <h2>Panduan Produk</h2>
              <p>
                Data produk akan dipakai oleh stok, dashboard, laporan sederhana,
                dan AI Assistant.
              </p>
            </div>
          </div>

          <div className="stock-list">
            <div className="stock-row">
              <div className="row-title">
                <strong>Harga modal</strong>
                <small>
                  Dipakai untuk menghitung margin produk secara sederhana.
                </small>
                <div className="bar">
                  <span
                    style={
                      {
                        "--w": "100%",
                        "--bar": "var(--emerald)",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <span className="tag income">Margin</span>
            </div>

            <div className="stock-row">
              <div className="row-title">
                <strong>Harga jual</strong>
                <small>
                  Dipakai untuk membandingkan potensi laba per produk.
                </small>
                <div className="bar">
                  <span
                    style={
                      {
                        "--w": "100%",
                        "--bar": "var(--teal)",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <span className="tag info">Harga</span>
            </div>

            <div className="stock-row">
              <div className="row-title">
                <strong>Minimum stok</strong>
                <small>
                  Produk akan ditandai stok rendah jika stok saat ini kurang
                  atau sama dengan minimum stok.
                </small>
                <div className="bar">
                  <span
                    style={
                      {
                        "--w": "100%",
                        "--bar": "var(--amber)",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <span className="tag warning">Restock</span>
            </div>

            <Link href="/products" className="ghost-button">
              <ArrowLeft />
              Kembali ke Produk
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}