import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteTransaction } from "@/lib/actions/transaction";
import { getTransactionsPageData } from "@/lib/services/transaction.service";
import { formatCurrency } from "@/lib/utils/format";

type TransactionsPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const params = await searchParams;
  const { user, business, transactions, summary } =
    await getTransactionsPageData();

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
              Transaksi
            </h1>
            <p className="mt-2 text-slate-600">
              Catat dan pantau pemasukan serta pengeluaran usaha{" "}
              <span className="font-semibold text-slate-950">
                {business.name}
              </span>
              .
            </p>
          </div>

          <Link
            href="/transactions/new"
            className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Tambah Transaksi
          </Link>
        </div>

        {params.message ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {params.message}
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {params.error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Pemasukan</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.income)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Pengeluaran</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.expense)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Estimasi Laba</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {formatCurrency(summary.profit)}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-bold text-slate-950">Daftar Transaksi</h2>
          </div>

          {transactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-slate-950">
                Belum ada transaksi.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Mulai catat pemasukan atau pengeluaran pertama kamu.
              </p>
              <Link
                href="/transactions/new"
                className="mt-6 inline-flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Tambah Transaksi
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <div
                    key={transaction.id}
                    className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </span>

                        <span className="text-sm text-slate-500">
                          {transaction.transaction_date}
                        </span>
                      </div>

                      <p className="mt-2 font-semibold text-slate-950">
                        {transaction.description || "Tanpa deskripsi"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Kategori: {transaction.category?.name || "-"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p
                        className={`text-lg font-bold ${
                          isIncome ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(Number(transaction.amount))}
                      </p>

                      <form action={deleteTransaction}>
                        <input
                          type="hidden"
                          name="transaction_id"
                          value={transaction.id}
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}