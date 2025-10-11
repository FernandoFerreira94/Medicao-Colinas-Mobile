
import { useQuery } from "@tanstack/react-query";
import { fetchLojaSingle } from "../service/fetchLoja";
import { queryKeys } from "./variavel/queryKeys";

export function useFetchLojaSingle(loja_id: string | undefined, medidor_id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.lojaSingle(loja_id as string ,medidor_id as string),
    queryFn: () => fetchLojaSingle(loja_id, medidor_id),
    retry: false,
    refetchOnWindowFocus: false,
  });
}