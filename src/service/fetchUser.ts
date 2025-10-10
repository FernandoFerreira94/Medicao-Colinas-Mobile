import { supabase } from "../lib/supabase";
import type { UsuarioProps } from "../types";

export async function fetchUser(userId: string) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  } else {
    return data as UsuarioProps;
  }
}
