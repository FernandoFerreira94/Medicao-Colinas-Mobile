// packages/utils/src/queryKeys.ts

export const queryKeys = {
  lojaSingle: (loja_id: string, medidor_id: string) => ["lojaSingle", loja_id,medidor_id],
  user: (id: string) => ["user", id],
  lojas: (
    tipoMedicao: string | null = null,
    mes: number | null = null,
    ano: number | null = null,
    localidade: string | null = null,
    searchQuery: string | null = null
  ) => ["medicoes", tipoMedicao, mes, ano, localidade, searchQuery],
};
