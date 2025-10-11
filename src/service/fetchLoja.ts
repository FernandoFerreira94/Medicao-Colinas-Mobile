import { supabase } from "../lib/supabase";
import { LojaProps, MedidorComLeitura } from "../types";

export async function fetchLojaSingle(loja_id: string | undefined, medidor_id: string |  undefined) {

  if (!loja_id || !medidor_id) {

    throw new Error("Enviar id_loja e id_medidores")
        
    }
  const { data: lojaData, error: lojaError } = await supabase
    .from("lojas")
    .select("*")
    .eq("id", loja_id)
    .single();

  if (lojaError) {
    console.error("Erro ao buscar loja:", lojaError.message);
    throw new Error(lojaError.message)
   
  }

  if (!lojaData) {
    console.warn("Loja nao encontrada.");
    throw new Error("Loja não encontrada");
  }

  if (medidor_id !== "" || medidor_id !== undefined || medidor_id !== null) {
    const { data: medidorData, error: medidorError } = await supabase
      .from("medidores")
      .select("*,leituras(*)")
      .eq("loja_id", loja_id)
      .eq("id", medidor_id)
      .single();

    if (medidorError) {
      console.error("Erro ao buscar medidor:", medidorError.message);
     throw new Error(medidorError.message)
    }

    if (!medidorData) {
      console.warn("Medidor nao encontrado.");
      throw new Error("Medidor não encontrado")
    }

    return {
      loja: lojaData as LojaProps,
      medidor: medidorData as MedidorComLeitura,
    };

  }
}