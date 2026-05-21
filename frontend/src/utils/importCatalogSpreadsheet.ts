import * as XLSX from "xlsx";
import type { Fornecedor } from "@/types/fornecedor";
import type { Produto } from "@/types/produto";

type SpreadsheetRow = Record<string, unknown>;

type ImportCatalogOptions = {
  produtosAtuais: Produto[];
  fornecedoresAtuais: Fornecedor[];
};

export type ImportCatalogResult = {
  produtos: Produto[];
  fornecedores: Fornecedor[];
  produtosCriados: number;
  fornecedoresCriados: number;
  linhasIgnoradas: number;
};

const HEADER_KEYWORDS = [
  "tipo",
  "registro",
  "produto",
  "nomeproduto",
  "nomedoproduto",
  "peca",
  "pecas",
  "item",
  "codigo",
  "sku",
  "valor",
  "preco",
  "preço",
  "quantidade",
  "qtd",
  "estoque",
  "fornecedor",
  "nomefornecedor",
  "empresa",
  "razaosocial",
  "cnpj",
  "email",
  "telefone",
  "contato",
  "categoria",
  "descricao",
  "fabricante",
  "distribuidor",
];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

function hasAnyValue(row: SpreadsheetRow) {
  return Object.values(row).some((value) => String(value ?? "").trim().length > 0);
}

function rowFromHeader(header: unknown[], values: unknown[]) {
  const counts = new Map<string, number>();
  return header.reduce<SpreadsheetRow>((acc, key, index) => {
    const base = String(key ?? "").trim();
    if (!base) return acc;

    const normalized = normalize(base);
    const repeat = counts.get(normalized) ?? 0;
    counts.set(normalized, repeat + 1);
    const name = repeat > 0 ? `${base} (${repeat + 1})` : base;

    acc[name] = values[index] ?? "";
    return acc;
  }, {});
}

function columnMatches(headerKey: string, aliases: string[]) {
  const key = normalize(headerKey);
  if (!key) return false;

  return aliases.some((alias) => {
    const normalizedAlias = normalize(alias);
    if (!normalizedAlias) return false;
    return (
      key === normalizedAlias ||
      key.includes(normalizedAlias) ||
      normalizedAlias.includes(key)
    );
  });
}

function scoreHeader(cells: unknown[]) {
  const normalized = cells.map((cell) => normalize(String(cell ?? "")));
  return normalized.filter((cell) =>
    HEADER_KEYWORDS.some(
      (keyword) => cell.includes(keyword) || keyword.includes(cell),
    ),
  ).length;
}

function readRowsFromSheet(sheet: XLSX.WorkSheet, sheetName: string) {
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
    raw: false,
  });

  if (!matrix.length) return [];

  const scanLimit = Math.min(matrix.length, 25);
  let headerIndex = 0;
  let bestScore = 0;

  for (let index = 0; index < scanLimit; index += 1) {
    const score = scoreHeader(matrix[index] ?? []);
    if (score > bestScore) {
      bestScore = score;
      headerIndex = index;
    }
  }

  if (bestScore === 0) {
    headerIndex = matrix.findIndex(
      (row) => (row ?? []).filter((cell) => String(cell ?? "").trim()).length >= 3,
    );
    if (headerIndex < 0) headerIndex = 0;
  }

  const header = matrix[headerIndex] ?? [];
  const rows = matrix
    .slice(headerIndex + 1)
    .map((row) => rowFromHeader(header, row ?? []))
    .filter(hasAnyValue);

  if (rows.length) {
    return rows.map((row) => ({ ...row, __sheetName: sheetName }));
  }

  const jsonRows = XLSX.utils.sheet_to_json<SpreadsheetRow>(sheet, {
    defval: "",
    raw: false,
  });

  return jsonRows
    .filter(hasAnyValue)
    .map((row) => ({ ...row, __sheetName: sheetName }));
}

function readValue(row: SpreadsheetRow, aliases: string[]) {
  const entry = Object.entries(row).find(
    ([key]) => key !== "__sheetName" && columnMatches(key, aliases),
  );
  return String(entry?.[1] ?? "").trim();
}

