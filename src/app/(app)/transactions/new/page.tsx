import Link from "next/link";
import { CurrencyInput } from "@/components/ui/currency-input";
import { redirect } from "next/navigation";
import { createTransaction } from "@/lib/actions/transaction";
import { getTransactionFormData } from "@/lib/services/transaction.service";

type NewTransactionPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewTransactionPage({
  searchParams,
}: NewTransactionPageProps) {
  const params = await searchParams;
  const { user, business, categories } = await getTransactionFormData();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const incomeCategories = categories.filter(
    (category) => category.type === "income"
  );

  const expenseCategories = categories.filter(
    (category) => category.type === "expense"
  );

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-3xl">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            AI UMKM Co-Pilot
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Tambah Transaksi
          </h1>
          <p className="mt-2 text-slate-600">
            Catat pemasukan atau pengeluaran usaha{" "}
            <span className="font-semibold text-slate-950">
              {business.name}
            </span>
            .
          </p>
        </div>

        {params.error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {params.error}
          </div>
        ) : null}

        <form
          action={createTransaction}
          className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="type"
                className="text-sm font-medium text-slate-700"
              >
                Jenis Transaksi
              </label>
              <select
                id="type"
                name="type"
                required
                defaultValue="income"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
              >
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Pastikan kategori yang dipilih sesuai dengan jenis transaksi.
              </p>
            </div>

            <div>
              <label
                htmlFor="category_id"
                className="text-sm font-medium text-slate-700"
              >
                Kategori
              </label>
              <select
                id="category_id"
                name="category_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
              >
                <option value="">Tanpa kategori</option>

                {incomeCategories.length > 0 ? (
                  <optgroup label="Pemasukan">
                    {incomeCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null}

                {expenseCategories.length > 0 ? (
                  <optgroup label="Pengeluaran">
                    {expenseCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </select>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="text-sm font-medium text-slate-700"
              >
                Nominal
              </label>
              <CurrencyInput
  id="amount"
  name="amount"
  placeholder="Contoh: 140.500"
  required
/>
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-700"
              >
                Deskripsi
              </label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="Contoh: Jual nasi ayam 1 porsi"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="transaction_date"
                className="text-sm font-medium text-slate-700"
              >
                Tanggal Transaksi
              </label>
              <input
                id="transaction_date"
                name="transaction_date"
                type="date"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/transactions"
              className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}