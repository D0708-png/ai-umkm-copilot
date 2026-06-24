"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function redirectWithError(message: string): never {
  redirect(`/settings?error=${encodeURIComponent(message)}`);
}

export async function deleteAllBusinessData(formData: FormData) {
  const password = getString(formData, "password");

  if (!password) {
    redirectWithError("Password wajib diisi untuk menghapus seluruh data.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!user.email) {
    redirectWithError("Email akun tidak ditemukan. Tidak bisa verifikasi password.");
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (verifyError) {
    redirectWithError("Password salah. Penghapusan data dibatalkan.");
  }

  const { error: deleteError } = await supabase
    .from("businesses")
    .delete()
    .eq("owner_id", user.id);

  if (deleteError) {
    redirectWithError("Gagal menghapus seluruh data usaha.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/products");
  revalidatePath("/stocks");
  revalidatePath("/reports/profit");
  revalidatePath("/assistant");
  revalidatePath("/settings");
  revalidatePath("/onboarding/business");

  redirect(
    "/onboarding/business?message=Seluruh data usaha berhasil dihapus. Silakan buat profil usaha baru."
  );
}