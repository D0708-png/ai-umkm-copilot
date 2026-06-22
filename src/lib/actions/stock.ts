"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserBusiness } from "@/lib/services/business.service";
import type { StockMovementType } from "@/types";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function parseNumber(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return Number(normalized || 0);
}

function redirectWithError(message: string): never {
  redirect(`/stocks?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(message: string): never {
  redirect(`/stocks?message=${encodeURIComponent(message)}`);
}

export async function createStockMovement(formData: FormData) {
  const productId = getString(formData, "product_id");
  const type = getString(formData, "type") as StockMovementType;
  const quantity = parseNumber(getString(formData, "quantity"));
  const note = getString(formData, "note");

  if (!productId) {
    redirectWithError("Produk wajib dipilih.");
  }

  if (type !== "in" && type !== "out") {
    redirectWithError("Jenis stok tidak valid.");
  }

  if (!quantity || Number.isNaN(quantity) || quantity <= 0) {
    redirectWithError("Jumlah stok harus lebih besar dari 0.");
  }

  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, current_stock")
    .eq("id", productId)
    .eq("business_id", business.id)
    .maybeSingle();

  if (productError || !product) {
    redirectWithError("Produk tidak ditemukan.");
  }

  const currentStock = Number(product.current_stock);
  const newStock = type === "in" ? currentStock + quantity : currentStock - quantity;

  if (newStock < 0) {
    redirectWithError("Stok keluar tidak boleh lebih besar dari stok tersedia.");
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      current_stock: newStock,
    })
    .eq("id", product.id)
    .eq("business_id", business.id);

  if (updateError) {
    redirectWithError("Stok produk gagal diperbarui.");
  }

  const { error: movementError } = await supabase.from("stock_movements").insert({
    business_id: business.id,
    product_id: product.id,
    type,
    quantity,
    note: note || null,
  });

  if (movementError) {
    redirectWithError("Riwayat stok gagal disimpan.");
  }

  revalidatePath("/stocks");
  revalidatePath("/products");
  revalidatePath("/dashboard");

  redirectWithMessage("Perubahan stok berhasil disimpan.");
}