import { createClient } from "@/lib/supabase/server";

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

export async function getDashboardSummary(businessId: string) {
  const supabase = await createClient();
  const { startDate, endDate } = getCurrentMonthRange();

  const { data: monthTransactions } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("business_id", businessId)
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate);

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
      .reduce((total, transaction) => total + Number(transaction.amount), 0) ?? 0;

  const expense =
    monthTransactions
      ?.filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount), 0) ?? 0;

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
    lowStock,
    productCount: products?.length ?? 0,
    recentTransactions: recentTransactions ?? [],
  };
}