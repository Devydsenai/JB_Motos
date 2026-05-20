import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { HotTable, type HotTableClass } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { HyperFormula } from "hyperformula";
import { Button } from "@/components/atoms/Button";
import type { FinancialSheetId } from "@/data/financialSheets";
import { financialSheetsMeta } from "@/data/financialSheets";
import { useThemeMode } from "@/contexts/ThemeContext";
import {
  buildFinancialSheetsFromSystem,
  type FinancialSheetsData,
} from "@/utils/buildFinancialSheets";
import { exportReportPdf } from "@/utils/exportReports";
import { parseSpreadsheetFile } from "@/utils/parseSpreadsheetFile";
import {
  Actions,
  GridHost,
  HiddenFileInput,
  ImportFeedback,
  LicenseNote,
  SheetHint,
  SheetTab,
  SheetTabs,
  SyncBadge,
  Toolbar,
  Wrapper,
} from "./FinancialSpreadsheet.styles";

import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

registerAllModules();

const HOT_LICENSE = "non-commercial-and-evaluation";
const HF_LICENSE = "internal-use-in-handsontable";

export function FinancialSpreadsheet() {
  const hotRef = useRef<HotTableClass>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mode } = useThemeMode();
  const [activeId, setActiveId] = useState<FinancialSheetId>("entradas");
  const [sheetOverrides, setSheetOverrides] = useState<
    Partial<Record<string, (string | number)[][]>>
  >({});
  const [importFeedback, setImportFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const hotThemeName =
    mode === "dark" ? "ht-theme-main-dark" : "ht-theme-main";

  const baseSheets = useMemo(() => buildFinancialSheetsFromSystem(), []);

  const activeMeta = financialSheetsMeta.find((s) => s.id === activeId)!;

  const sheetsData = useMemo((): FinancialSheetsData => {
    const merged: FinancialSheetsData = { ...baseSheets };
    for (const [name, rows] of Object.entries(sheetOverrides)) {
      if (rows) merged[name] = rows;
    }
    return merged;
  }, [baseSheets, sheetOverrides]);

  const activeSheetData =
    sheetsData[activeMeta.sheetName] ?? baseSheets[activeMeta.sheetName] ?? [];

  const hyperformulaInstance = useMemo(
    () =>
      HyperFormula.buildFromSheets(sheetsData, {
        licenseKey: HF_LICENSE,
      }),
    [sheetsData],
  );

  const colWidths = useMemo(() => {
    switch (activeId) {
      case "fluxo":
        return [110, 110, 100, 100, 110, 160];
      case "pagar":
      case "receber":
        return [110, 130, 170, 100, 60, 110, 150];
      default:
        return [110, 180, 110, 100, 100, 150];
    }
  }, [activeId]);

  const exportarCsv = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const plugin = hot.getPlugin("exportFile") as {
      downloadFile?: (
        format: string,
        options: Record<string, unknown>,
      ) => void;
    } | undefined;

    if (plugin?.downloadFile) {
      plugin.downloadFile("csv", {
        filename: `jb-motos-${activeMeta.sheetName}-${Date.now()}`,
        columnHeaders: true,
        rowHeaders: false,
      });
      return;
    }

    const rows = hot.getData() as (string | number | null)[][];
    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const value = cell ?? "";
            const text = String(value).replace(/"/g, '""');
            return /[",\n]/.test(text) ? `"${text}"` : text;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jb-motos-${activeMeta.sheetName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [activeMeta.sheetName]);

  const abrirImportacaoXlsx = useCallback(() => {
    setImportFeedback(null);
    fileInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      try {
        const rows = await parseSpreadsheetFile(file);
        setSheetOverrides((prev) => ({
          ...prev,
          [activeMeta.sheetName]: rows,
        }));
        setImportFeedback({
          type: "success",
          message: `“${file.name}” importado na aba ${activeMeta.label}.`,
        });
      } catch (err) {
        setImportFeedback({
          type: "error",
          message:
            err instanceof Error
              ? err.message
              : "Não foi possível importar o arquivo.",
        });
      }
    },
    [activeMeta.label, activeMeta.sheetName],
  );

  const gerarRelatorioPdf = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const rows = hot.getData() as (string | number | boolean | null)[][];
    const filtered = rows.filter((row) =>
      row.some(
        (cell) => cell !== null && cell !== undefined && String(cell).trim() !== "",
      ),
    );

    if (filtered.length === 0) {
      setImportFeedback({
        type: "error",
        message: "Não há dados na aba para gerar o relatório.",
      });
      return;
    }

    const [headerRow, ...bodyRows] = filtered;
    const columns = headerRow.map((cell) => String(cell ?? ""));

    exportReportPdf({
      title: `Planilha financeira — ${activeMeta.label}`,
      fileName: `jb-motos-${activeMeta.sheetName}-${Date.now()}`,
      columns,
      rows: bodyRows.length > 0 ? bodyRows : [headerRow],
    });
  }, [activeMeta.label, activeMeta.sheetName]);

  return (
    <Wrapper>
      <SyncBadge>
        Sincronizado com Financeiro, Clientes, Estoque, Serviços e Apuração
        diária do sistema (dados mock — mesma fonte das outras telas).
      </SyncBadge>

      <Toolbar>
        <SheetTabs role="tablist" aria-label="Abas financeiras">
          {financialSheetsMeta.map((sheet) => (
            <SheetTab
              key={sheet.id}
              type="button"
              role="tab"
              aria-selected={activeId === sheet.id}
              $active={activeId === sheet.id}
              onClick={() => {
                setActiveId(sheet.id);
                setImportFeedback(null);
              }}
            >
              {sheet.label}
            </SheetTab>
          ))}
        </SheetTabs>

        <Actions>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleImportFile}
          />
          <Button size="sm" variant="primary" type="button" onClick={exportarCsv}>
            Exportar CSV
          </Button>
          <Button
            size="sm"
            variant="primary"
            type="button"
            onClick={abrirImportacaoXlsx}
          >
            Importar XLSX
          </Button>
          <Button
            size="sm"
            variant="primary"
            type="button"
            onClick={gerarRelatorioPdf}
          >
            Relatório PDF
          </Button>
        </Actions>
      </Toolbar>

      {importFeedback && (
        <ImportFeedback $type={importFeedback.type} role="status">
          {importFeedback.message}
        </ImportFeedback>
      )}

      <SheetHint>{activeMeta.description}</SheetHint>

      <GridHost $mode={mode}>
        <HotTable
          ref={hotRef}
          key={`${hotThemeName}-${activeMeta.sheetName}-${activeSheetData.length}`}
          themeName={hotThemeName}
          licenseKey={HOT_LICENSE}
          data={activeSheetData}
          formulas={{
            engine: hyperformulaInstance,
            sheetName: activeMeta.sheetName,
          }}
          colHeaders={false}
          rowHeaders
          height={380}
          stretchH="all"
          colWidths={colWidths}
          manualColumnResize
          manualRowResize
          contextMenu
          filters
          dropdownMenu
          columnSorting
          minSpareRows={2}
          className="htCenter"
        />
      </GridHost>

      <LicenseNote>
        Planilha JB Motos (Handsontable + HyperFormula). Alterações nas abas
        Entradas, Saídas, Fluxo, Contas a pagar e Contas a receber refletem os
        lançamentos e solicitações do sistema. Com o backend, tudo virá do
        Supabase em tempo real.
      </LicenseNote>
    </Wrapper>
  );
}
