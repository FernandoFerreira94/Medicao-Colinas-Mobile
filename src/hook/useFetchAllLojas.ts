import { useQuery } from "@tanstack/react-query";
import { fetchAllLojas } from "../service/fetchAllLojas";
import { queryKeys } from "./variavel/queryKeys";

export function useFetchAllLojas(
  tipoMedicao: string | null = null,
  mes: number | null = null,
  ano: number | null = null,
  localidade: string | null = null,
  searchQuery: string | null = null
) {
  return useQuery({
    queryKey: queryKeys.lojas(tipoMedicao, mes, ano, localidade, searchQuery),
    queryFn: () =>
      fetchAllLojas(tipoMedicao, mes, ano, localidade, searchQuery),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
