# JB Motos — Frontend

React + Vite + TypeScript + styled-components + Bootstrap Icons.

## Estrutura

```
src/
├── components/          # Atomic Design
│   ├── atoms/           # Button, Input, Text, Icon
│   ├── molecules/       # SearchBar, NavItem, DropdownMenu, AlertBadge
│   ├── organisms/       # AdminSidebar, AdminHeader
│   └── templates/       # AdminTemplate, StoreTemplate
├── pages/
│   ├── admin/           # Sua área (administrativo)
│   └── store/           # Loja (outro dev) — placeholders
└── routes/
```

## Comandos

```bash
cd frontend
npm install
npm run dev
```

- **Admin:** http://localhost:5173/admin
- **Loja:** http://localhost:5173/loja

## Componentes (atoms)

```tsx
import { Button, Input, Text, Icon } from "@components/atoms";

<Button variant="primary">Salvar</Button>
<Input label="Nome" placeholder="..." fullWidth />
<Text variant="h2" weight="bold">Título</Text>
<Icon name="search" size={20} />
```

Backend não é alterado por este pacote — apenas UI pronta para integração.
