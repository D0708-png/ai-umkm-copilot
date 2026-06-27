import { createClient } from "@/lib/supabase/server";

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getJakartaISODate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function getCurrentMonthRange() {
  const now = new Date();

  const startDate = toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
  const endDate = toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0));

  return {
    startDate,
    endDate,
  };
}

function getLast7Days() {
  const now = new Date();

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));

    return {
      date: toISODate(date),
      label: new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
      }).format(date),
    };
  });
}

function summarizeTransactions(
  transactions:
    | {
        type: string;
        amount: number | string;
        transaction_date?: string;
      }[]
    | null
    | undefined
) {
  const rows = transactions ?? [];

  const income = rows
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expense = rows
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  return {
    income,
    expense,
    profit: income - expense,
    transactionCount: rows.length,
  };
}

export async function getDashboardSummary(businessId: string) {
  const supabase = await createClient();

  const { startDate, endDate } = getCurrentMonthRange();
  const todayDate = getJakartaISODate();
  const last7Days = getLast7Days();

  const { data: monthTransactions } = await supabase
    .from("transactions")
    .select("type, amount, transaction_date")
    .eq("business_id", businessId)
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate);

  const { data: last7DayTransactions } = await supabase
    .from("transactions")
    .select("type, amount, transaction_date")
    .eq("business_id", businessId)
    .gte("transaction_date", last7Days[0].date)
    .lte("transaction_date", last7Days[last7Days.length - 1].date);

  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("id, type, amount, description, transaction_date")
    .eq("business_id", businessId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: todayTransactions } = await supabase
    .from("transactions")
    .select("type, amount, transaction_date")
    .eq("business_id", businessId)
    .eq("transaction_date", todayDate);

  const latestTransactionDate = recentTransactions?.[0]?.transaction_date;
  const shouldUseLatestDate =
    (todayTransactions?.length ?? 0) === 0 && Boolean(latestTransactionDate);

  const { data: latestDateTransactions } = shouldUseLatestDate
    ? await supabase
        .from("transactions")
        .select("type, amount, transaction_date")
        .eq("business_id", businessId)
        .eq("transaction_date", latestTransactionDate)
    : { data: null };

  const insightTransactions = shouldUseLatestDate
    ? latestDateTransactions ?? []
    : todayTransactions ?? [];

  const insightDate = shouldUseLatestDate
    ? latestTransactionDate ?? todayDate
    : todayDate;

  const insightMode = shouldUseLatestDate ? "latest" : "today";

  const { data: products } = await supabase
    .from("products")
    .select("current_stock, minimum_stock")
    .eq("business_id", businessId);

  const monthSummary = summarizeTransactions(monthTransactions);
  const insightSummary = summarizeTransactions(insightTransactions);

  const chartData = last7Days.map((day) => {
    const dailyTransactions =
      last7DayTransactions?.filter(
        (transaction) => transaction.transaction_date === day.date
      ) ?? [];

    const dailySummary = summarizeTransactions(dailyTransactions);

    return {
      label: day.label,
      income: dailySummary.income,
      expense: dailySummary.expense,
    };
  });

  const last7DaysIncome = chartData.reduce(
    (total, item) => total + item.income,
    0
  );

  const last7DaysExpense = chartData.reduce(
    (total, item) => total + item.expense,
    0
  );

  const lowStock =
    products?.filter(
      (product) => Number(product.current_stock) <= Number(product.minimum_stock)
    ).length ?? 0;

  return {
    period: {
      startDate,
      endDate,
    },
    income: monthSummary.income,
    expense: monthSummary.expense,
    profit: monthSummary.profit,
    last7DaysIncome,
    last7DaysExpense,
    last7DaysProfit: last7DaysIncome - last7DaysExpense,

    todayIncome: insightSummary.income,
    todayExpense: insightSummary.expense,
    todayProfit: insightSummary.profit,
    todayTransactionCount: insightSummary.transactionCount,

    insightDate,
    insightMode,

    lowStock,
    productCount: products?.length ?? 0,
    recentTransactions: recentTransactions ?? [],
    chartData,
  };
}