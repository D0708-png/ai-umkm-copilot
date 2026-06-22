import { createClient } from "@/lib/supabase/server";
import { getCurrentUserBusiness } from "@/lib/services/business.service";
import { formatCurrency } from "@/lib/utils/format";

function getCurrentMonthRange() {
  const now = new Date();

  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  return {
    startDate,
    endDate,
  };
}

function getPreviousMonthRange() {
  const now = new Date();

  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    .toISOString()
    .slice(0, 10);

  const endDate = new Date(now.getFullYear(), now.getMonth(), 0)
    .toISOString()
    .slice(0, 10);

  return {
    startDate,
    endDate,
  };
}

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

type Summary = {
  currentMonth: {
    income: number;
    expense: number;
    profit: number;
    transactionCount: number;
  };
  previousMonth: {
    income: number;
    expense: number;
    profit: number;
  };
  expenseByCategory: {
    categoryName: string;
    total: number;
  }[];
  lowStockProducts: {
    name: string;
    current_stock: number;
    minimum_stock: number;
  }[];
  topMarginProducts: {
    name: string;
    margin: number;
    selling_price: number;
    cost_price: number;
  }[];
};

function generateAssistantAnswer(question: string, summary: Summary) {
  const normalizedQuestion = normalizeText(question);

  if (!normalizedQuestion) {
    return `Halo, saya siap membantu membaca kondisi bisnis kamu.

Kamu bisa bertanya seperti:
- Bulan ini saya untung berapa?
- Pengeluaran terbesar saya apa?
- Produk apa yang stoknya hampir habis?
- Apakah bisnis saya membaik dibanding bulan lalu?
- Produk mana yang margin-nya paling besar?`;
  }

  const { currentMonth, previousMonth } = summary;

  if (
    normalizedQuestion.includes("untung") ||
    normalizedQuestion.includes("laba") ||
    normalizedQuestion.includes("rugi")
  ) {
    if (currentMonth.transactionCount === 0) {
      return `Saya belum bisa menghitung laba bulan ini karena belum ada transaksi yang dicatat.

Mulai catat pemasukan dan pengeluaran terlebih dahulu, lalu saya bisa bantu menghitung estimasi laba usaha kamu.`;
    }

    const status = currentMonth.profit >= 0 ? "untung" : "rugi";

    return `Bulan ini usaha kamu diperkirakan ${status} sebesar ${formatCurrency(
      Math.abs(currentMonth.profit)
    )}.

Perhitungannya:
Pemasukan ${formatCurrency(currentMonth.income)} - Pengeluaran ${formatCurrency(
      currentMonth.expense
    )} = ${formatCurrency(currentMonth.profit)}.

Catatan: ini masih estimasi sederhana dari transaksi yang sudah kamu catat.`;
  }

  if (normalizedQuestion.includes("pemasukan")) {
    return `Total pemasukan bulan ini adalah ${formatCurrency(
      currentMonth.income
    )} dari data transaksi yang sudah dicatat.`;
  }

  if (
    normalizedQuestion.includes("pengeluaran") ||
    normalizedQuestion.includes("biaya")
  ) {
    if (currentMonth.expense === 0) {
      return `Belum ada pengeluaran yang tercatat bulan ini.`;
    }

    const topExpense = summary.expenseByCategory[0];

    if (!topExpense) {
      return `Total pengeluaran bulan ini adalah ${formatCurrency(
        currentMonth.expense
      )}.`;
    }

    return `Total pengeluaran bulan ini adalah ${formatCurrency(
      currentMonth.expense
    )}.

Pengeluaran terbesar berasal dari kategori ${topExpense.categoryName} sebesar ${formatCurrency(
      topExpense.total
    )}.`;
  }

  if (
    normalizedQuestion.includes("stok") ||
    normalizedQuestion.includes("restock") ||
    normalizedQuestion.includes("habis")
  ) {
    if (summary.lowStockProducts.length === 0) {
      return `Tidak ada produk dengan stok rendah saat ini.

Semua produk masih berada di atas batas minimum stok yang kamu tentukan.`;
    }

    const productList = summary.lowStockProducts
      .slice(0, 5)
      .map(
        (product, index) =>
          `${index + 1}. ${product.name} — stok ${product.current_stock}, minimum ${product.minimum_stock}`
      )
      .join("\n");

    return `Ada ${summary.lowStockProducts.length} produk yang perlu diperhatikan karena stoknya rendah:

${productList}

Sebaiknya cek produk tersebut agar tidak kehabisan stok saat ada permintaan.`;
  }

  if (
    normalizedQuestion.includes("margin") ||
    normalizedQuestion.includes("harga") ||
    normalizedQuestion.includes("produk paling untung")
  ) {
    if (summary.topMarginProducts.length === 0) {
      return `Saya belum menemukan data produk dengan margin yang bisa dihitung.

Pastikan produk sudah memiliki harga modal dan harga jual.`;
    }

    const productList = summary.topMarginProducts
      .slice(0, 5)
      .map(
        (product, index) =>
          `${index + 1}. ${product.name} — margin ${formatCurrency(
            product.margin
          )} per produk`
      )
      .join("\n");

    return `Produk dengan margin terbesar saat ini:

${productList}

Margin dihitung dari harga jual dikurangi harga modal.`;
  }

  if (
    normalizedQuestion.includes("bulan lalu") ||
    normalizedQuestion.includes("membaik") ||
    normalizedQuestion.includes("naik") ||
    normalizedQuestion.includes("turun")
  ) {
    const profitDiff = currentMonth.profit - previousMonth.profit;

    if (currentMonth.transactionCount === 0) {
      return `Belum ada transaksi bulan ini, jadi saya belum bisa membandingkan performa bisnis dengan bulan lalu.`;
    }

    if (profitDiff > 0) {
      return `Bulan ini terlihat lebih baik dibanding bulan lalu.

Estimasi laba bulan ini: ${formatCurrency(currentMonth.profit)}
Estimasi laba bulan lalu: ${formatCurrency(previousMonth.profit)}

Selisihnya naik sekitar ${formatCurrency(profitDiff)}.`;
    }

    if (profitDiff < 0) {
      return `Bulan ini terlihat menurun dibanding bulan lalu.

Estimasi laba bulan ini: ${formatCurrency(currentMonth.profit)}
Estimasi laba bulan lalu: ${formatCurrency(previousMonth.profit)}

Selisihnya turun sekitar ${formatCurrency(Math.abs(profitDiff))}. Coba cek pengeluaran terbesar dan pemasukan bulan ini.`;
    }

    return `Estimasi laba bulan ini sama dengan bulan lalu, yaitu ${formatCurrency(
      currentMonth.profit
    )}.`;
  }

  if (
    normalizedQuestion.includes("saran") ||
    normalizedQuestion.includes("insight") ||
    normalizedQuestion.includes("perbaiki")
  ) {
    const insights: string[] = [];

    if (currentMonth.transactionCount === 0) {
      insights.push(
        "Mulai catat pemasukan dan pengeluaran harian agar kondisi bisnis bisa terbaca."
      );
    }

    if (currentMonth.expense > currentMonth.income) {
      insights.push(
        "Pengeluaran bulan ini lebih besar dari pemasukan. Coba cek kategori pengeluaran terbesar."
      );
    }

    if (summary.lowStockProducts.length > 0) {
      insights.push(
        `Ada ${summary.lowStockProducts.length} produk dengan stok rendah. Cek stok agar tidak kehabisan barang.`
      );
    }

    if (summary.expenseByCategory[0]) {
      insights.push(
        `Pengeluaran terbesar saat ini berasal dari kategori ${summary.expenseByCategory[0].categoryName}.`
      );
    }

    if (insights.length === 0) {
      insights.push(
        "Data bisnis kamu terlihat cukup aman berdasarkan catatan yang tersedia. Tetap rutin catat transaksi agar laporan lebih akurat."
      );
    }

    return `Berikut insight sederhana dari data bisnis kamu:

${insights.map((insight, index) => `${index + 1}. ${insight}`).join("\n")}`;
  }

  return `Saya belum sepenuhnya memahami pertanyaan itu.

Coba tanyakan tentang:
- laba bulan ini
- pemasukan
- pengeluaran terbesar
- stok rendah
- margin produk
- perbandingan dengan bulan lalu`;
}

