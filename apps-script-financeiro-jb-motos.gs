/**
 * API Google Sheets - JB Motos Financeiro
 *
 * Como usar:
 * 1. Cole este codigo no Google Apps Script vinculado a sua planilha.
 * 2. Rode a funcao configurarTokenUmaVez() e autorize.
 * 3. Clique em Implantar > Nova implantacao > App da Web.
 * 4. Execute como: Voce
 * 5. Quem tem acesso: conforme sua necessidade.
 * 6. Use a URL gerada pelo Apps Script para chamadas GET/POST.
 */

const API_TOKEN_PADRAO = "JB_MOTOS_TROQUE_ESSE_TOKEN";

function configurarTokenUmaVez() {
  PropertiesService.getScriptProperties().setProperty("API_TOKEN", API_TOKEN_PADRAO);
}

function doGet(e) {
  try {
    validarToken(e.parameter.token);

    const action = e.parameter.action || "listarAbas";
    const aba = e.parameter.aba;
    const range = e.parameter.range || "A1:Z1000";

    if (action === "listarAbas") {
      return json({
        ok: true,
        abas: SpreadsheetApp.getActive().getSheets().map((sheet) => sheet.getName()),
      });
    }

    if (action === "ler") {
      const sheet = buscarAba(aba);
      return json({
        ok: true,
        aba,
        range,
        valores: sheet.getRange(range).getValues(),
      });
    }

    return json({ ok: false, erro: "Acao GET invalida." });
  } catch (error) {
    return json({ ok: false, erro: String(error.message || error) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    validarToken(body.token);

    switch (body.action) {
      case "criarModeloFinanceiro":
        criarModeloFinanceiro();
        return json({ ok: true, mensagem: "Modelo financeiro criado/atualizado." });

      case "adicionarLinha":
        adicionarLinha(body.aba, body.valores);
        return json({ ok: true, mensagem: "Linha adicionada." });

      case "atualizarCelula":
        atualizarCelula(body.aba, body.celula, body.valor);
        return json({ ok: true, mensagem: "Celula atualizada." });

      case "atualizarRange":
        atualizarRange(body.aba, body.range, body.valores);
        return json({ ok: true, mensagem: "Range atualizado." });

      case "limparRange":
        buscarAba(body.aba).getRange(body.range).clearContent();
        return json({ ok: true, mensagem: "Range limpo." });

      case "estilizarRange":
        estilizarRange(body.aba, body.range, body.estilo || {});
        return json({ ok: true, mensagem: "Estilo aplicado." });

      default:
        return json({ ok: false, erro: "Acao POST invalida." });
    }
  } catch (error) {
    return json({ ok: false, erro: String(error.message || error) });
  }
}

function criarModeloFinanceiro() {
  const ss = SpreadsheetApp.getActive();
  const resumo = obterOuCriarAba(ss, "Resumo");
  const apuracao = obterOuCriarAba(ss, "Apuracao diaria");
  const lancamentos = obterOuCriarAba(ss, "Lancamentos");

  resumo.clear();
  apuracao.clear();
  lancamentos.clear();

  resumo.getRange("A1:B1").merge().setValue("Resumo financeiro - JB Motos");
  resumo.getRange("A3:B3").setValues([["Indicador", "Valor"]]);
  resumo.getRange("A4:B14").setValues([
    ["Dias apurados", 7],
    ["Media faturamento / dia", 4928.57],
    ["Media gasto real / dia", 2078.57],
    ["Media lucro apurado / dia", 2850],
    ["Total faturamento", 34500],
    ["Total gasto real", 14550],
    ["Total lucro apurado", 19950],
    ["Pagamentos de clientes", 1900],
    ["Media por pagamento cliente", 633.33],
    ["Total saidas", 4000],
    ["Media geral por lancamento", 1333.33],
  ]);

  apuracao.getRange("A1:D1").merge().setValue("Apuracao diaria da loja");
  apuracao.getRange("A3:D3").setValues([["Data", "Faturamento", "Gasto real", "Lucro apurado"]]);
  apuracao.getRange("A4:C10").setValues([
    [new Date("2026-05-12"), 4200, 1850],
    [new Date("2026-05-13"), 5100, 2100],
    [new Date("2026-05-14"), 3800, 1920],
    [new Date("2026-05-15"), 6200, 2450],
    [new Date("2026-05-16"), 4900, 2200],
    [new Date("2026-05-17"), 5500, 1980],
    [new Date("2026-05-18"), 4800, 2050],
  ]);
  apuracao.getRange("D4:D10").setFormulaR1C1("=RC[-2]-RC[-1]");

  lancamentos.getRange("A1:E1").merge().setValue("Pagamentos e lancamentos");
  lancamentos.getRange("A3:E3").setValues([["ID", "Data", "Descricao", "Tipo", "Valor"]]);
  lancamentos.getRange("A4:E9").setValues([
    ["1", new Date("2026-05-18"), "Pagamento pecas - Cliente Joao (OS #1042)", "Pagamento cliente", 850],
    ["2", new Date("2026-05-18"), "Fornecedor Motopecas - NF 8821", "Saida", 1200],
    ["3", new Date("2026-05-17"), "Pagamento servico - Cliente Maria", "Pagamento cliente", 420],
    ["4", new Date("2026-05-17"), "Entrada caixa - vendas balcão", "Entrada", 2100],
    ["5", new Date("2026-05-16"), "Pagamento pecas - Cliente Pedro", "Pagamento cliente", 630],
    ["6", new Date("2026-05-16"), "Aluguel galpao (parcela)", "Saida", 2800],
  ]);

  aplicarEstiloPadrao(resumo);
  aplicarEstiloPadrao(apuracao);
  aplicarEstiloPadrao(lancamentos);
}

function adicionarLinha(aba, valores) {
  if (!Array.isArray(valores)) throw new Error("valores precisa ser um array.");
  buscarAba(aba).appendRow(valores);
}

function atualizarCelula(aba, celula, valor) {
  buscarAba(aba).getRange(celula).setValue(valor);
}

function atualizarRange(aba, range, valores) {
  if (!Array.isArray(valores)) throw new Error("valores precisa ser matriz.");
  buscarAba(aba).getRange(range).setValues(valores);
}

function estilizarRange(aba, range, estilo) {
  const target = buscarAba(aba).getRange(range);

  if (estilo.background) target.setBackground(estilo.background);
  if (estilo.fontColor) target.setFontColor(estilo.fontColor);
  if (estilo.fontWeight) target.setFontWeight(estilo.fontWeight);
  if (estilo.fontSize) target.setFontSize(Number(estilo.fontSize));
  if (estilo.horizontalAlignment) target.setHorizontalAlignment(estilo.horizontalAlignment);
  if (estilo.verticalAlignment) target.setVerticalAlignment(estilo.verticalAlignment);
  if (estilo.numberFormat) target.setNumberFormat(estilo.numberFormat);
  if (estilo.wrap !== undefined) target.setWrap(Boolean(estilo.wrap));
}

function aplicarEstiloPadrao(sheet) {
  const lastColumn = sheet.getLastColumn();
  const lastRow = sheet.getLastRow();

  sheet.getRange(1, 1, 1, Math.max(lastColumn, 1))
    .setFontWeight("bold")
    .setFontSize(14)
    .setFontColor("#C41E1E");

  if (lastRow >= 3) {
    sheet.getRange(3, 1, 1, lastColumn)
      .setBackground("#C41E1E")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold");
  }

  sheet.autoResizeColumns(1, Math.max(lastColumn, 1));
  sheet.setFrozenRows(3);
}

function obterOuCriarAba(ss, nome) {
  return ss.getSheetByName(nome) || ss.insertSheet(nome);
}

function buscarAba(nome) {
  if (!nome) throw new Error("Informe o nome da aba.");
  const sheet = SpreadsheetApp.getActive().getSheetByName(nome);
  if (!sheet) throw new Error(`Aba nao encontrada: ${nome}`);
  return sheet;
}

function validarToken(token) {
  const tokenSalvo =
    PropertiesService.getScriptProperties().getProperty("API_TOKEN") || API_TOKEN_PADRAO;

  if (!token || token !== tokenSalvo) {
    throw new Error("Token invalido ou ausente.");
  }
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
