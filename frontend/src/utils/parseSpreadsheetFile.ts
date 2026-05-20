import * as XLSX from "xlsx";

export type SpreadsheetRow = (string | number)[];

function normalizeCell(value: unknown): string | number {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

/** Lê a primeira aba de um arquivo .xlsx ou .xls. */
export async function parseSpreadsheetFile(file: File): Promise<SpreadsheetRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("O arquivo não contém abas.");
  }

  const sheet = workbook.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  const rows = raw.map((row) => {
    if (!Array.isArray(row)) return [];
    return row.map(normalizeCell);
  });

  const nonEmpty = rows.filter((row) =>
    row.some((cell) => String(cell).trim() !== ""),
  );

  if (nonEmpty.length === 0) {
    throw new Error("A planilha está vazia.");
  }

  return nonEmpty;
}
