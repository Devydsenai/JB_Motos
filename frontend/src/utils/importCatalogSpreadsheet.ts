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
  return header.reduce<SpreadsheetRow>((acc, key, index) => {
    const name = String(key ?? "").trim();
    if (name) acc[name] = values[index] ?? "";
    return acc;
  }, {});
}

function scoreHeader(cells: unknown[]) {
  const normalized = cells.map((cell) => normalize(String(cell ?? "")));
  const known = [
    "tipo",
    "registro",
    "produto",
    "nomeproduto",
    "peca",
    "codigo",
    "sku",
    "valor",
    "preco",
    "quantidade",
    "fornecedor",
    "nomefornecedor",
    "empresa",
    "razaosocial",
    "cnpj",
    "email",
    "telefone",
  ];

  return normalized.filter((cell) =>
    known.some((key) => cell.includes(key) || key.includes(cell)),
  ).length;
}

function readRowsFromSheet(sheet: XLSX.WorkSheet) {
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (!matrix.length) return [];

  const headerIndex = matrix.reduce(
    (best, row, index) => {
      const score = scoreHeader(row);
      return score > best.score ? { index, score } : best;
    },
    { index: 0, score: 0 },
  ).index;

  const header = matrix[headerIndex];
  return matrix
    .slice(headerIndex + 1)
    .map((row) => rowFromHeader(header, row))
    .filter(hasAnyValue);
}

function readValue(row: SpreadsheetRow, aliases: string[]) {
  const normalizedAliases = aliases.map(normalize);
  const entry = Object.entries(row).find(([key]) =>
    normalizedAliases.includes(normalize(key)),
  );
  return String(entry?.[1] ?? "").trim();
}

function readNumberText(row: SpreadsheetRow, aliases: string[]) {
  const value = readValue(row, aliases);
  return value ? value.replace(".", ",") : "";
}

function hasAny(row: SpreadsheetRow, aliases: string[]) {
  return readValue(row, aliases).length > 0;
}

function supplierKey(fornecedor: Pick<Fornecedor, "cnpj" | "email" | "nome">) {
  return normalize(fornecedor.cnpj || fornecedor.email || fornecedor.nome);
}

function shouldCreateSupplier(row: SpreadsheetRow) {
  const tipo = readValue(row, ["tipo", "tipo registro", "registro"]);
  return (
    normalize(tipo).includes("fornecedor") ||
    hasAny(row, [
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
    ])
  );
}

function shouldCreateProduct(row: SpreadsheetRow) {
  const tipo = readValue(row, ["tipo", "tipo registro", "registro"]);
  return (
    normalize(tipo).includes("produto") ||
    normalize(tipo).includes("peca") ||
    normalize(tipo).includes("peça") ||
    hasAny(row, [
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
    ])
  );
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
    ]) || readValue(row, ["fabricante", "distribuidor"]);
  const nomeFinal =
    nome || (tipoRegistro.includes("fornecedor") ? readValue(row, ["nome"]) : "");

  if (!nomeFinal) return null;

  return {
    id: `for-import-${Date.now()}-${index}`,
    codigo:
      readValue(row, ["codigo fornecedor", "cod fornecedor", "id fornecedor"]) ||
      `FOR-${String(index + 1).padStart(3, "0")}`,
    nome: nomeFinal,
    cnpj: readValue(row, ["cnpj", "documento fornecedor"]),
    tipo: readValue(row, ["tipo fornecedor", "tipo"]) || "Distribuidor",
    categoria: readValue(row, ["categoria fornecedor", "categoria"]),
    fornecedorDesde: readValue(row, ["fornecedor desde", "data cadastro"]),
    contato: readValue(row, ["contato", "responsavel", "responsável", "vendedor"]) || nomeFinal,
    email: readValue(row, ["email fornecedor", "email", "e-mail"]),
    telefone: readValue(row, ["telefone fornecedor", "telefone", "celular"]),
    endereco: readValue(row, ["endereco", "endereço"]),
    cidade: readValue(row, ["cidade"]),
    estado: readValue(row, ["estado", "uf"]),
    condicoesPagamento: readValue(row, [
      "condicao pagamento",
      "condicoes pagamento",
      "pagamento",
    ]),
    condicoesPagamento2: "",
    observacoes: readValue(row, ["observacoes fornecedor", "observacoes"]),
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
    ]) || (tipoRegistro.includes("produto") || tipoRegistro.includes("peca")
      ? readValue(row, ["nome", "descricao", "descrição"])
      : "");
  if (!produto) return null;

  return {
    id: `prd-import-${Date.now()}-${index}`,
    produto,
    codigo:
      readValue(row, ["codigo produto", "cod produto", "sku", "codigo"]) ||
      `PRD-${String(index + 1).padStart(3, "0")}`,
    descricao: readValue(row, ["descricao", "descrição", "detalhes", "observacao", "observação"]),
    fornecedor: readValue(row, [
      "fornecedor",
      "nome fornecedor",
      "empresa",
      "nome empresa",
      "razao social",
    ]),
    categoria: readValue(row, ["categoria produto", "categoria"]),
    valor:
      readValue(row, ["valor venda", "preco venda", "preço venda", "valor", "preco", "preço"]) ||
      "R$0,00",
    ativo: true,
    visivelLoja: false,
    precoCusto: readValue(row, ["preco custo", "preço custo", "custo"]),
    quantidade: readNumberText(row, ["quantidade", "qtd", "estoque", "saldo"]),
    quantidadeMinima: readNumberText(row, [
      "quantidade minima",
      "qtd minima",
      "estoque minimo",
    ]),
    codigoBarras: readValue(row, ["codigo barras", "código barras", "ean"]),
    localizacao: readValue(row, ["localizacao", "localização", "local estoque"]),
    peso: readNumberText(row, ["peso", "peso kg"]),
    dimensoes: readValue(row, ["dimensoes", "dimensões"]),
    validade: readValue(row, ["validade", "data validade"]),
  };
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

export async function importCatalogSpreadsheet(
  file: File,
  options: ImportCatalogOptions,
): Promise<ImportCatalogResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const rows = workbook.SheetNames.flatMap((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    return sheet ? readRowsFromSheet(sheet) : [];
  });

  if (!rows.length) {
    throw new Error("A planilha não possui linhas com cabeçalhos reconhecíveis.");
  }

  const importedProducts: Produto[] = [];
  const importedSuppliers: Fornecedor[] = [];
  let linhasIgnoradas = 0;

  rows.forEach((row, index) => {
    const product = shouldCreateProduct(row) ? createProduct(row, index) : null;
    const supplier = shouldCreateSupplier(row)
      ? createSupplier(row, index, product ? 1 : 0)
      : null;

    if (product) importedProducts.push(product);
    if (supplier) importedSuppliers.push(supplier);
    if (!product && !supplier) linhasIgnoradas += 1;
  });

  if (!importedProducts.length && !importedSuppliers.length) {
    throw new Error(
      "Nenhum produto ou fornecedor foi identificado. Confira cabeçalhos como Produto, Código, Quantidade, Fornecedor, CNPJ, Email ou Tipo.",
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
