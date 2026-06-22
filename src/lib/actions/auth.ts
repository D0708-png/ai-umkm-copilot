"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

export async function login(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    redirectWithError("/login", "Email dan password wajib diisi.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithError("/login", "Email atau password salah.");
  }

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!name || !email || !password) {
    redirectWithError("/register", "Nama, email, dan password wajib diisi.");
  }

  if (password.length < 6) {
    redirectWithError("/register", "Password minimal 6 karakter.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    redirectWithError("/register", "Registrasi gagal. Coba gunakan email lain.");
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirectWithMessage(
    "/login",
    "Registrasi berhasil. Silakan cek email untuk verifikasi akun, lalu login."
  );
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}