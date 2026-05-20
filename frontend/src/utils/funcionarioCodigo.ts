/** Código numérico de 4 a 6 dígitos para identificar o funcionário no serviço */
export function normalizarCodigoServico(input: string): string {
  return String(input).replace(/\D/g, "").trim();
}

export function isCodigoServicoValido(codigo: string): boolean {
  const n = normalizarCodigoServico(codigo);
  return n.length >= 4 && n.length <= 6;
}

export function formatarCodigoServico(codigo: string): string {
  return normalizarCodigoServico(codigo);
}
