export const getLeituraAnterior = (
  leituraAnterior: number,
  leituraAtual: number
) => {
  const leituraAnteriorDoMes = leituraAnterior;
  if (
    leituraAnteriorDoMes !== undefined &&
    leituraAnteriorDoMes !== null &&
    leituraAnteriorDoMes !== 0
  ) {
    return Number(leituraAnteriorDoMes);
  }
  // 2. Tenta usar a última leitura registrada do medidor (fallback)
  const ultimaLeituraMedidor = leituraAtual;
  if (ultimaLeituraMedidor !== undefined && ultimaLeituraMedidor !== null) {
    return Number(ultimaLeituraMedidor);
  }
  return 0;
};
