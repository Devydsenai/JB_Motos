import styled from "styled-components";
import type { StatusSolicitacao } from "@/data/mockClientes";
import { statusLabels } from "@/data/mockClientes";

const Badge = styled.span<{ $status: StatusSolicitacao }>`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;

  ${({ $status }) => {
    switch ($status) {
      case "concluido":
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case "atendido":
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case "em_espera":
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case "pendente":
      default:
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
    }
  }}
`;

export interface StatusBadgeProps {
  status: StatusSolicitacao;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge $status={status}>{statusLabels[status]}</Badge>;
}
