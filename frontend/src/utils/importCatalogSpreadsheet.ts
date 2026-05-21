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
      "empresa",
      "nome empresa",
      "razao social",
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
    hasAny(row, [
      "produto",
      "nome produto",
      "item",
      "peca",
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
  const nome =
    readValue(row, [
      "fornecedor",
      "nome fornecedor",
      "empresa",
      "nome empresa",
      "razao social",
    ]) || readValue(row, ["fabricante", "distribuidor"]);

  if (!nome) return null;

  return {
    id: `for-import-${Date.now()}-${index}`,
    codigo:
      readValue(row, ["codigo fornecedor", "cod fornecedor", "id fornecedor"]) ||
      `FOR-${String(index + 1).padStart(3, "0")}`,
    nome,
    cnpj: readValue(row, ["cnpj", "documento fornecedor"]),
    tipo: readValue(row, ["tipo fornecedor", "tipo"]) || "Distribuidor",
    categoria: readValue(row, ["categoria fornecedor", "categoria"]),
    fornecedorDesde: readValue(row, ["fornecedor desde", "data cadastro"]),
    contato: readValue(row, ["contato", "responsavel", "vendedor"]) || nome,
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
  const produto = readValue(row, ["produto", "nome produto", "item", "peca"]);
  if (!produto) return null;

  return {
    id: `prd-import-${Date.now()}-${index}`,
    produto,
    codigo:
      readValue(row, ["codigo produto", "cod produto", "sku", "codigo"]) ||
      `PRD-${String(index + 1).padStart(3, "0")}`,
    descricao: readValue(row, ["descricao", "descrição", "detalhes"]),
    fornecedor: readValue(row, [
      "fornecedor",
      "nome fornecedor",
      "empresa",
      "nome empresa",
      "razao social",
    ]),
    categoria: readValue(row, ["categoria produto", "categoria"]),
    valor:
      readValue(row, ["valor venda", "preco venda", "preço venda", "valor"]) ||
      "R$0,00",
    ativo: true,
    visivelLoja: false,
    precoCusto: readValue(row, ["preco custo", "preço custo", "custo"]),
    quantidade: readNumberText(row, ["quantidade", "qtd", "estoque"]),
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
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<SpreadsheetRow>(sheet, { defval: "" });

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

  const supplierMap = new Map<string, Fornecedor>();
  options.fornecedoresAtuais.forEach((fornecedor) => {
    supplierMap.set(supplierKey(fornecedor), fornecedor);
  });
  importedSuppliers.forEach((fornecedor) => {
    const key = supplierKey(fornecedor);
    if (!supplierMap.has(key)) supplierMap.set(key, fornecedor);
  });

  const products = dedupeProducts([...importedProducts, ...options.produtosAtuais]);
  const suppliers = Array.from(supplierMap.values());

  return {
    produtos: products,
    fornecedores: suppliers,
    produtosCriados: Math.max(0, products.length - options.produtosAtuais.length),
    fornecedoresCriados: Math.max(
      0,
      suppliers.length - options.fornecedoresAtuais.length,
    ),
    linhasIgnoradas,
  };
}
