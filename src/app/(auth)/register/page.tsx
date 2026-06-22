import Link from "next/link";
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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <div>
          <p className="text-sm font-medium text-emerald-300">
            AI UMKM Co-Pilot
          </p>
          <h1 className="mt-2 text-2xl font-bold">Daftar</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Buat akun untuk mulai mencatat dan memahami kondisi bisnis.
          </p>
        </div>

        {params.error ? (
          <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {params.error}
          </div>
        ) : null}

        <form action={register} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-200">
              Nama
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nama kamu"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

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
              placeholder="Minimal 6 karakter"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Daftar
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-emerald-300">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}