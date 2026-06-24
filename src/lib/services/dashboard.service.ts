import { createClient } from "@/lib/supabase/server";

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
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

export async function getDashboardSummary(businessId: string) {
  const supabase = await createClient();
  const { startDate, endDate } = getCurrentMonthRange();
  const last7Days = getLast7Days();

  const { data: monthTransactions } = await supabase
    .from("transactions")
    .select("type, amount")
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

  const { data: products } = await supabase
    .from("products")
    .select("current_stock, minimum_stock")
    .eq("business_id", businessId);

  const income =
    monthTransactions
      ?.filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + Number(transaction.amount), 0) ??
    0;

  const expense =
    monthTransactions
      ?.filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount), 0) ??
    0;

  const chartData = last7Days.map((day) => {
    const dailyTransactions =
      last7DayTransactions?.filter(
        (transaction) => transaction.transaction_date === day.date
      ) ?? [];

    const dailyIncome = dailyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const dailyExpense = dailyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    return {
      label: day.label,
      income: dailyIncome,
      expense: dailyExpense,
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
    income,
    expense,
    profit: income - expense,
    last7DaysIncome,
    last7DaysExpense,
    last7DaysProfit: last7DaysIncome - last7DaysExpense,
    lowStock,
    productCount: products?.length ?? 0,
    recentTransactions: recentTransactions ?? [],
    chartData,
  };
}