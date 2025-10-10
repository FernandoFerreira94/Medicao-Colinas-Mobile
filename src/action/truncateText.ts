export const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength).toUpperCase() + "...";
  }
  return text.toUpperCase(); // ✅ Ajuste aqui: Converte o texto para maiúsculas mesmo se não for truncado.
};
