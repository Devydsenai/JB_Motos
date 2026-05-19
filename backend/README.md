# JB Motos — Backend

Base do banco com **Supabase (PostgreSQL)** e **Prisma ORM v7**, preparada para a equipe evoluir o schema depois.

No momento existe apenas a tabela **`teste`** para validar conexão e migrations.

## Pré-requisitos

- Node.js **20.19+** (recomendado 22.x)
- Projeto Supabase já criado

## Configuração

1. Entre na pasta:

   ```bash
   cd backend
   ```

2. Instale dependências:

   ```bash
   npm install
   ```

3. Copie o exemplo de variáveis:

   ```bash
   copy .env.example .env
   ```

4. No [Supabase Dashboard](https://supabase.com/dashboard) → **Connect**, preencha no `.env`:

   | Variável | Uso |
   |----------|-----|
   | `DATABASE_URL` | Porta **6543** + `?pgbouncer=true` — runtime (Prisma Client) |
   | `DIRECT_URL` | Porta **5432** — migrations (`prisma migrate`) |

   Troque `[PROJECT-REF]`, `[SENHA]` e `[REGIAO]` pelos valores do seu projeto.

   **Importante:** `DIRECT_URL` é obrigatória para `db:migrate` e `db:migrate:deploy`. Sem ela, as migrations não sobem no Supabase.

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run db:generate` | Gera o client em `generated/prisma` |
| `npm run db:migrate:deploy` | Aplica migrations no Supabase (CI/produção) |
| `npm run db:migrate` | Cria/aplica migration em desenvolvimento |
| `npm run db:test` | Testa leitura da tabela `teste` |
| `npm run db:studio` | Abre Prisma Studio |

## Primeira subida (equipe)

Com o `.env` configurado:

```bash
npm run db:generate
npm run db:migrate:deploy
```

Para inserir um registro de teste manualmente no SQL Editor do Supabase:

```sql
INSERT INTO teste (nome) VALUES ('JB Motos - teste OK');
```

Depois:

```bash
npm run db:test
```

## Prisma 7 + Supabase

- **v7.2+** corrige o fluxo de URL nas migrations; este projeto usa Prisma 7 com `prisma.config.ts`.
- Migrations usam `DIRECT_URL` (porta 5432).
- A aplicação usa `DATABASE_URL` (pooler 6543) com `@prisma/adapter-pg`.
- Não crie outras tabelas neste repositório até a equipe definir o modelo — apenas estenda `prisma/schema.prisma` e rode `npm run db:migrate`.

## Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma      # model Teste → tabela teste
│   └── migrations/
├── prisma.config.ts       # CLI aponta para DIRECT_URL
├── src/lib/prisma.ts      # client com adapter pg
└── generated/prisma/      # gerado por npm run db:generate (não versionar)
```
