import { createClient } from "@/lib/supabase/server";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

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

function isValidDate(value?: string) {
  if (!value) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

type GetProfitReportParams = {
  startDate?: string;
  endDate?: string;
};

export async function getProfitReportData(params: GetProfitReportParams) {
  const {
    user,
    business,
    error: businessError,
  } = await getCurrentUserBusiness();

  const defaultRange = getCurrentMonthRange();

  const startDate = isValidDate(params.startDate)
    ? params.startDate!
    : defaultRange.startDate;

  const endDate = isValidDate(params.endDate)
    ? params.endDate!
    : defaultRange.endDate;

  if (!user || !business) {
    return {
      user,
      business,
      period: {
        startDate,
        endDate,
      },
      transactions: [],
      expenseByCategory: [],
      summary: {
        income: 0,
        expense: 0,
        profit: 0,
        transactionCount: 0,
      },
      error: businessError,
    };
  }

  const supabase = await createClient();

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      type,
      amount,
      description,
      transaction_date,
      created_at,
      categories (
        id,
        name,
        type
      )
    `
    )
    .eq("business_id", business.id)
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  const normalizedTransactions =
    transactions?.map((transaction) => {
      const category = Array.isArray(transaction.categories)
        ? transaction.categories[0] ?? null
        : transaction.categories ?? null;

      return {
        ...transaction,
        category,
      };
    }) ?? [];

  const income = normalizedTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expense = normalizedTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expenseMap = new Map<string, number>();

  normalizedTransactions
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

  return {
    user,
    business,
    period: {
      startDate,
      endDate,
    },
    transactions: normalizedTransactions,
    expenseByCategory,
    summary: {
      income,
      expense,
      profit: income - expense,
      transactionCount: normalizedTransactions.length,
    },
    error,
  };
}