function readNumberText(row: SpreadsheetRow, aliases: string[]) {
  const value = readValue(row, aliases);
  if (!value) return "";
  const numeric = value.replace(/[^\d,.-]/g, "");
  return numeric ? numeric.replace(".", ",") : value;
}

function hasAny(row: SpreadsheetRow, aliases: string[]) {
  return readValue(row, aliases).length > 0;
}

function sheetSuggestsProducts(sheetName: string) {
  const key = normalize(sheetName);
  return (
    key.includes("produto") ||
    key.includes("peca") ||
    key.includes("estoque") ||
    key.includes("inventario") ||
    key.includes("catalogo")
  );
}

function sheetSuggestsSuppliers(sheetName: string) {
  const key = normalize(sheetName);
  return key.includes("fornecedor") || key.includes("parceiro") || key.includes("vendor");
}

function supplierKey(fornecedor: Pick<Fornecedor, "cnpj" | "email" | "nome">) {
  return normalize(fornecedor.cnpj || fornecedor.email || fornecedor.nome);
}

function shouldCreateSupplier(row: SpreadsheetRow) {
  const sheetName = String(row.__sheetName ?? "");
  const tipo = readValue(row, ["tipo", "tipo registro", "registro", "classificacao"]);

  if (sheetSuggestsSuppliers(sheetName) && !sheetSuggestsProducts(sheetName)) {
    return true;
  }

  if (normalize(tipo).includes("fornecedor")) return true;

  return hasAny(row, [
    "fornecedor",
    "nome fornecedor",
    "nome do fornecedor",
    "empresa",
    "nome empresa",
    "razao social",
    "razão social",
    "fabricante",
    "distribuidor",
    "cnpj",
    "contato",
    "email fornecedor",
    "telefone fornecedor",
  ]);
}

function shouldCreateProduct(row: SpreadsheetRow) {
  const sheetName = String(row.__sheetName ?? "");
  const tipo = readValue(row, ["tipo", "tipo registro", "registro", "classificacao"]);

  if (sheetSuggestsProducts(sheetName) && !sheetSuggestsSuppliers(sheetName)) {
    return true;
  }

  const tipoNorm = normalize(tipo);
  if (tipoNorm.includes("produto") || tipoNorm.includes("peca")) return true;

  if (hasAny(row, [
    "produto",
    "nome produto",
    "nome do produto",
    "item",
    "peca",
    "peça",
    "descricao produto",
    "descrição produto",
    "codigo produto",
    "sku",
    "valor venda",
    "preco venda",
    "quantidade",
    "codigo barras",
    "estoque",
    "saldo",
  ])) {
    return true;
  }

  const hasName = hasAny(row, ["nome", "titulo", "title", "descricao", "descrição"]);
  const hasCommercial = hasAny(row, [
    "valor",
    "preco",
    "preço",
    "quantidade",
    "qtd",
    "estoque",
    "codigo",
    "sku",
  ]);

  return hasName && hasCommercial;
}

function firstMeaningfulText(row: SpreadsheetRow, skipAliases: string[] = []) {
  for (const [key, value] of Object.entries(row)) {
    if (key === "__sheetName") continue;
    if (columnMatches(key, skipAliases)) continue;
    const text = String(value ?? "").trim();
    if (text.length >= 2 && !/^\d+([.,]\d+)?$/.test(text)) return text;
  }
  return "";
}

