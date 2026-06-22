import Link from "next/link";
import { redirect } from "next/navigation";
import { getAssistantPageData } from "@/lib/services/assistant.service";
import { formatCurrency } from "@/lib/utils/format";

type AssistantPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AssistantPage({
  searchParams,
}: AssistantPageProps) {
  const params = await searchParams;

  const { user, business, question, answer, summary } =
    await getAssistantPageData(params.q);

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              AI UMKM Co-Pilot
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              AI Assistant
            </h1>
            <p className="mt-2 text-slate-600">
              Tanya kondisi bisnis{" "}
              <span className="font-semibold text-slate-950">
                {business.name}
              </span>{" "}
              dengan bahasa sederhana.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Kembali ke Dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-950">
              Tanya Assistant
            </h2>

            <form action="/assistant" className="mt-5">
              <label htmlFor="q" className="text-sm font-medium text-slate-700">
                Pertanyaan
              </label>

              <textarea
                id="q"
                name="q"
                rows={4}
                defaultValue={question}
                placeholder="Contoh: Bulan ini saya untung berapa?"
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/assistant"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Reset
                </Link>

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Tanya AI
                </button>
              </div>
            </form>

            <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <p className="text-sm font-semibold text-emerald-800">
                Jawaban Assistant
              </p>

              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-emerald-950">
                {answer}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">
                Contoh Pertanyaan
              </h2>

              <div className="mt-4 space-y-3">
                {[
                  "Bulan ini saya untung berapa?",
                  "Pengeluaran terbesar saya apa?",
                  "Produk apa yang stoknya hampir habis?",
                  "Apakah bisnis saya membaik dibanding bulan lalu?",
                  "Produk mana yang margin-nya paling besar?",
                  "Apa insight bisnis saya bulan ini?",
                ].map((sampleQuestion) => (
                  <Link
                    key={sampleQuestion}
                    href={`/assistant?q=${encodeURIComponent(sampleQuestion)}`}
                    className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    {sampleQuestion}
                  </Link>
                ))}
              </div>
            </div>

            {summary ? (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950">
                  Ringkasan Data
                </h2>

                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-slate-500">Pemasukan bulan ini</p>
                    <p className="font-bold text-slate-950">
                      {formatCurrency(summary.currentMonth.income)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Pengeluaran bulan ini</p>
                    <p className="font-bold text-slate-950">
                      {formatCurrency(summary.currentMonth.expense)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Estimasi laba bulan ini</p>
                    <p
                      className={`font-bold ${
                        summary.currentMonth.profit >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {formatCurrency(summary.currentMonth.profit)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Produk stok rendah</p>
                    <p className="font-bold text-slate-950">
                      {summary.lowStockProducts.length} produk
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-950">
            Catatan MVP
          </h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Assistant saat ini menjawab berdasarkan data ringkasan dari database,
            belum memakai LLM API eksternal. Ini sengaja dibuat agar aman,
            murah, dan tidak mengarang angka pada versi MVP.
          </p>
        </div>
      </section>
    </main>
  );
}