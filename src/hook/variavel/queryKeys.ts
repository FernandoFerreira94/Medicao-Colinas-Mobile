// packages/utils/src/queryKeys.ts

export const queryKeys = {
  user: (id: string) => ["user", id],
  lojas: (
    tipoMedicao: string | null = null,
    mes: number | null = null,
    ano: number | null = null,
    localidade: string | null = null,
    searchQuery: string | null = null
  ) => ["medicoes", tipoMedicao, mes, ano, localidade, searchQuery],
};
