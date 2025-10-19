// hooks/useCreateLeitura.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import type { LeituraComUriProps } from "../service/createLeitura";
import { CreateLeitura } from "../service/createLeitura";
import { LeituraProps } from "../types";

export function useCreateLeitura(
  options?: UseMutationOptions<LeituraComUriProps, Error, LeituraProps>
) {
  return useMutation<any, Error, LeituraComUriProps>({
    mutationFn: async (variables) => {
      const result = await CreateLeitura(variables);
      return result;
    },

    ...options,
  });
}
