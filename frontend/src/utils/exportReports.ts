type ReportCell = string | number | boolean | null | undefined;

type ExportReportOptions = {
  title: string;
  fileName: string;
  columns: string[];
  rows: ReportCell[][];
};

type ExportFormat = "excel" | "pdf";

function escapeHtml(value: ReportCell) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildReportHtml({ title, columns, rows }: ExportReportOptions) {
  const generatedAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1a1a1a; margin: 24px; }
      h1 { color: #c41e1e; font-size: 22px; margin: 0 0 4px; }
      p { margin: 0 0 18px; color: #6b7280; font-size: 12px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th { background: #c41e1e; color: #fff; text-align: left; }
      th, td { border: 1px solid #e2e4e9; padding: 8px; }
      tr:nth-child(even) td { background: #f8fafc; }
      @media print { body { margin: 12mm; } }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p>Gerado em ${escapeHtml(generatedAt)} - JB Motos</p>
    <table>
      <thead>
        <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </body>
</html>`;
}

function downloadExcel(fileName: string, html: string) {
  const blob = new Blob(["\ufeff", html], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function openPdfPrint(title: string, html: string) {
  const printWindow = window.open("", "_blank", "width=1024,height=768");
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.document.title = title;
  printWindow.focus();
  printWindow.print();
}

function chooseExportFormat(title: string): Promise<ExportFormat | null> {
  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(15, 17, 20, 0.58);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    `;

    const modal = document.createElement("section");
    modal.style.cssText = `
      width: min(420px, 100%);
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
      padding: 22px;
      font-family: Arial, sans-serif;
      color: #1a1a1a;
    `;

    modal.innerHTML = `
      <h2 style="font-size: 18px; margin: 0 0 8px; font-weight: 800;">
        Exportar relatório
      </h2>
      <p style="font-size: 13px; line-height: 1.45; color: #6b7280; margin: 0 0 18px;">
        Escolha o formato para <strong>${escapeHtml(title)}</strong>.
      </p>
      <div style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;">
        <button type="button" data-format="pdf" style="
          border: 1px solid #c41e1e;
          background: transparent;
          color: #c41e1e;
          border-radius: 8px;
          padding: 10px 14px;
          font-weight: 800;
          cursor: pointer;
        ">PDF</button>
        <button type="button" data-format="excel" style="
          border: 1px solid #c41e1e;
          background: #c41e1e;
          color: #fff;
          border-radius: 8px;
          padding: 10px 14px;
          font-weight: 800;
          cursor: pointer;
        ">Excel</button>
        <button type="button" data-format="cancel" style="
          border: 1px solid #e2e4e9;
          background: transparent;
          color: #6b7280;
          border-radius: 8px;
          padding: 10px 14px;
          font-weight: 800;
          cursor: pointer;
        ">Cancelar</button>
      </div>
    `;

    const close = (format: ExportFormat | null) => {
      backdrop.remove();
      resolve(format);
    };

    modal.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const format = target.dataset.format;
      if (format === "excel" || format === "pdf") close(format);
      if (format === "cancel") close(null);
    });

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) close(null);
    });

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
  });
}

export async function exportReport(options: ExportReportOptions) {
  const format = await chooseExportFormat(options.title);
  if (!format) return;

  const html = buildReportHtml(options);
  if (format === "excel") {
    downloadExcel(options.fileName, html);
    return;
  }

  openPdfPrint(options.title, html);
}
