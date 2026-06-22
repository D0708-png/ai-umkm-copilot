import { createClient } from "@/lib/supabase/server";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

export async function getProductsPageData() {
  const {
    user,
    business,
    error: businessError,
  } = await getCurrentUserBusiness();

  if (!user || !business) {
    return {
      user,
      business,
      products: [],
      summary: {
        productCount: 0,
        lowStockCount: 0,
      },
      error: businessError,
    };
  }

  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const productList = products ?? [];

  const lowStockCount = productList.filter(
    (product) => Number(product.current_stock) <= Number(product.minimum_stock)
  ).length;

  return {
    user,
    business,
    products: productList,
    summary: {
      productCount: productList.length,
      lowStockCount,
    },
    error,
  };
}

export async function getProductFormData() {
  const {
    user,
    business,
    error: businessError,
  } = await getCurrentUserBusiness();

  return {
    user,
    business,
    error: businessError,
  };
}