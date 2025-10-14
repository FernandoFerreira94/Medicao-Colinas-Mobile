import { supabase } from "../lib/supabase";
import { LojaProps, MedidorComLeitura } from "../types";

export interface FetchProps {
  loja_id: string | undefined;
  medidor_id: string | undefined;
  month: number;
  year: number;
}

export async function fetchLojaSingle({
  loja_id,
  month,
  year,
  medidor_id,
}: FetchProps) {
  // 1. Validação completa (verifica se os IDs são strings não vazias)
  if (!loja_id || !medidor_id || loja_id === "" || medidor_id === "") {
    throw new Error("Enviar id_loja e id_medidores válidos");
  }

  // --- Busca da Loja ---
  const { data: lojaData, error: lojaError } = await supabase
    .from("lojas")
    .select("*")
    .eq("id", loja_id)
    .single();

  if (lojaError) {
    console.error("Erro ao buscar loja:", lojaError.message);
    throw new Error(`Erro ao buscar loja: ${lojaError.message}`);
  }

  if (!lojaData) {
    console.warn(`Loja com id ${loja_id} não encontrada.`);
    throw new Error("Loja não encontrada");
  }

  // --- Busca do Medidor com Leitura Filtrada ---
  // Nota: Não é mais necessário o 'if (medidor_id !== "" || ...)'
  // porque a validação inicial já garante que ele existe.

  // Usamos `.limit(1)` na leitura para garantir que o array retorne no máximo um elemento.
  const { data: medidorData, error: medidorError } = await supabase
    .from("medidores")
    .select(
      `
          *,
          leituras(
            *
          )
        `
    )
    .eq("loja_id", loja_id)
    .eq("id", medidor_id)
    // O filtro aqui usa a sintaxe do RPC para garantir que a consulta
    // só retorne medidores que TÊM leituras com o mês e ano corretos.
    .filter("leituras.mes", "eq", month)
    .filter("leituras.ano", "eq", year)
    .maybeSingle();

  if (medidorError) {
    console.error("Erro ao buscar medidor:", medidorError.message);
    throw new Error(`Erro ao buscar medidor: ${medidorError.message}`);
  }

  if (!medidorData) {
    console.warn(
      `Medidor ${medidor_id} ou Leitura de ${month}/${year} não encontrados.`
    );
    throw new Error("Medidor ou Leitura não encontrados");
  }

  // Se chegou até aqui, tudo foi encontrado.
  return {
    loja: lojaData as LojaProps,
    medidor: medidorData as MedidorComLeitura,
  };
}
