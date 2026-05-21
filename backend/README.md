# JB Motos — Backend API

API REST para o painel administrativo e a loja online da JB Motos (oficina de motos — peças e serviços).

## Stack

- Node.js 20+
- TypeScript
- Express 5
- Prisma 7 + PostgreSQL (Supabase)
- Zod (validação)
- JWT (auth admin e loja)

## Configuração

1. Copie `.env.example` para `.env` e preencha `DATABASE_URL`, `DIRECT_URL` e `JWT_SECRET` (mín. 32 caracteres).
2. Instale dependências e gere o client:

```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

3. Desenvolvimento:

```bash
npm run dev
```

A API sobe em `http://localhost:3001` — health: `GET /health`, rotas: `/api/v1/*`.

## Credenciais iniciais (seed)

| Área | E-mail | Senha | Código serviço |
|------|--------|-------|----------------|
| Proprietário | proprietario@jbmotos.com | JBMotos@2024 | — |
| Atendente | atendente@jbmotos.com | JBMotos@2024 | 1001 |
| Mecânico | mecanico@jbmotos.com | JBMotos@2024 | 1002 |
| Cliente loja | cliente@jbmotos.com | Cliente@2024 | — |

## Módulos

### Administrativo (Bearer token admin)

- `POST /api/v1/auth/login` — login funcionários
- `GET /api/v1/users/lookup/:codigo` — busca por código de serviço
- `CRUD /api/v1/users` — funcionários + RH (proprietário)
- `CRUD /api/v1/clients`, `/motorcycles`, `/service-orders`, `/parts`
- `CRUD /api/v1/products`, `/suppliers`, `/stock`

### Loja (token store ou sessão)

- `POST /api/v1/store/customers/register|login`
- `GET /api/v1/products/store` — catálogo público
- `CRUD /api/v1/store/cart` — carrinho (login ou `sessionId`)
- `CRUD /api/v1/store/wishlist` — favoritos (login)
- `POST /api/v1/store/orders` — checkout
- `POST /api/v1/store/payments` — PIX/cartão (mock + pronto Mercado Pago)
- `POST /api/v1/service-orders/store` — solicitar serviço online

## Pagamentos (Mercado Pago)

O módulo `payments` grava referência externa, QR PIX mock e campo `mercadoPagoId`. Configure `MERCADO_PAGO_ACCESS_TOKEN` no `.env` quando integrar o simulador/produção. Webhook: `POST /api/v1/store/payments/webhook`.

## Histórico

A pasta `backend` anterior continha apenas a tabela `teste` (placeholder). O schema atual substitui essa base por domínios completos: RH, estoque, loja, pedidos e OS.

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor com hot reload |
| `npm run build` | Compila TypeScript |
| `npm run db:generate` | Gera Prisma Client |
| `npm run db:push` | Sincroniza schema no banco |
| `npm run db:seed` | Dados iniciais |
| `npm run db:test` | Testa conexão |
