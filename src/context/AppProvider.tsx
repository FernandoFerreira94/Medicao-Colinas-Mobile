import { User } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { UsuarioProps } from "../types";
import { AppContext } from "./AppContext";

interface AppProviderProps {
  children: ReactNode;
}

const now = new Date();
const initialYear = now.getFullYear();
const initialMonth = now.getMonth() + 1;

export function AppProvider({ children }: AppProviderProps) {
  const queryClient = new QueryClient();

  const [session, setSession] = useState<User | null>(null);
  const [user, setUser] = useState<UsuarioProps | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [localidade, setLocalidade] = useState<string>("all");
  const [typeMedicao, setTypeMedicao] = useState("Energia");
  const [theme, setTheme] = useState(true);

  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  return (
    <AppContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        localidade,
        setLocalidade,
        typeMedicao,
        setTypeMedicao,
        setMonth,
        setYear,
        month,
        year,
        user,
        session,
        setSession,
        setUser,
        theme,
        setTheme,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
}
