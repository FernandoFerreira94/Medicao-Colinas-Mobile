import { supabase } from "../lib/supabase";
import type { LojaProps } from "../types";

export async function fetchAllLojas(
  tipoMedicao?: string | null,
  mes?: number | null,
  ano?: number | null,
  localidade?: string | null,
  searchQuery: string | null = null
): Promise<LojaProps[] | null> {
  const baseQuery = () => {
    let query = supabase.from("lojas").select(`
      *,
      medidores (
        *,
        leituras (
          *
        )
      )
    `);

    if (tipoMedicao) {
      query = query.filter("medidores.tipo_medicao", "eq", tipoMedicao);
    }

    if (localidade && localidade !== "all") {
      query = query.filter("medidores.localidade", "eq", localidade);
    }

    if (mes && ano) {
      query = query.filter("medidores.leituras.mes", "eq", mes);
    }

    return query;
  };

  let data: LojaProps[] | null = null;
  let error: any = null;

  if (searchQuery) {
    const formattedQuery = `%${searchQuery.toLowerCase()}%`;
    const searchQueryNumber = Number(searchQuery);

    const orClauses = [];

    // Busca por nome e prefixo
    orClauses.push(
      `nome_loja.ilike.${formattedQuery},prefixo_loja.ilike.${formattedQuery}`
    );

    // Busca por numero_loja (se for um número válido)
    if (!isNaN(searchQueryNumber)) {
      orClauses.push(`numero_loja.eq.${searchQueryNumber}`);
    }

    // Consulta 1: Busca em campos da loja (nome, prefixo, número)
    const { data: dataLojas, error: errorLojas } = await baseQuery().or(
      orClauses.join(",")
    );

    // Consulta 2: Busca por número de relógio
    const { data: dataMedidores, error: errorMedidores } =
      await baseQuery().filter(
        "medidores.numero_relogio",
        "ilike",
        formattedQuery
      );

    if (errorLojas || errorMedidores) {
      console.error(
        "Erro na busca de lojas:",
        errorLojas?.message || errorMedidores?.message
      );
      throw new Error(errorLojas?.message || errorMedidores?.message);
    }

    // Combina os resultados e remove duplicatas
    const allResults = [...(dataLojas || []), ...(dataMedidores || [])];
    const uniqueLojas = Array.from(new Set(allResults.map((l) => l.id))).map(
      (id) => allResults.find((l) => l.id === id)
    ) as LojaProps[];

    data = uniqueLojas;
  } else {
    // Se não houver busca, executa a query normal
    const { data: normalData, error: normalError } = await baseQuery();
    data = normalData as LojaProps[];
    error = normalError;
  }

  if (error) {
    console.error("Erro ao buscar lojas, medidores e leituras:", error.message);
    throw new Error(error.message);
  }

  return data;
}
