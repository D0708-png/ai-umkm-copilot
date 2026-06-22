import { createClient } from "@/lib/supabase/server";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

export async function getStockPageData() {
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
      stockMovements: [],
      lowStockProducts: [],
      error: businessError,
    };
  }

  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("business_id", business.id)
    .order("name", { ascending: true });

  const { data: stockMovements, error } = await supabase
    .from("stock_movements")
    .select(
      `
      id,
      type,
      quantity,
      note,
      created_at,
      products (
        id,
        name
      )
    `
    )
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(30);

  const normalizedStockMovements =
    stockMovements?.map((movement) => {
      const product = Array.isArray(movement.products)
        ? movement.products[0] ?? null
        : movement.products ?? null;

      return {
        ...movement,
        product,
      };
    }) ?? [];

  const productList = products ?? [];

  const lowStockProducts = productList.filter(
    (product) => Number(product.current_stock) <= Number(product.minimum_stock)
  );

  return {
    user,
    business,
    products: productList,
    stockMovements: normalizedStockMovements,
    lowStockProducts,
    error,
  };
}