export function formatarNomeFuncionario(nome: string, sobrenome: string) {
  return `${nome} ${sobrenome}`.trim();
}

export function formatarRegistroFuncionario(
  codigo?: string,
  nome?: string,
): string {
  if (codigo && nome) return `ID ${codigo} — ${nome}`;
  if (codigo) return `ID ${codigo}`;
  if (nome) return nome;
  return "—";
}
