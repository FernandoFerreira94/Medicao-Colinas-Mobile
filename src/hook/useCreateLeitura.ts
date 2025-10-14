// hooks/useCreateLeitura.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { CreateLeitura } from "../service/createLeitura";
import { LeituraProps } from "../types";

export function useCreateLeitura(
  options?: UseMutationOptions<any, Error, LeituraProps>
) {
  return useMutation<any, Error, LeituraProps>({
    mutationFn: async (variables) => {
      const result = await CreateLeitura(variables);
      return result;
    },

    ...options,
  });
}
