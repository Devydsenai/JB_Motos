# JB Motos — Backend API v1.0.0

Backend profissional para sistema de Ordens de Serviço de oficina de motos.

## Stack

- **Node.js 22+** + **TypeScript**
- **Express 5** + **Zod** (validação)
- **Prisma ORM v7** + **@prisma/adapter-pg**
- **Supabase PostgreSQL**
- **JWT** + **bcryptjs**

---

## Primeira configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
```

Preencha no `.env`:

| Variável | Porta | Uso |
|---|---|---|
| `DATABASE_URL` | **6543** + `?pgbouncer=true` | Runtime — Prisma Client |
| `DIRECT_URL` | **5432** | Migrations — `prisma migrate` |
| `JWT_SECRET` | — | Mínimo 32 caracteres aleatórios |

### 3. Gerar o Prisma Client

```bash
npm run db:generate
```

### 4. Aplicar o schema no Supabase

```bash
# Desenvolvimento (cria migration com nome)
npm run db:migrate

# Produção / CI
npm run db:migrate:deploy
```

### 5. Seed — usuários padrão

```bash
npm run db:seed
```

Credenciais criadas:

| Role | E-mail | Senha |
|---|---|---|
| PROPRIETARIO | proprietario@jbmotos.com | JBMotos@2024 |
| ATENDENTE | atendente@jbmotos.com | JBMotos@2024 |
| MECANICO | mecanico@jbmotos.com | JBMotos@2024 |

### 6. Testar conexão

```bash
npm run db:test
```

### 7. Iniciar servidor

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm run build && npm start
```

---

## Endpoints

Base URL: `http://localhost:3001/api/v1`

### AUTH
| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| POST | /auth/login | ❌ | Login |
| GET | /auth/me | ✅ | Perfil do usuário logado |
| PATCH | /auth/change-password | ✅ | Alterar senha |

### USERS (PROPRIETARIO)
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /users | Listar usuários |
| GET | /users/:id | Buscar por ID |
| POST | /users | Criar usuário |
| PUT | /users/:id | Atualizar |
| DELETE | /users/:id | Desativar |

### CLIENTS (PROPRIETARIO, ATENDENTE)
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /clients | Listar clientes |
| GET | /clients/:id | Buscar por ID |
| GET | /clients/:id/history | Histórico de OS do cliente |
| POST | /clients | Cadastrar cliente |
| PUT | /clients/:id | Atualizar |
| DELETE | /clients/:id | Desativar (PROPRIETARIO) |

### MOTORCYCLES (PROPRIETARIO, ATENDENTE, MECANICO)
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /motorcycles | Listar motos |
| GET | /motorcycles/:id | Buscar por ID |
| POST | /motorcycles | Cadastrar moto |
| PUT | /motorcycles/:id | Atualizar |
| DELETE | /motorcycles/:id | Desativar (PROPRIETARIO) |

### SERVICE ORDERS
| Método | Endpoint | Roles | Descrição |
|---|---|---|---|
| GET | /service-orders/dashboard | PROPRIETARIO | Métricas gerais |
| GET | /service-orders | Todos | Listar OS |
| GET | /service-orders/:id | Todos | Detalhe completo |
| POST | /service-orders | PROPRIETARIO, ATENDENTE | Abrir OS |
| PUT | /service-orders/:id | Todos | Atualizar OS |
| PATCH | /service-orders/:id/status | Todos | Atualizar status |

#### Transições de status válidas
```
ABERTA → EM_ANALISE | CANCELADA
EM_ANALISE → AGUARDANDO_PECA | EM_EXECUCAO | CANCELADA
AGUARDANDO_PECA → EM_EXECUCAO | CANCELADA
EM_EXECUCAO → FINALIZADA | AGUARDANDO_PECA
FINALIZADA → (terminal)
CANCELADA → (terminal)
```

### PARTS
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /parts/by-os/:serviceOrderId | Peças de uma OS |
| POST | /parts | Adicionar peça (recalcula valorPecas/valorFinal) |
| PUT | /parts/:id | Atualizar peça |
| DELETE | /parts/:id | Remover peça |

---

## Regras de Negócio Implementadas

- ✅ Telefone único por cliente (P2002 tratado)
- ✅ Placa única por moto
- ✅ OS obriga `descricaoProblema` ≥ 10 chars
- ✅ Transições de status controladas por máquina de estados
- ✅ Não finaliza OS sem valor informado
- ✅ Não edita peças/OS em status FINALIZADA ou CANCELADA
- ✅ Não remove cliente com OS em andamento
- ✅ `valorPecas` e `valorFinal` recalculados automaticamente em cada add/edit/delete de peça
- ✅ Timeline (OSHistory) registrada a cada mudança de status
- ✅ Autorização por role em cada endpoint

---

## Estrutura

```
src/
├── config/
│   └── env.ts              # Validação das env vars via Zod
├── modules/
│   ├── auth/               # Login, me, change-password
│   ├── clients/            # CRUD + histórico
│   ├── motorcycles/        # CRUD
│   ├── service-orders/     # Núcleo do sistema + dashboard
│   ├── parts/              # Peças com recálculo automático
│   └── users/              # Gestão de usuários
├── shared/
│   ├── errors/             # AppError, NotFoundError...
│   ├── middlewares/        # authenticate, authorize, validate, errorHandler
│   ├── types/              # Extensão do Express Request
│   └── utils/              # jwt, hash, response helpers
├── prisma/
│   └── client.ts           # Singleton Prisma + adapter-pg
├── routes/
│   └── index.ts            # Registro de todas as rotas
├── app.ts                  # Express setup
└── server.ts               # Bootstrap + graceful shutdown
prisma/
└── schema.prisma           # Schema completo com enums e indexes
```
