import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Send } from "lucide-react";
import { getAssistantPageData } from "@/lib/services/assistant.service";
import { formatCurrency } from "@/lib/utils/format";

type AssistantPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const sampleQuestions = [
  "Pengeluaran terbesar saya apa?",
  "Produk apa yang stoknya hampir habis?",
  "Apakah bisnis saya membaik dibanding bulan lalu?",
  "Produk mana yang margin-nya paling besar?",
];

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

  const defaultAssistantMessage =
    "Halo, saya sudah membaca data usaha kamu. Kamu bisa tanya soal laba, stok, pengeluaran terbesar, margin produk, atau rekomendasi bisnis.";

  const currentProfit = summary?.currentMonth.profit ?? 0;
  const isProfit = currentProfit >= 0;

  return (
    <section
      className="content-section is-active"
      id="assistant"
      data-title="AI Assistant"
      data-desc={`Tanya kondisi bisnis ${business.name} dengan bahasa sehari-hari.`}
    >
      <div className="grid assistant-layout">
        <article className="card chat-card hover-card">
          <div className="panel-header">
            <div>
              <h2>Ruang Konsultasi AI</h2>
              <p>
                  Ajukan pertanyaan tentang pemasukan, pengeluaran, stok, margin produk, dan
                  kondisi usaha berdasarkan data yang sudah dicatat.
              </p>
            </div>
          </div>

          <div className="chat-thread" id="chatThread">
            <div className="message assistant">
              <strong>UMKM Co-Pilot</strong>
              <p>{defaultAssistantMessage}</p>
            </div>

            {question ? (
              <div className="message user">
                <strong>Kamu</strong>
                <p>{question}</p>
              </div>
            ) : null}

            <div className="message assistant">
              <strong>UMKM Co-Pilot</strong>
              <p>{answer}</p>
            </div>
          </div>

          <form action="/assistant" className="chat-composer">
            <textarea
              className="chat-input"
              id="chatInput"
              name="q"
              rows={1}
              defaultValue={question}
              placeholder="Tulis pertanyaan, misalnya: produk apa yang harus saya restock?"
            />

            <button className="primary-button" type="submit">
              <Send />
              Tanya
            </button>
          </form>
        </article>

        <aside className="grid">
          <article className="card hover-card">
            <div className="panel-header">
              <div>
                <h2>Contoh Pertanyaan</h2>
                <p>Pilih prompt untuk langsung bertanya ke assistant.</p>
              </div>
            </div>

            <div className="prompt-list">
              {sampleQuestions.map((sampleQuestion) => (
                <Link
                  key={sampleQuestion}
                  href={`/assistant?q=${encodeURIComponent(sampleQuestion)}`}
                >
                  {sampleQuestion}
                  <ArrowRight />
                </Link>
              ))}
            </div>
          </article>

          <article className="insight-card hover-card">
            <span className="kicker">Ringkasan Data</span>

            <h2>
              {summary
                ? isProfit
                  ? "Laba bulan ini masih positif."
                  : "Arus kas perlu diperhatikan."
                : "Belum ada ringkasan data."}
            </h2>

            {summary ? (
              <p>
                Pemasukan bulan ini {formatCurrency(summary.currentMonth.income)}
                , pengeluaran {formatCurrency(summary.currentMonth.expense)}, dan
                estimasi laba {formatCurrency(summary.currentMonth.profit)}.
                Ada {summary.lowStockProducts.length} produk dengan stok rendah.
              </p>
            ) : (
              <p>
                Lengkapi transaksi dan produk agar AI Assistant bisa membaca
                kondisi usaha dengan lebih baik.
              </p>
            )}
          </article>

          {summary ? (
            <article className="card hover-card">
              <div className="panel-header">
                <div>
                  <h2>Snapshot Bulan Ini</h2>
                  <p>Data ringkas yang menjadi dasar jawaban assistant.</p>
                </div>
              </div>

              <div className="stock-list">
                <div className="stock-row">
                  <div className="row-title">
                    <strong>Pemasukan</strong>
                    <small>{formatCurrency(summary.currentMonth.income)}</small>
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
                  <span className="tag income">Revenue</span>
                </div>

                <div className="stock-row">
                  <div className="row-title">
                    <strong>Pengeluaran</strong>
                    <small>{formatCurrency(summary.currentMonth.expense)}</small>
                    <div className="bar">
                      <span
                        style={
                          {
                            "--w": "100%",
                            "--bar": "var(--red)",
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                  <span className="tag expense">Expense</span>
                </div>

                <div className="stock-row">
                  <div className="row-title">
                    <strong>Stok Rendah</strong>
                    <small>{summary.lowStockProducts.length} produk</small>
                    <div className="bar">
                      <span
                        style={
                          {
                            "--w":
                              summary.lowStockProducts.length > 0
                                ? "55%"
                                : "100%",
                            "--bar":
                              summary.lowStockProducts.length > 0
                                ? "var(--amber)"
                                : "var(--emerald)",
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                  <span
                    className={
                      summary.lowStockProducts.length > 0
                        ? "tag warning"
                        : "tag income"
                    }
                  >
                    {summary.lowStockProducts.length > 0 ? "Cek" : "Aman"}
                  </span>
                </div>
              </div>
            </article>
          ) : null}
        </aside>
      </div>
    </section>
  );
}