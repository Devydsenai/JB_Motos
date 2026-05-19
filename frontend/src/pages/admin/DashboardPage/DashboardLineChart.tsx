import type { PontoGrafico } from "@/data/mockDashboard";

type Props = {
  dados: PontoGrafico[];
  corAtual?: string;
  corReferencia?: string;
};

const W = 640;
const H = 220;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };

export function DashboardLineChart({
  dados,
  corAtual = "#c41e1e",
  corReferencia = "#1a1a1a",
}: Props) {
  if (dados.length === 0) return null;

  const maxVal = Math.max(
    ...dados.flatMap((d) => [d.atual, d.referencia]),
    1,
  );
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const x = (i: number) =>
    PAD.left + (i / Math.max(dados.length - 1, 1)) * innerW;
  const y = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;

  const toPath = (key: "atual" | "referencia") =>
    dados
      .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d[key])}`)
      .join(" ");

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const val = Math.round(maxVal * t);
    const yPos = y(val);
    return { val, yPos };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {gridLines.map(({ val, yPos }) => (
        <g key={val}>
          <line
            x1={PAD.left}
            y1={yPos}
            x2={W - PAD.right}
            y2={yPos}
            stroke="currentColor"
            strokeOpacity={0.08}
          />
          <text
            x={PAD.left - 8}
            y={yPos + 4}
            textAnchor="end"
            fontSize="10"
            fill="currentColor"
            opacity={0.45}
          >
            {val}
          </text>
        </g>
      ))}

      <path
        d={toPath("referencia")}
        fill="none"
        stroke={corReferencia}
        strokeWidth={2}
        strokeOpacity={0.35}
        strokeDasharray="6 4"
      />
      <path
        d={toPath("atual")}
        fill="none"
        stroke={corAtual}
        strokeWidth={2.5}
      />

      {dados.map((d, i) => (
        <g key={d.label}>
          <circle cx={x(i)} cy={y(d.atual)} r={4} fill={corAtual} />
          <text
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            opacity={0.55}
          >
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
