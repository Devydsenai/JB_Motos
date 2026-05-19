import { useEffect, useRef } from "react";
import type { CategoriaLoja } from "@/data/mockDashboard";

type Props = {
  dados: CategoriaLoja[];
};

type GoogleDataTable = {
  addColumn(
    column:
      | "string"
      | "number"
      | {
          type: "string";
          role: "style" | "annotation";
        },
    label?: string,
  ): void;
  addRows(rows: Array<Array<string | number>>): void;
};

type GoogleColumnChart = {
  draw(data: GoogleDataTable, options: Record<string, unknown>): void;
  clearChart(): void;
};

type GoogleChartsApi = {
  charts: {
    load(version: string, settings: { packages: string[]; language: string }): void;
    setOnLoadCallback(callback: () => void): void;
  };
  visualization: {
    DataTable: new () => GoogleDataTable;
    ColumnChart: new (element: HTMLElement) => GoogleColumnChart;
  };
};

declare global {
  interface Window {
    google?: GoogleChartsApi;
  }
}

const GOOGLE_CHARTS_SRC = "https://www.gstatic.com/charts/loader.js";

let googleChartsPromise: Promise<void> | null = null;

function toNumber(valor: string) {
  return Number(valor.replace(/\./g, "").replace(",", ".")) || 0;
}

function loadGoogleCharts() {
  if (window.google?.visualization) {
    return Promise.resolve();
  }

  googleChartsPromise ??= new Promise((resolve, reject) => {
    const loadPackages = () => {
      if (!window.google?.charts) {
        reject(new Error("Google Charts não foi carregado."));
        return;
      }

      window.google.charts.load("current", {
        packages: ["corechart", "bar"],
        language: "pt-BR",
      });
      window.google.charts.setOnLoadCallback(resolve);
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_CHARTS_SRC}"]`,
    );

    if (existingScript) {
      if (window.google?.charts) {
        loadPackages();
        return;
      }

      existingScript.addEventListener("load", loadPackages, { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_CHARTS_SRC;
    script.async = true;
    script.addEventListener("load", loadPackages, { once: true });
    script.addEventListener("error", () => reject(), { once: true });
    document.head.appendChild(script);
  });

  return googleChartsPromise;
}

export function DashboardBarChart({ dados }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chartRef.current;
    if (!container || dados.length === 0) return;

    let chart: GoogleColumnChart | null = null;
    let disposed = false;

    const drawChart = () => {
      if (disposed || !window.google?.visualization) return;

      const textColor = getComputedStyle(container).color || "#1a1a1a";
      const data = new window.google.visualization.DataTable();
      data.addColumn("string", "Categoria");
      data.addColumn("number", "Quantidade");
      data.addColumn({ type: "string", role: "style" });
      data.addColumn({ type: "string", role: "annotation" });
      data.addRows(
        dados.map((item) => {
          const valor = toNumber(item.valor);
          return [item.label, valor, `color: ${item.cor}`, item.valor];
        }),
      );

      const options = {
        focusTarget: "category",
        legend: { position: "none" },
        backgroundColor: "transparent",
        bar: { groupWidth: "52%" },
        chartArea: {
          left: 58,
          right: 18,
          top: 24,
          bottom: 52,
          width: "86%",
          height: "72%",
        },
        hAxis: {
          title: "Catálogo da loja",
          textStyle: {
            fontSize: 12,
            color: textColor,
            bold: true,
          },
          titleTextStyle: {
            fontSize: 14,
            color: textColor,
            bold: true,
          },
        },
        vAxis: {
          title: "Quantidade",
          minValue: 0,
          format: "short",
          gridlines: { color: "rgba(107, 114, 128, 0.18)" },
          textStyle: {
            fontSize: 12,
            color: textColor,
          },
          titleTextStyle: {
            fontSize: 14,
            color: textColor,
            bold: true,
          },
        },
        annotations: {
          alwaysOutside: true,
          textStyle: {
            fontSize: 12,
            color: textColor,
            bold: true,
            auraColor: "none",
          },
        },
      };

      chart = new window.google.visualization.ColumnChart(container);
      chart.draw(data, options);
    };

    loadGoogleCharts().then(drawChart).catch(() => undefined);
    window.addEventListener("resize", drawChart);

    return () => {
      disposed = true;
      window.removeEventListener("resize", drawChart);
      chart?.clearChart();
    };
  }, [dados]);

  return (
    <div
      ref={chartRef}
      role="img"
      aria-label="Gráfico de barras do catálogo da loja"
      className="google-chart"
    />
  );
}
