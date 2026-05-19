import styled from "styled-components";
import { Text } from "@components/atoms/Text";

const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export interface PagePlaceholderProps {
  title: string;
  description?: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <Card>
      <Text as="h1" variant="h2" weight="bold">
        {title}
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: "0.75rem" }}>
        {description ??
          "Página em construção. A equipe de backend integrará os dados em breve."}
      </Text>
    </Card>
  );
}
