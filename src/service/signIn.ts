import { supabase } from "../lib/supabase";
import type { LoginProps, UsuarioProps } from "../types";

export async function signInService({ matricula, password }: LoginProps) {
  try {
    const emailColinas = `${matricula}@colinas.com.br`;

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: emailColinas,
        password,
      });

    if (authError) {
      throw new Error(`Erro ao fazer login: ${authError.message}`);
    }

    const userId = authData.user?.id;
    const session = authData.session;

    if (!userId) {
      throw new Error("ID do usuário não encontrado após o login.");
    }

    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (userError) {
      console.error("Erro ao buscar dados do usuário:", userError.message);
      throw new Error(userError.message);
    }

    return { error: null, user: userData as UsuarioProps, session };
  } catch (error) {
    throw error;
  }
}
