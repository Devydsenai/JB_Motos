import { checklistRescisao, camposRescisaoCsv } from "@/data/rhDocumentosCampos";
import { statusRhLabels } from "@/data/mockFuncionarios";
import { perfilFuncionarioLabels } from "@/config/permissoes";
import type { Funcionario } from "@/types/funcionario";

export type EmpresaRhInfo = {
  nomeEmpresa: string;
  endereco: string;
};

function escapeHtml(value: string | number | boolean | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDateBr(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function calcTempoTrabalho(dataAdmissao: string): string {
  if (!dataAdmissao) return "—";
  const adm = new Date(dataAdmissao + "T12:00:00");
  const hoje = new Date();
  let anos = hoje.getFullYear() - adm.getFullYear();
  let meses = hoje.getMonth() - adm.getMonth();
  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }
  if (anos > 0 && meses > 0) return `${anos} ano(s) e ${meses} mês(es)`;
  if (anos > 0) return `${anos} ano(s)`;
  if (meses > 0) return `${meses} mês(es)`;
  return "Menos de 1 mês";
}

function nomeCompleto(f: Funcionario) {
  return `${f.nome} ${f.sobrenome}`.trim();
}

export function buildRescisaoValores(
  f: Funcionario,
  empresa: EmpresaRhInfo,
): Record<string, string> {
  return {
    empresa: empresa.nomeEmpresa,
    nome_completo: nomeCompleto(f),
    cpf: f.cpf || "—",
    email: f.email,
    perfil: perfilFuncionarioLabels[f.perfil],
    data_admissao: formatDateBr(f.dataAdmissao),
    data_demissao: formatDateBr(f.dataDemissao),
    motivo_demissao: f.motivoDemissao || "—",
    salario_bruto: f.salarioBruto || "—",
    tempo_trabalho: calcTempoTrabalho(f.dataAdmissao),
    ferias_inicio: formatDateBr(f.feriasInicio),
    ferias_fim: formatDateBr(f.feriasFim),
    cnh: f.cnh || "—",
    cnh_validade: formatDateBr(f.cnhValidade),
    gestante: f.gestante ? "Sim" : "Não",
    acidente: f.acidente ? `Sim — ${formatDateBr(f.acidenteData)}` : "Não",
    aviso_previo: f.avisoPrevio ? "Sim" : "Não",
    aviso_previo_inicio: formatDateBr(f.avisoPrevioInicio),
    aviso_previo_fim: formatDateBr(f.avisoPrevioFim),
    status_rh: statusRhLabels[f.statusRh],
  };
}

function openRhPdf(title: string, html: string) {
  const printWindow = window.open("", "_blank", "width=1024,height=900");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.document.title = title;
  printWindow.focus();
  printWindow.print();
}

function documentStyles() {
  return `
    body { font-family: Arial, sans-serif; color: #1a1a1a; margin: 28px; line-height: 1.5; }
    .header { display: flex; gap: 20px; align-items: center; border-bottom: 3px solid #c41e1e; padding-bottom: 16px; margin-bottom: 24px; }
    .header img { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 3px solid #c41e1e; }
    .avatar-fallback { width: 88px; height: 88px; border-radius: 50%; background: #c41e1e; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; flex-shrink: 0; }
    h1 { color: #c41e1e; font-size: 22px; margin: 0 0 4px; }
    .meta { color: #6b7280; font-size: 12px; margin: 0 0 4px; }
    h2 { font-size: 14px; color: #c41e1e; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 0.04em; }
    table.dados { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
    table.dados th { text-align: left; width: 38%; background: #fef2f2; color: #9a1818; padding: 8px 10px; border: 1px solid #fecaca; }
    table.dados td { padding: 8px 10px; border: 1px solid #e5e7eb; }
    .clausulas { font-size: 12px; margin: 12px 0; }
    .clausulas p { margin: 0 0 10px; text-align: justify; }
    .assinaturas { margin-top: 48px; display: flex; gap: 40px; justify-content: space-between; }
    .assinaturas div { flex: 1; text-align: center; border-top: 1px solid #1a1a1a; padding-top: 8px; font-size: 11px; }
    ul.checklist { font-size: 12px; padding-left: 20px; }
    ul.checklist li { margin-bottom: 6px; }
    @media print { body { margin: 12mm; } }
  `;
}

function buildHeaderHtml(
  f: Funcionario,
  titulo: string,
  empresa: EmpresaRhInfo,
) {
  const iniciais =
    (f.nome.charAt(0) + f.sobrenome.charAt(0)).toUpperCase() || "?";
  const avatarHtml = f.fotoUrl
    ? `<img src="${escapeHtml(f.fotoUrl)}" alt="Foto do crachá" />`
    : `<motion-div class="avatar-fallback">${escapeHtml(iniciais)}</motion-div>`.replace(
        /motion-div/g,
        "div",
      );

  return `
    <div class="header">
      ${avatarHtml}
      <div>
        <h1>${escapeHtml(titulo)}</h1>
        <p class="meta">${escapeHtml(empresa.nomeEmpresa)}${empresa.endereco ? ` — ${escapeHtml(empresa.endereco)}` : ""}</p>
        <p class="meta"><strong>${escapeHtml(nomeCompleto(f))}</strong> · ${escapeHtml(perfilFuncionarioLabels[f.perfil])}</p>
        <p class="meta">Gerado em ${escapeHtml(
          new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "long",
            timeStyle: "short",
          }).format(new Date()),
        )}</p>
      </div>
    </div>
  `;
}

function dadosTable(rows: [string, string][]) {
  return `<table class="dados">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
      )
      .join("")}
  </table>`;
}

function wrapDocument(title: string, body: string) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>${documentStyles()}</style>
</head>
<body>${body}</body>
</html>`;
}

export function exportContratacaoPdf(
  f: Funcionario,
  empresa: EmpresaRhInfo,
) {
  const rows: [string, string][] = [
    ["Nome completo", nomeCompleto(f)],
    ["CPF", f.cpf || "___________________"],
    ["E-mail", f.email],
    ["Função", perfilFuncionarioLabels[f.perfil]],
    ["Data de admissão", formatDateBr(f.dataAdmissao)],
    ["Salário bruto", f.salarioBruto || "—"],
    ["CNH", f.cnh || "—"],
    ["Validade CNH", formatDateBr(f.cnhValidade)],
  ];

  const body = `
    ${buildHeaderHtml(f, "Contrato de trabalho — Contratação", empresa)}
    <h2>Dados do colaborador</h2>
    ${dadosTable(rows)}
    <h2>Cláusulas gerais</h2>
    <div class="clausulas">
      <p>Pelo presente instrumento, <strong>${escapeHtml(empresa.nomeEmpresa)}</strong> contrata <strong>${escapeHtml(nomeCompleto(f))}</strong> para exercer a função de <strong>${escapeHtml(perfilFuncionarioLabels[f.perfil])}</strong>, com início em <strong>${escapeHtml(formatDateBr(f.dataAdmissao))}</strong> e remuneração bruta de <strong>${escapeHtml(f.salarioBruto || "a combinar")}</strong>, observadas as normas da CLT e políticas internas da empresa.</p>
      <p>O(A) colaborador(a) compromete-se a utilizar o sistema conforme o perfil de acesso atribuído, mantendo sigilo sobre informações comerciais e financeiras da empresa.</p>
      <p>Este documento foi gerado automaticamente pelo módulo CRH da JB Motos para impressão e assinatura das partes.</p>
    </div>
    <div class="assinaturas">
      <div>Assinatura do empregador</div>
      <div>Assinatura do colaborador</div>
    </div>
  `;

  openRhPdf(
    `Contrato — ${nomeCompleto(f)}`,
    wrapDocument("Contrato de trabalho", body),
  );
}

export function exportRescisaoPdf(f: Funcionario, empresa: EmpresaRhInfo) {
  const valores = buildRescisaoValores(f, empresa);
  const rows = camposRescisaoCsv.map(({ chave, rotulo }) => [
    rotulo,
    valores[chave] ?? "—",
  ]) as [string, string][];

  const checklistHtml = checklistRescisao
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const body = `
    ${buildHeaderHtml(f, "Documentação de rescisão", empresa)}
    <h2>Dados para rescisão (preenchidos automaticamente)</h2>
    ${dadosTable(rows)}
    <h2>Checklist de documentos de rescisão</h2>
    <ul class="checklist">${checklistHtml}</ul>
    <div class="clausulas">
      <p>Declaro que recebi orientação sobre os documentos listados acima, referentes ao encerramento do vínculo empregatício com <strong>${escapeHtml(empresa.nomeEmpresa)}</strong>, em <strong>${escapeHtml(formatDateBr(f.dataDemissao))}</strong>.</p>
      <p><strong>Motivo:</strong> ${escapeHtml(f.motivoDemissao || "—")}</p>
    </div>
    <div class="assinaturas">
      <div>Assinatura do empregador</div>
      <div>Assinatura do colaborador</div>
    </div>
  `.replace(/motion-div/g, "div");

  openRhPdf(
    `Rescisão — ${nomeCompleto(f)}`,
    wrapDocument("Rescisão de contrato", body),
  );
}

export function exportRescisaoCsv(f: Funcionario, empresa: EmpresaRhInfo) {
  const valores = buildRescisaoValores(f, empresa);
  const linhas = [
    "campo;valor",
    ...camposRescisaoCsv.map(
      ({ chave, rotulo }) =>
        `${rotulo};${(valores[chave] ?? "").replace(/;/g, ",")}`,
    ),
    "",
    "checklist_documento;pendente",
    ...checklistRescisao.map((doc) => `${doc};pendente`),
  ];

  const blob = new Blob(["\ufeff", linhas.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const slug = nomeCompleto(f)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  link.href = url;
  link.download = `rescisao-${slug || f.id}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
