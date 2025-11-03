export function formatarLeitura(valor: number | string, dig: number) {
  if (valor === null || valor === undefined || isNaN(valor as number)) return;

  let valorStr = String(valor);

  // Se não há casas decimais, apenas retorna o número puro
  if (dig === 0) {
    return valorStr;
  }

  // Garante que tem pelo menos 'dig' dígitos para a parte decimal
  if (valorStr.length <= dig) {
    valorStr = valorStr.padStart(dig + 1, "0");
  }

  const parteInteira = valorStr.slice(0, -dig) || "0";
  const parteDecimal = valorStr.slice(-dig);

  return `${parteInteira},${parteDecimal}`;
}
