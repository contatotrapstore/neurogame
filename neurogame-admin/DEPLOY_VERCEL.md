# 🚀 Deploy do Admin Panel no Vercel

Este guia explica como fazer o deploy do painel administrativo NeuroGame no Vercel.

## ✅ Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Backend já deployado (veja [backend/DEPLOY_VERCEL.md](../neurogame-backend/DEPLOY_VERCEL.md))
- Vercel CLI instalado (opcional): `npm i -g vercel`

## 📋 Passo a Passo

### 1. Configurar variáveis de ambiente

No painel do Vercel, adicione:

```env
# API Backend URL
VITE_API_URL=https://seu-backend.vercel.app/api/v1

# App Info (opcional)
VITE_APP_NAME=NeuroGame Admin
VITE_APP_VERSION=1.0.0
```

### 2. Deploy via Vercel Dashboard

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório do projeto
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `neurogame-admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Adicione as variáveis de ambiente
5. Clique em **Deploy**

### 3. Deploy via CLI (alternativo)

```bash
cd neurogame-admin

# Login no Vercel
vercel login

# Deploy de teste
vercel

# Deploy em produção
vercel --prod
```

### 4. Configurar domínio customizado (opcional)

No painel do Vercel:
1. Vá em **Settings** > **Domains**
2. Adicione seu domínio (ex: `admin.neurogame.com`)
3. Configure o DNS conforme instruções

## 🔒 Segurança

### Headers de Segurança

O arquivo `vercel.json` já inclui:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Proteção adicional:

1. **Senha forte** para usuários admin
2. **2FA** habilitado (futuro)
3. **Rate limiting** no backend
4. **HTTPS obrigatório** (Vercel já fornece)

## 🧪 Testar deployment

```bash
# Abrir no navegador
open https://seu-admin.vercel.app

# Testar login
# Email: admin@neurogame.com
# Senha: (sua senha configurada)
```

## 📊 Build local

Para testar o build antes do deploy:

```bash
# Instalar dependências
npm install

# Build
npm run build

# Preview do build
npm run preview
```

## 🔄 Atualizar deployment

### Via Git (Recomendado):
1. Faça commit das alterações
2. Push para a branch `main`
3. Vercel faz deploy automático

### Via CLI:
```bash
vercel --prod
```

## 🆘 Troubleshooting

### Erro: "Build failed"
- Verifique se todas as dependências estão em `package.json`
- Execute `npm run build` localmente
- Verifique logs no painel do Vercel

### Erro: "API connection failed"
- Verifique `VITE_API_URL`
- Certifique-se que o backend está online
- Verifique configuração CORS no backend

### Erro: "404 on refresh"
- O `vercel.json` deve ter a configuração de rewrites
- Todas as rotas devem apontar para `/index.html`

## 🎯 Variáveis de ambiente necessárias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_URL` | URL da API backend | `https://api.neurogame.com/api/v1` |
| `VITE_APP_NAME` | Nome do app (opcional) | `NeuroGame Admin` |
| `VITE_APP_VERSION` | Versão (opcional) | `1.0.0` |

## 📁 Estrutura do projeto

```
neurogame-admin/
├── dist/              # Build output (gerado)
├── public/            # Assets estáticos
├── src/               # Código fonte
├── .env               # Variáveis locais (não commitar)
├── .env.example       # Template de variáveis
├── vercel.json        # Configuração Vercel
├── vite.config.js     # Configuração Vite
└── package.json       # Dependências
```

## 🚀 Deploy automático com GitHub

1. Conecte o repositório ao Vercel
2. Configure branch de produção (`main`)
3. A cada push, Vercel faz deploy automático

### Branches de preview:
- Push em `develop` → Deploy de preview
- Pull requests → Deploy de preview automático

## 📈 Monitoramento

### Analytics (opcional):
```bash
# Instalar Vercel Analytics
npm i @vercel/analytics
```

```jsx
// src/main.jsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Analytics />
  </>
);
```

### Logs e métricas:
- Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
- Ver logs: `vercel logs`

## ✅ Checklist pré-deploy

- [ ] Backend deployado e funcionando
- [ ] Variável `VITE_API_URL` configurada
- [ ] Build local testado (`npm run build`)
- [ ] Domínio configurado (opcional)
- [ ] CORS configurado no backend
- [ ] Credenciais de admin criadas

## 🎯 Próximos passos

1. ✅ Configurar domínio customizado
2. ✅ Adicionar Google Analytics
3. ✅ Implementar 2FA
4. ✅ Adicionar monitoramento de erros (Sentry)
5. ✅ Configurar CI/CD avançado

---

**Documentação oficial**: [vercel.com/docs](https://vercel.com/docs/frameworks/vite)
