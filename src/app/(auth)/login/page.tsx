import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-bold">Masuk</h1>
        <p className="mt-2 text-sm text-slate-300">
          Login akan dihubungkan dengan Supabase Auth pada step berikutnya.
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          />
          <button className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950">
            Masuk
          </button>
        </div>

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