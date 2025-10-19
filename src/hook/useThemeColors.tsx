import { useMemo } from "react"; // Opcional, mas bom para performance
import { BASE_COLORS } from "../constants/color"; // Importa as cores base
import { useAppContext } from "../context/useAppContext";

// Este Hook retorna o objeto de cores que você pode usar em seus componentes.
export function useThemeColors() {
  // Assumindo que 'theme' é um booleano: true (Roxo) / false (Roxo Escuro)
  const { theme } = useAppContext();

  // Memoiza o objeto para que ele só seja recriado se o tema mudar
  const themeColors = useMemo(() => {
    // 🎯 Lógica de verificação do tema:
    // Se theme for true, usa ROXO_BASE. Se for false (tema escuro), usa ROXO_ESCURO.
    const roxoCorPrimaria = theme
      ? BASE_COLORS.ROXO_BASE
      : BASE_COLORS.ROXO_ESCURO;

    return {
      // Cor Dinâmica (Principal)
      roxo: roxoCorPrimaria,
      roxoPlaceholder: BASE_COLORS.ROXO_BASEPLACEHOLDER,

      // Cores Estáticas (Ou ajuste se necessário)
      roxoDark: BASE_COLORS.ROXO_ESCURO,
      roxoLight: BASE_COLORS.ROXO_CLARO,
      gray50: BASE_COLORS.gray50,
      grayPlaceholder50: BASE_COLORS.grayPlaceholder50,
      gray900: BASE_COLORS.gray900,
      grayPlaceholder900: BASE_COLORS.grayPlaceholder900,
      white: BASE_COLORS.white,
      red: BASE_COLORS.red,
      green: BASE_COLORS.green,
    };
  }, [theme]); // Depende apenas do estado do tema

  return themeColors;
}
