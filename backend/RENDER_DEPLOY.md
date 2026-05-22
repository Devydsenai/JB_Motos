# Deploy JB Motos API no Render

## Comandos no painel do Render (IMPORTANTE)

Com **Root Directory** = `backend`, deixe os campos assim:

| Campo | Valor correto |
|--------|----------------|
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

**Não use:**
- `prisma generate && tsc` no Build
- `node dist/src/server.js` no Start

Se esses comandos antigos estiverem preenchidos no painel, o Render **ignora** o `package.json` e o deploy quebra.

## O que o package.json executa

- `npm run build` → `prisma generate`
- `npm start` → `tsx src/server.ts`

## Variáveis de ambiente obrigatórias

```
NODE_ENV=production
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
ALLOWED_ORIGINS=https://seu-frontend.com
FRONTEND_URL=https://seu-frontend.com
API_PUBLIC_URL=https://sua-api.onrender.com
MERCADO_PAGO_ACCESS_TOKEN=...
MERCADO_PAGO_SANDBOX=false
N8N_CLIENT_ASSISTANT_URL=https://devyds.app.n8n.cloud/webhook/jb-motos/assistente-cliente
N8N_ADMIN_ASSISTANT_URL=https://devyds.app.n8n.cloud/webhook/jb-motos/assistente-administrativo
```

Não defina `PORT` manualmente — o Render injeta automaticamente.

## Depois do deploy

Teste: `https://SUA-URL.onrender.com/api/v1`

No frontend: `VITE_API_URL=https://SUA-URL.onrender.com`
