import { redirect } from "next/navigation";
import { Save, Sparkles } from "lucide-react";
import { createBusinessProfile } from "@/lib/actions/business";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

type BusinessOnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
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
    <section
      className="content-section is-active"
      id="onboarding-business"
      data-title="Profil Usaha"
      data-desc="Lengkapi profil bisnis sebelum masuk ke dashboard."
    >
      <div className="grid stat-grid">
        <article className="card stat-card hover-card">
          <span className="stat-label">Langkah 1</span>
          <div className="stat-value">Profil</div>
          <p>Isi nama, jenis, mata uang, dan lokasi usaha.</p>
        </article>

        <article className="card stat-card hover-card">
          <span className="stat-label">Langkah 2</span>
          <div className="stat-value">Kategori</div>
          <p>Kategori default akan dibuat otomatis.</p>
        </article>

        <article className="card stat-card hover-card">
          <span className="stat-label">Langkah 3</span>
          <div className="stat-value">Dashboard</div>
          <p>Setelah tersimpan, kamu bisa mulai mencatat transaksi.</p>
        </article>
      </div>

      <div className="grid stock-grid" style={{ marginTop: 18 }}>
        <article className="card form-card hover-card">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Onboarding</span>
              <h2>Buat Profil Usaha</h2>
              <p>
                Profil ini menjadi pusat data untuk transaksi, produk, stok,
                laporan, dan AI Assistant.
              </p>
            </div>
          </div>

          {params.message ? (
            <div className="auth-alert success">{params.message}</div>
          ) : null}

          {params.error ? (
            <div className="auth-alert error">{params.error}</div>
          ) : null}

          <form action={createBusinessProfile} className="auth-form">
            <div className="field">
              <label htmlFor="name">Nama Usaha</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Contoh: Warung Bu Ani"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="business_type">Jenis Usaha</label>
              <select
                id="business_type"
                name="business_type"
                required
                defaultValue=""
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

            <div className="field">
              <label htmlFor="currency">Mata Uang</label>
              <select id="currency" name="currency" defaultValue="IDR">
                <option value="IDR">IDR — Rupiah Indonesia</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="location">Lokasi Usaha</label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Contoh: Bandung"
              />
            </div>

            <button className="primary-button" type="submit">
              <Save />
              Simpan Profil Usaha
            </button>
          </form>
        </article>

        <aside className="insight-card hover-card">
          <span className="kicker">AI UMKM Co-Pilot</span>

          <h2>Profil usaha membuat dashboard lebih personal.</h2>

          <p>
            Setelah profil dibuat, sistem akan menyiapkan kategori default untuk
            pemasukan dan pengeluaran. Data ini akan dipakai oleh dashboard,
            laporan laba rugi, stok, dan AI Assistant.
          </p>

          <div className="ai-summary">
            <small className="kicker">Akan disiapkan otomatis</small>
            <strong>Kategori Default</strong>

            <div className="progress-list">
              <div className="progress-item">
                <div className="progress-row">
                  <span>Pemasukan</span>
                  <span>Produk, jasa, lainnya</span>
                </div>
                <div className="progress-track">
                  <span className="progress-fill" style={{ width: "100%" }} />
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-row">
                  <span>Pengeluaran</span>
                  <span>Bahan, operasional, gaji</span>
                </div>
                <div className="progress-track">
                  <span className="progress-fill" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="auth-brand" style={{ marginTop: 18 }}>
            <div className="brand-mark" aria-hidden="true">
              <Sparkles />
            </div>

            <div className="auth-brand-text">
              <span>Next step</span>
              <strong>Mulai dari transaksi pertama</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}