import Link from "next/link";
import { Sparkles } from "lucide-react";
import { register } from "@/lib/actions/auth";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
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
            <span className="kicker">Mulai dari data sederhana</span>
            <h1>Bangun kebiasaan mencatat usaha dari hari pertama.</h1>
            <p>
              Cocok untuk UMKM yang ingin memahami pemasukan, pengeluaran, stok,
              dan estimasi laba tanpa spreadsheet rumit.
            </p>
          </div>

          <div className="auth-feature-grid">
            <div className="auth-feature">
              <strong>Gratis untuk MVP</strong>
              <small>Siapkan akun dan langsung buat profil usaha.</small>
            </div>

            <div className="auth-feature">
              <strong>Data Privat</strong>
              <small>Data user dibatasi berdasarkan pemilik usaha.</small>
            </div>

            <div className="auth-feature">
              <strong>Siap Deploy</strong>
              <small>Stack sudah disiapkan untuk Vercel dan Supabase.</small>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <article className="card auth-card hover-card">
            <div className="auth-card-header">
              <span className="eyebrow">Buat akun</span>
              <h2>Daftar AI UMKM</h2>
              <p>
                Setelah daftar, kamu akan diarahkan untuk membuat profil usaha.
              </p>
            </div>

            {params.error ? (
              <div className="auth-alert error">{params.error}</div>
            ) : null}

            <form action={register} className="auth-form">
              <div className="field">
                <label htmlFor="name">Nama</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nama kamu"
                  required
                />
              </div>

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
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>

              <button className="primary-button" type="submit">
                Daftar
              </button>
            </form>

            <p className="auth-footer">
              Sudah punya akun? <Link href="/login">Masuk</Link>
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}