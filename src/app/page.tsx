import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <h1 className="text-4xl font-bold">AI UMKM Co-Pilot</h1>
      <p className="mt-4 max-w-xl text-slate-300">
        Aplikasi manajemen keuangan, stok, dan AI assistant untuk UMKM kecil.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/register"
          className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950"
        >
          Daftar
        </Link>

        <Link
          href="/login"
          className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white"
        >
          Masuk
        </Link>
      </div>
    </main>
  );
}