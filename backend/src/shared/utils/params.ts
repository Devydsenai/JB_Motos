/** Normaliza parâmetro de rota do Express 5 (string | string[]) */
export const param = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};
