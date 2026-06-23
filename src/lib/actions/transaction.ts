"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserBusiness } from "@/lib/services/business.service";
import type { TransactionType } from "@/types";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

function parseAmount(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return 0;
  }

  return Number(digits);
}
export async function createTransaction(formData: FormData) {
  const type = getString(formData, "type") as TransactionType;
  const categoryId = getString(formData, "category_id");
  const amountRaw = getString(formData, "amount");
  const description = getString(formData, "description");
  const transactionDate = getString(formData, "transaction_date");

  if (type !== "income" && type !== "expense") {
    redirectWithError("/transactions/new", "Jenis transaksi tidak valid.");
  }

  if (!amountRaw) {
  redirectWithError("/transactions/new", "Nominal transaksi wajib diisi.");
}

const amount = parseAmount(amountRaw);

if (!Number.isFinite(amount) || amount <= 0) {
  redirectWithError(
    "/transactions/new",
    "Nominal transaksi harus lebih besar dari 0."
  );
}

  if (!transactionDate) {
    redirectWithError("/transactions/new", "Tanggal transaksi wajib diisi.");
  }

  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const supabase = await createClient();

  let validCategoryId: string | null = null;

  if (categoryId) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, type")
      .eq("id", categoryId)
      .eq("business_id", business.id)
      .maybeSingle();

    if (categoryError || !category) {
      redirectWithError("/transactions/new", "Kategori tidak ditemukan.");
    }

    if (category.type !== type) {
      redirectWithError(
        "/transactions/new",
        "Kategori tidak sesuai dengan jenis transaksi."
      );
    }

    validCategoryId = category.id;
  }

  const { error } = await supabase.from("transactions").insert({
    business_id: business.id,
    category_id: validCategoryId,
    type,
    amount,
    description: description || null,
    transaction_date: transactionDate,
  });

  if (error) {
    redirectWithError("/transactions/new", "Transaksi gagal disimpan. Coba lagi.");
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");

  redirectWithMessage("/transactions", "Transaksi berhasil disimpan.");
}

export async function deleteTransaction(formData: FormData) {
  const transactionId = getString(formData, "transaction_id");

  if (!transactionId) {
    redirectWithError("/transactions", "Transaksi tidak ditemukan.");
  }

  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("business_id", business.id);

  if (error) {
    redirectWithError("/transactions", "Transaksi gagal dihapus.");
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");

  redirectWithMessage("/transactions", "Transaksi berhasil dihapus.");
}