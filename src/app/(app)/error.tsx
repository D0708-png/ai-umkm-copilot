"use client";

type AppErrorProps = {
  error: Error;
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-red-700">
            Terjadi Kesalahan
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-950">
            Halaman gagal dimuat
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Ada kendala saat memuat halaman ini. Coba muat ulang halaman atau
            kembali beberapa saat lagi.
          </p>

          <p className="mt-4 rounded-xl bg-red-50 p-4 text-xs text-red-700">
            {error.message}
          </p>

          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Coba Lagi
          </button>
        </div>
      </section>
    </main>
  );
}