import { createClient } from "@/lib/supabase/server";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

export async function getTransactionsPageData() {
  const {
    user,
    business,
    error: businessError,
  } = await getCurrentUserBusiness();

  if (!user || !business) {
    return {
      user,
      business,
      transactions: [],
      summary: {
        income: 0,
        expense: 0,
        profit: 0,
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

  const totalIncome = normalizedTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalExpense = normalizedTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  return {
    user,
    business,
    transactions: normalizedTransactions,
    summary: {
      income: totalIncome,
      expense: totalExpense,
      profit: totalIncome - totalExpense,
    },
    error,
  };
}

export async function getTransactionFormData() {
  const {
    user,
    business,
    error: businessError,
  } = await getCurrentUserBusiness();

  if (!user || !business) {
    return {
      user,
      business,
      categories: [],
      error: businessError,
    };
  }

  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, type")
    .eq("business_id", business.id)
    .order("type", { ascending: false })
    .order("name", { ascending: true });

  return {
    user,
    business,
    categories: categories ?? [],
    error,
  };
}