export async function getAssistantPageData(question?: string) {
  const {
    user,
    business,
    error: businessError,
  } = await getCurrentUserBusiness();

  const cleanQuestion = question?.trim() ?? "";

  if (!user || !business) {
    return {
      user,
      business,
      question: cleanQuestion,
      answer: "",
      summary: null,
      error: businessError,
    };
  }

  const supabase = await createClient();

  const currentMonthRange = getCurrentMonthRange();
  const previousMonthRange = getPreviousMonthRange();

  const { data: currentTransactions } = await supabase
    .from("transactions")
    .select(
      `
      id,
      type,
      amount,
      categories (
        id,
        name,
        type
      )
    `
    )
    .eq("business_id", business.id)
    .gte("transaction_date", currentMonthRange.startDate)
    .lte("transaction_date", currentMonthRange.endDate);

  const { data: previousTransactions } = await supabase
    .from("transactions")
    .select("id, type, amount")
    .eq("business_id", business.id)
    .gte("transaction_date", previousMonthRange.startDate)
    .lte("transaction_date", previousMonthRange.endDate);

  const { data: products } = await supabase
    .from("products")
    .select("id, name, cost_price, selling_price, current_stock, minimum_stock")
    .eq("business_id", business.id);

  const normalizedCurrentTransactions =
    currentTransactions?.map((transaction) => {
      const category = Array.isArray(transaction.categories)
        ? transaction.categories[0] ?? null
        : transaction.categories ?? null;

      return {
        ...transaction,
        category,
      };
    }) ?? [];

  const currentIncome = normalizedCurrentTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const currentExpense = normalizedCurrentTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const previousIncome =
    previousTransactions
      ?.filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + Number(transaction.amount), 0) ??
    0;

  const previousExpense =
    previousTransactions
      ?.filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount), 0) ??
    0;

  const expenseMap = new Map<string, number>();

  normalizedCurrentTransactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const categoryName = transaction.category?.name || "Tanpa kategori";
      const currentTotal = expenseMap.get(categoryName) ?? 0;

      expenseMap.set(categoryName, currentTotal + Number(transaction.amount));
    });

  const expenseByCategory = Array.from(expenseMap.entries())
    .map(([categoryName, total]) => ({
      categoryName,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  const productList = products ?? [];

  const lowStockProducts = productList
    .filter(
      (product) =>
        Number(product.current_stock) <= Number(product.minimum_stock)
    )
    .map((product) => ({
      name: product.name,
      current_stock: Number(product.current_stock),
      minimum_stock: Number(product.minimum_stock),
    }));

  const topMarginProducts = productList
    .map((product) => ({
      name: product.name,
      cost_price: Number(product.cost_price),
      selling_price: Number(product.selling_price),
      margin: Number(product.selling_price) - Number(product.cost_price),
    }))
    .filter((product) => product.margin > 0)
    .sort((a, b) => b.margin - a.margin);

  const summary: Summary = {
    currentMonth: {
      income: currentIncome,
      expense: currentExpense,
      profit: currentIncome - currentExpense,
      transactionCount: normalizedCurrentTransactions.length,
    },
    previousMonth: {
      income: previousIncome,
      expense: previousExpense,
      profit: previousIncome - previousExpense,
    },
    expenseByCategory,
    lowStockProducts,
    topMarginProducts,
  };

  const answer = generateAssistantAnswer(cleanQuestion, summary);

  return {
    user,
    business,
    question: cleanQuestion,
    answer,
    summary,
    error: null,
  };
}