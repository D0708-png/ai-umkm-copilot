import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserBusiness() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      business: null,
      error: userError,
    };
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    user,
    business,
    error: businessError,
  };
}