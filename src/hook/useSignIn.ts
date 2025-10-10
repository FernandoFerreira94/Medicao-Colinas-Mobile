import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { signInService } from "../service/signIn";

import { LoginProps, UsuarioProps } from "../types";

interface SignInMutationReturn {
  auth: any;
  usuario: UsuarioProps[] | null;
}

export function useSignIn(
  options?: UseMutationOptions<any, Error, LoginProps>
) {
  return useMutation<SignInMutationReturn | null, Error, LoginProps>({
    mutationFn: async (variables) => {
      return await signInService(variables);
    },
    ...options,
  });
}
