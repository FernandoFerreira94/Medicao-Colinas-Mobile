import { supabase } from "../lib/supabase";
export async function recoverRegistration(nome_completo: string) {
  if (!nome_completo) {
    return { data: null, error: "Por favor, preencha todos os campos." };
  }

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("matricula")
      .eq("nome_completo", nome_completo)
      .single();

    if (error) {
      return {
        data: null,
        error:
          "Nome de usuário não encontrado. Verifique se existe espaço no final do nome",
      };
    }

    return { data, error: null };
  } catch (erro) {
    return {
      data: null,
      error: "Erro ao buscar usuário. Contate o suporte." + erro,
    };
  }
}
