"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

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

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

export async function createProduct(formData: FormData) {
  const name = getString(formData, "name");
  const sku = getString(formData, "sku");
  const costPrice = parseNumber(getString(formData, "cost_price"));
  const sellingPrice = parseNumber(getString(formData, "selling_price"));
  const currentStock = parseNumber(getString(formData, "current_stock"));
  const minimumStock = parseNumber(getString(formData, "minimum_stock"));

  if (!name) {
    redirectWithError("/products/new", "Nama produk wajib diisi.");
  }

  if (costPrice < 0 || sellingPrice < 0) {
    redirectWithError("/products/new", "Harga tidak boleh negatif.");
  }

  if (currentStock < 0 || minimumStock < 0) {
    redirectWithError("/products/new", "Stok tidak boleh negatif.");
  }

  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      business_id: business.id,
      name,
      sku: sku || null,
      cost_price: costPrice,
      selling_price: sellingPrice,
      current_stock: currentStock,
      minimum_stock: minimumStock,
    })
    .select("id")
    .single();

  if (error || !product) {
    redirectWithError("/products/new", "Produk gagal disimpan. Coba lagi.");
  }

  if (currentStock > 0) {
    await supabase.from("stock_movements").insert({
      business_id: business.id,
      product_id: product.id,
      type: "in",
      quantity: currentStock,
      note: "Stok awal",
    });
  }

  revalidatePath("/products");
  revalidatePath("/stocks");
  revalidatePath("/dashboard");

  redirectWithMessage("/products", "Produk berhasil disimpan.");
}

export async function deleteProduct(formData: FormData) {
  const productId = getString(formData, "product_id");

  if (!productId) {
    redirectWithError("/products", "Produk tidak ditemukan.");
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
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("business_id", business.id);

  if (error) {
    redirectWithError("/products", "Produk gagal dihapus.");
  }

  revalidatePath("/products");
  revalidatePath("/stocks");
  revalidatePath("/dashboard");

  redirectWithMessage("/products", "Produk berhasil dihapus.");
}