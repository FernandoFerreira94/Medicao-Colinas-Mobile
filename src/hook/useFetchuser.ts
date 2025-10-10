import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../service/fetchUser";

import { queryKeys } from "./variavel/queryKeys";

export function useFetchUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => fetchUser(userId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
