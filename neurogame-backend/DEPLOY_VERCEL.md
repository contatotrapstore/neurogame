# 🚀 Deploy do Backend no Vercel

Este guia explica como fazer o deploy do backend NeuroGame no Vercel.

## ✅ Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)
- Vercel CLI instalado (opcional): `npm i -g vercel`

## 📋 Passo a Passo

### 1. Preparar variáveis de ambiente

No painel do Vercel, configure as seguintes variáveis:

```env
# Supabase
SUPABASE_URL=sua-url-do-supabase
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_KEY=sua-chave-de-servico

# JWT
JWT_SECRET=seu-secret-jwt-super-seguro
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=seu-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=https://seu-admin.vercel.app,https://neurogame.com

# Asaas (se usar pagamentos)
ASAAS_API_KEY=sua-chave-asaas
ASAAS_WALLET_ID=seu-wallet-id
SUBSCRIPTION_VALUE=149.90

# Environment
NODE_ENV=production
VERCEL=1
```

### 2. Deploy via Vercel Dashboard

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório do projeto
3. Configure a pasta raiz como `neurogame-backend`
4. Adicione as variáveis de ambiente
5. Clique em **Deploy**

### 3. Deploy via CLI (alternativo)

```bash
cd neurogame-backend

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

### 4. Configurar domínio customizado (opcional)

No painel do Vercel:
1. Vá em **Settings** > **Domains**
2. Adicione seu domínio (ex: `api.neurogame.com`)
3. Configure o DNS conforme instruções

## ⚠️ Limitações do Vercel

### Plano Gratuito:
- **Timeout**: 10 segundos por função
- **Tamanho**: 50MB por função
- **Invocações**: 100GB-hours/mês

### Plano Pro:
- **Timeout**: 60 segundos
- **Tamanho**: 50MB
- **Invocações**: Ilimitadas

## 📦 Arquitetura dos Jogos

### ✅ Como funciona no NeuroGame:

```
┌─────────────────┐
│  Launcher App   │  ← Usuário instala via instalador (.exe/.dmg)
│  (Electron)     │
└────────┬────────┘
         │
         ├─── 🎮 Jogos instalados LOCALMENTE
         │    (vêm junto no instalador ou são baixados após instalação)
         │    → Ficam no PC do usuário
         │    → Executados diretamente pelo Launcher
         │
         └─── 🌐 APIs do Backend (Vercel)
              ├─ Autenticação (login/logout)
              ├─ Assinaturas (criar/verificar/renovar)
              ├─ Validação de acesso
              └─ Sincronização de dados
```

### ✅ O que VAI para o Vercel:
- ✅ APIs REST (`/api/v1/*`)
- ✅ Autenticação e autorização
- ✅ Lógica de assinaturas/pagamentos
- ✅ Validação de licenças
- ✅ Gestão de usuários

### ❌ O que NÃO vai para o Vercel:
- ❌ Arquivos dos jogos (ficam no instalador/PC do usuário)
- ❌ Assets pesados (imagens, vídeos dos jogos)
- ❌ Executáveis dos jogos

> **Nota:** Em desenvolvimento, o backend serve jogos da pasta `../Jogos` para facilitar testes.
> Em produção (Vercel), essa rota é **automaticamente desabilitada** (veja `server.js` linha 47).

## 🧪 Testar deploy

```bash
# Testar health
curl https://seu-backend.vercel.app/api/v1/health

# Testar login
curl -X POST https://seu-backend.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@neurogame.com","password":"senha123"}'
```

## 🔄 Atualizar deployment

### Via Git:
Qualquer push para a branch `main` dispara deploy automático.

### Via CLI:
```bash
vercel --prod
```

## 📊 Monitoramento

Acesse logs e métricas em:
- [vercel.com/dashboard](https://vercel.com/dashboard)
- Logs em tempo real: `vercel logs`

## 🆘 Troubleshooting

### Erro: "Function timeout"
- Otimize queries no Supabase
- Use índices nas tabelas
- Reduza lógica nas rotas

### Erro: "Module not found"
- Verifique `package.json`
- Execute `npm install` localmente
- Certifique-se que dependências estão em `dependencies`, não `devDependencies`

### Erro: "CORS"
- Configure `CORS_ORIGIN` corretamente
- Adicione domínio do admin/launcher

## 🎯 Próximos passos

1. ✅ Configurar domínio customizado
2. ✅ Configurar storage para jogos
3. ✅ Adicionar monitoramento (Sentry)
4. ✅ Configurar CI/CD com GitHub Actions
5. ✅ Implementar cache (Vercel Edge Config)

---

**Documentação oficial**: [vercel.com/docs](https://vercel.com/docs)
