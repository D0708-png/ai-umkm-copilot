import Link from "next/link";
import { Sparkles } from "lucide-react";
import { login } from "@/lib/actions/auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero hover-card">
          <div className="auth-brand">
            <div className="brand-mark" aria-hidden="true">
              <Sparkles />
            </div>

            <div className="auth-brand-text">
              <span>AI UMKM</span>
              <strong>Co-Pilot</strong>
            </div>
          </div>

          <div className="auth-hero-content">
            <span className="kicker">Premium Dashboard</span>
            <h1>Kelola usaha kecil dengan data yang lebih jelas.</h1>
            <p>
              Catat transaksi, pantau stok, baca laporan laba rugi, dan tanyakan
              kondisi bisnis ke AI Assistant dari satu dashboard.
            </p>
          </div>

          <div className="auth-feature-grid">
            <div className="auth-feature">
              <strong>Transaksi</strong>
              <small>Pemasukan dan pengeluaran harian tercatat rapi.</small>
            </div>

            <div className="auth-feature">
              <strong>Stok</strong>
              <small>Produk stok rendah lebih cepat terlihat.</small>
            </div>

            <div className="auth-feature">
              <strong>AI Insight</strong>
              <small>Assistant membaca data usaha yang kamu input.</small>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <article className="card auth-card hover-card">
            <div className="auth-card-header">
              <span className="eyebrow">Selamat datang</span>
              <h2>Masuk ke akun</h2>
              <p>
                Gunakan email dan password untuk melanjutkan ke dashboard usaha.
              </p>
            </div>

            {params.message ? (
              <div className="auth-alert success">{params.message}</div>
            ) : null}

            {params.error ? (
              <div className="auth-alert error">{params.error}</div>
            ) : null}

            <form action={login} className="auth-form">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>

              <button className="primary-button" type="submit">
                Masuk
              </button>
            </form>

            <p className="auth-footer">
              Belum punya akun? <Link href="/register">Daftar sekarang</Link>
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}