function createSupplier(
  row: SpreadsheetRow,
  index: number,
  qtdProdutos: number,
): Fornecedor | null {
  const tipoRegistro = normalize(readValue(row, ["tipo", "tipo registro", "registro"]));
  const nome =
    readValue(row, [
      "fornecedor",
      "nome fornecedor",
      "nome do fornecedor",
      "empresa",
      "nome empresa",
      "razao social",
      "razão social",
      "nome",
      "name",
    ]) || readValue(row, ["fabricante", "distribuidor"]);

  const nomeFinal =
    nome ||
    (tipoRegistro.includes("fornecedor") ? readValue(row, ["nome", "titulo"]) : "") ||
    firstMeaningfulText(row, [
      "cnpj",
      "email",
      "telefone",
      "contato",
      "valor",
      "preco",
      "quantidade",
      "codigo",
      "sku",
    ]);

  if (!nomeFinal) return null;

  return {
    id: `for-import-${Date.now()}-${index}`,
    codigo:
      readValue(row, ["codigo fornecedor", "cod fornecedor", "id fornecedor", "id", "codigo"]) ||
      `FOR-${String(index + 1).padStart(3, "0")}`,
    nome: nomeFinal,
    cnpj: readValue(row, ["cnpj", "documento fornecedor", "cpf cnpj"]),
    tipo: readValue(row, ["tipo fornecedor", "tipo"]) || "Distribuidor",
    categoria: readValue(row, ["categoria fornecedor", "categoria"]),
    fornecedorDesde: readValue(row, ["fornecedor desde", "data cadastro", "data"]),
    contato:
      readValue(row, ["contato", "responsavel", "responsável", "vendedor", "nome contato"]) ||
      nomeFinal,
    email: readValue(row, ["email fornecedor", "email", "e-mail", "mail"]),
    telefone: readValue(row, ["telefone fornecedor", "telefone", "celular", "fone", "whatsapp"]),
    endereco: readValue(row, ["endereco", "endereço", "address"]),
    cidade: readValue(row, ["cidade", "city"]),
    estado: readValue(row, ["estado", "uf", "state"]),
    condicoesPagamento: readValue(row, [
      "condicao pagamento",
      "condicoes pagamento",
      "pagamento",
    ]),
    condicoesPagamento2: "",
    observacoes: readValue(row, ["observacoes fornecedor", "observacoes", "obs", "notas"]),
    status: "ativo",
    qtdProdutos,
    documentoNome: "",
  };
}

function createProduct(row: SpreadsheetRow, index: number): Produto | null {
  const tipoRegistro = normalize(readValue(row, ["tipo", "tipo registro", "registro"]));
  const produto =
    readValue(row, [
      "produto",
      "nome produto",
      "nome do produto",
      "item",
      "peca",
      "peça",
      "nome",
      "titulo",
      "title",
    ]) ||
    (tipoRegistro.includes("produto") || tipoRegistro.includes("peca")
      ? readValue(row, ["descricao", "descrição", "detalhe"])
      : "") ||
    firstMeaningfulText(row, [
      "fornecedor",
      "cnpj",
      "email",
      "telefone",
      "quantidade",
      "valor",
      "preco",
      "codigo",
      "sku",
      "categoria",
    ]);

  if (!produto) return null;

  const valorRaw = readValue(row, [
    "valor venda",
    "preco venda",
    "preço venda",
    "valor",
    "preco",
    "preço",
    "price",
    "unitario",
    "unitário",
  ]);

  return {
    id: `prd-import-${Date.now()}-${index}`,
    produto,
    codigo:
      readValue(row, ["codigo produto", "cod produto", "sku", "codigo", "id", "referencia"]) ||
      `PRD-${String(index + 1).padStart(3, "0")}`,
    descricao: readValue(row, [
      "descricao",
      "descrição",
      "detalhes",
      "observacao",
      "observação",
      "detalhe",
    ]),
    fornecedor: readValue(row, [
      "fornecedor",
      "nome fornecedor",
      "empresa",
      "nome empresa",
      "razao social",
      "marca",
      "fabricante",
    ]),
    categoria: readValue(row, ["categoria produto", "categoria", "grupo", "familia"]),
    valor: valorRaw ? (valorRaw.startsWith("R$") ? valorRaw : `R$${valorRaw}`) : "R$0,00",
    ativo: true,
    visivelLoja: false,
    precoCusto: readValue(row, ["preco custo", "preço custo", "custo", "cost"]),
    quantidade: readNumberText(row, ["quantidade", "qtd", "estoque", "saldo", "stock"]),
    quantidadeMinima: readNumberText(row, [
      "quantidade minima",
      "qtd minima",
      "estoque minimo",
      "minimo",
    ]),
    codigoBarras: readValue(row, ["codigo barras", "código barras", "ean", "barcode"]),
    localizacao: readValue(row, ["localizacao", "localização", "local estoque", "prateleira"]),
    peso: readNumberText(row, ["peso", "peso kg", "weight"]),
    dimensoes: readValue(row, ["dimensoes", "dimensões", "tamanho"]),
    validade: readValue(row, ["validade", "data validade", "vencimento"]),
  };
}

