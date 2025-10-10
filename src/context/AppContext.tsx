import { createContext } from "react";
import { UsuarioProps } from "../types";
interface AppContextType {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  localidade: string;
  setLocalidade: (value: string) => void;
  typeMedicao: string;
  setTypeMedicao: (value: string) => void;
  month: number;
  setMonth: (value: number) => void;
  year: number;
  setYear: (value: number) => void;
  user: UsuarioProps | null;
  setUser: (user: UsuarioProps | null) => void;
  session: any;
  setSession: (session: any) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
