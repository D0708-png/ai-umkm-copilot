"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

function redirectWithError(message: string): never {
  redirect(`/settings?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(message: string): never {
  redirect(`/settings?message=${encodeURIComponent(message)}`);
}

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function currentMonthDate(day: number) {
  const now = new Date();
  return toISODate(new Date(now.getFullYear(), now.getMonth(), day));
}

function previousMonthDate(day: number) {
  const now = new Date();
  return toISODate(new Date(now.getFullYear(), now.getMonth() - 1, day));
}

type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
};

function findCategory(
  categories: Category[],
  name: string,
  type: "income" | "expense"
) {
  return (
    categories.find(
      (category) => category.name === name && category.type === type
    )?.id ?? null
  );
}

export async function seedDemoData() {
  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const supabase = await createClient();

  const { data: existingProducts } = await supabase
    .from("products")
    .select("id")
    .eq("business_id", business.id)
    .like("sku", "DEMO-%")
    .limit(1);

  const { data: existingTransactions } = await supabase
    .from("transactions")
    .select("id")
    .eq("business_id", business.id)
    .ilike("description", "DEMO:%")
    .limit(1);

  if (
    (existingProducts && existingProducts.length > 0) ||
    (existingTransactions && existingTransactions.length > 0)
  ) {
    redirectWithError("Demo data sudah pernah ditambahkan.");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, type")
    .eq("business_id", business.id);

  const categoryList = (categories ?? []) as Category[];

  const penjualanProduk = findCategory(
    categoryList,
    "Penjualan produk",
    "income"
  );
  const jasa = findCategory(categoryList, "Jasa", "income");
  const belanjaBahan = findCategory(categoryList, "Belanja bahan", "expense");
  const operasional = findCategory(categoryList, "Operasional", "expense");
  const transportasi = findCategory(categoryList, "Transportasi", "expense");
  const gaji = findCategory(categoryList, "Gaji", "expense");
  const listrik = findCategory(categoryList, "Listrik", "expense");

  const { data: products, error: productError } = await supabase
    .from("products")
    .insert([
      {
        business_id: business.id,
        name: "DEMO: Es Kopi Susu",
        sku: "DEMO-EKS",
        cost_price: 8000,
        selling_price: 15000,
        current_stock: 8,
        minimum_stock: 10,
      },
      {
        business_id: business.id,
        name: "DEMO: Nasi Ayam",
        sku: "DEMO-NAY",
        cost_price: 12000,
        selling_price: 25000,
        current_stock: 20,
        minimum_stock: 5,
      },
      {
        business_id: business.id,
        name: "DEMO: Roti Bakar",
        sku: "DEMO-RTB",
        cost_price: 6000,
        selling_price: 12000,
        current_stock: 4,
        minimum_stock: 5,
      },
    ])
    .select("id, current_stock");

  if (productError || !products) {
    redirectWithError("Gagal membuat produk demo.");
  }

  const stockMovements = products
    .filter((product) => Number(product.current_stock) > 0)
    .map((product) => ({
      business_id: business.id,
      product_id: product.id,
      type: "in",
      quantity: Number(product.current_stock),
      note: "DEMO: Stok awal",
    }));

  if (stockMovements.length > 0) {
    await supabase.from("stock_movements").insert(stockMovements);
  }

  const { error: transactionError } = await supabase.from("transactions").insert([
    {
      business_id: business.id,
      category_id: penjualanProduk,
      type: "income",
      amount: 4500000,
      description: "DEMO: Penjualan produk offline bulan ini",
      transaction_date: currentMonthDate(5),
    },
    {
      business_id: business.id,
      category_id: penjualanProduk,
      type: "income",
      amount: 3000000,
      description: "DEMO: Penjualan marketplace bulan ini",
      transaction_date: currentMonthDate(10),
    },
    {
      business_id: business.id,
      category_id: jasa,
      type: "income",
      amount: 1000000,
      description: "DEMO: Pendapatan jasa catering bulan ini",
      transaction_date: currentMonthDate(14),
    },
    {
      business_id: business.id,
      category_id: belanjaBahan,
      type: "expense",
      amount: 2100000,
      description: "DEMO: Belanja bahan baku bulan ini",
      transaction_date: currentMonthDate(6),
    },
    {
      business_id: business.id,
      category_id: operasional,
      type: "expense",
      amount: 1200000,
      description: "DEMO: Biaya operasional bulan ini",
      transaction_date: currentMonthDate(8),
    },
    {
      business_id: business.id,
      category_id: transportasi,
      type: "expense",
      amount: 500000,
      description: "DEMO: Transportasi bulan ini",
      transaction_date: currentMonthDate(11),
    },
    {
      business_id: business.id,
      category_id: listrik,
      type: "expense",
      amount: 900000,
      description: "DEMO: Listrik dan kebutuhan outlet bulan ini",
      transaction_date: currentMonthDate(15),
    },
    {
      business_id: business.id,
      category_id: gaji,
      type: "expense",
      amount: 500000,
      description: "DEMO: Bantuan tenaga kerja bulan ini",
      transaction_date: currentMonthDate(18),
    },
    {
      business_id: business.id,
      category_id: penjualanProduk,
      type: "income",
      amount: 7000000,
      description: "DEMO: Penjualan bulan lalu",
      transaction_date: previousMonthDate(12),
    },
    {
      business_id: business.id,
      category_id: belanjaBahan,
      type: "expense",
      amount: 4900000,
      description: "DEMO: Pengeluaran bulan lalu",
      transaction_date: previousMonthDate(15),
    },
  ]);

  if (transactionError) {
    redirectWithError("Gagal membuat transaksi demo.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/products");
  revalidatePath("/stocks");
  revalidatePath("/reports/profit");
  revalidatePath("/assistant");
  revalidatePath("/settings");

  redirectWithMessage("Demo data berhasil ditambahkan.");
}