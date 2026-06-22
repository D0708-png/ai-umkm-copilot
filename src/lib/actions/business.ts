"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const defaultCategories = [
  {
    name: "Penjualan produk",
    type: "income",
  },
  {
    name: "Jasa",
    type: "income",
  },
  {
    name: "Pendapatan lain",
    type: "income",
  },
  {
    name: "Belanja bahan",
    type: "expense",
  },
  {
    name: "Operasional",
    type: "expense",
  },
  {
    name: "Transportasi",
    type: "expense",
  },
  {
    name: "Gaji",
    type: "expense",
  },
  {
    name: "Sewa",
    type: "expense",
  },
  {
    name: "Listrik",
    type: "expense",
  },
  {
    name: "Internet",
    type: "expense",
  },
  {
    name: "Lainnya",
    type: "expense",
  },
] as const;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function redirectWithError(message: string): never {
  redirect(`/onboarding/business?error=${encodeURIComponent(message)}`);
}

export async function createBusinessProfile(formData: FormData) {
  const name = getString(formData, "name");
  const businessType = getString(formData, "business_type");
  const currency = getString(formData, "currency") || "IDR";
  const location = getString(formData, "location");

  if (!name) {
    redirectWithError("Nama usaha wajib diisi.");
  }

  if (!businessType) {
    redirectWithError("Jenis usaha wajib dipilih.");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  const { data: existingBusiness } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existingBusiness) {
    redirect("/dashboard");
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .insert({
      owner_id: user.id,
      name,
      business_type: businessType,
      currency,
      location: location || null,
    })
    .select("id")
    .single();

  if (businessError || !business) {
    redirectWithError("Profil usaha gagal dibuat. Coba lagi.");
  }

  const { error: categoryError } = await supabase.from("categories").insert(
    defaultCategories.map((category) => ({
      business_id: business.id,
      name: category.name,
      type: category.type,
    }))
  );

  if (categoryError) {
    redirectWithError("Profil usaha dibuat, tetapi kategori default gagal dibuat.");
  }

  redirect("/dashboard");
}