function classifyRow(row: SpreadsheetRow): "product" | "supplier" | "skip" {
  const isSupplier = shouldCreateSupplier(row);
  const isProduct = shouldCreateProduct(row);

  if (isSupplier && !isProduct) return "supplier";
  if (isProduct && !isSupplier) return "product";

  const tipo = normalize(readValue(row, ["tipo", "tipo registro", "registro"]));
  if (tipo.includes("fornecedor")) return "supplier";
  if (tipo.includes("produto") || tipo.includes("peca")) return "product";

  const supplierSignals =
    Number(hasAny(row, ["cnpj"])) +
    Number(hasAny(row, ["email", "e-mail"])) +
    Number(hasAny(row, ["telefone", "contato"]));
  const productSignals =
    Number(hasAny(row, ["valor", "preco", "preço"])) +
    Number(hasAny(row, ["quantidade", "qtd", "estoque"])) +
    Number(hasAny(row, ["codigo", "sku"]));

  if (supplierSignals > productSignals && hasAny(row, ["fornecedor", "empresa", "nome"])) {
    return "supplier";
  }
  if (productSignals >= 1 && hasAny(row, ["produto", "nome", "item", "descricao"])) {
    return "product";
  }

  if (firstMeaningfulText(row)) return "product";

  return "skip";
}

function dedupeProducts(produtos: Produto[]) {
  const seen = new Set<string>();
  return produtos.filter((produto) => {
    const key = normalize(produto.codigo || produto.produto);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function collectDetectedHeaders(rows: SpreadsheetRow[]) {
  const headers = new Set<string>();
  rows.slice(0, 5).forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== "__sheetName") headers.add(key);
    });
  });
  return Array.from(headers).slice(0, 12);
}

export async function importCatalogSpreadsheet(
  file: File,
  options: ImportCatalogOptions,
): Promise<ImportCatalogResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const rows = workbook.SheetNames.flatMap((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    return sheet ? readRowsFromSheet(sheet, sheetName) : [];
  });

  if (!rows.length) {
    throw new Error(
      "A planilha não possui linhas legíveis. Verifique se há dados abaixo do cabeçalho.",
    );
  }

  const importedProducts: Produto[] = [];
  const importedSuppliers: Fornecedor[] = [];
  let linhasIgnoradas = 0;

  rows.forEach((row, index) => {
    const kind = classifyRow(row);
    const product = kind === "product" ? createProduct(row, index) : null;
    const supplier =
      kind === "supplier" ? createSupplier(row, index, product ? 1 : 0) : null;

    if (product) importedProducts.push(product);
    if (supplier) importedSuppliers.push(supplier);
    if (!product && !supplier) linhasIgnoradas += 1;
  });

  if (!importedProducts.length && !importedSuppliers.length) {
    const headers = collectDetectedHeaders(rows);
    const headerHint = headers.length
      ? ` Cabeçalhos encontrados: ${headers.join(", ")}.`
      : "";
    throw new Error(
      `Nenhum produto ou fornecedor foi identificado.${headerHint} Use colunas como Produto, Código, Quantidade, Fornecedor, CNPJ, E-mail ou Tipo.`,
    );
  }

  const supplierMap = new Map<string, Fornecedor>();
  options.fornecedoresAtuais.forEach((fornecedor) => {
    supplierMap.set(supplierKey(fornecedor), fornecedor);
  });
  importedSuppliers.forEach((fornecedor) => {
    const key = supplierKey(fornecedor);
    if (!supplierMap.has(key)) supplierMap.set(key, fornecedor);
  });

  const currentProductKeys = new Set(
    options.produtosAtuais.map((produto) => normalize(produto.codigo || produto.produto)),
  );
  const uniqueImportedProducts = dedupeProducts(importedProducts);
  const products = dedupeProducts([...uniqueImportedProducts, ...options.produtosAtuais]);
  const suppliers = Array.from(supplierMap.values());

  return {
    produtos: products,
    fornecedores: suppliers,
    produtosCriados: uniqueImportedProducts.filter(
      (produto) => !currentProductKeys.has(normalize(produto.codigo || produto.produto)),
    ).length,
    fornecedoresCriados: Math.max(
      0,
      suppliers.length - options.fornecedoresAtuais.length,
    ),
    linhasIgnoradas,
  };
}
