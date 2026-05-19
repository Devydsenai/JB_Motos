import styled from "styled-components";
import { Text } from "@components/atoms/Text";
import { Icon } from "@components/atoms/Icon";

const Card = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Value = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 0.5rem;
`;

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: string;
  accent?: "default" | "success" | "warning" | "danger";
}

const accentColors = {
  default: undefined,
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
};

export function StatCard({ label, value, hint, icon, accent = "default" }: StatCardProps) {
  return (
    <Card>
      <Header>
        <Text variant="caption" color="muted" weight="semibold">
          {label}
        </Text>
        {icon && (
          <Icon name={icon} size={20} color={accentColors[accent]} />
        )}
      </Header>
      <Value>{value}</Value>
      {hint && (
        <Text variant="caption" color="muted" style={{ marginTop: "0.35rem" }}>
          {hint}
        </Text>
      )}
    </Card>
  );
}
