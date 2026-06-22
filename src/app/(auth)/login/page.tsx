import Link from "next/link";
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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <div>
          <p className="text-sm font-medium text-emerald-300">
            AI UMKM Co-Pilot
          </p>
          <h1 className="mt-2 text-2xl font-bold">Masuk</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Masuk untuk mengelola transaksi, produk, stok, dan insight bisnis.
          </p>
        </div>

        {params.message ? (
          <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {params.message}
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {params.error}
          </div>
        ) : null}

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Masuk
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-emerald-300">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  );
}