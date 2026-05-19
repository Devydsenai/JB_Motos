import { useState } from "react";
import styled from "styled-components";
import { Icon } from "@components/atoms/Icon";
import { Input } from "@components/atoms/Input";

const Wrapper = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 420px;
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = "Buscar produtos, serviços...",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <Wrapper onSubmit={handleSubmit} role="search">
      <Input
        name="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        aria-label="Campo de busca"
      />
      <SearchButton type="submit" aria-label="Pesquisar">
        <Icon name="search" size={18} color="#fff" />
      </SearchButton>
    </Wrapper>
  );
}
