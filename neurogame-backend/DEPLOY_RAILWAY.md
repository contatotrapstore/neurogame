# 🚀 Deploy do Backend no Railway - Passo a Passo

## ✅ Pré-requisitos

- [x] Conta no GitHub (https://github.com)
- [x] Conta no Railway (https://railway.app)
- [x] Conta no Supabase (https://supabase.com)
- [x] Código no GitHub (repositório criado)

---

## 📋 Visão Geral

O Railway é uma plataforma moderna de deploy que oferece:

- ✅ **$5 grátis/mês** para começar (sem cartão de crédito)
- ✅ Deploy automático a cada push no GitHub
- ✅ HTTPS automático
- ✅ Logs em tempo real
- ✅ Fácil configuração de variáveis de ambiente
- ✅ PostgreSQL, Redis, MySQL embutidos (se precisar)

**Tempo estimado:** 15-20 minutos

---

## 🔧 ETAPA 1: Preparar Supabase

### 1.1 Obter Credenciais do Supabase

1. **Acesse:** https://app.supabase.com
2. **Selecione** seu projeto (ou crie um novo)
3. **Vá em:** Settings → API
4. **Copie as seguintes informações:**

```
URL: https://seu-projeto.supabase.co
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:** A `service_role key` é SECRETA! Nunca exponha publicamente.

---

## 🌐 ETAPA 2: Deploy no Railway

### 2.1 Criar Conta no Railway

1. **Acesse:** https://railway.app
2. **Clique em:** "Login" → "Login with GitHub"
3. **Autorize** o Railway a acessar sua conta GitHub
4. **Você ganha $5 grátis** para começar!

### 2.2 Criar Novo Projeto

1. **No dashboard, clique em:** "New Project"
2. **Escolha:** "Deploy from GitHub repo"
3. **Autorize o Railway** a acessar seus repositórios (se ainda não fez)
4. **Selecione** o repositório `neurogame-platform`
5. **IMPORTANTE:** Configure o Root Directory

### 2.3 Configurar Root Directory

Como temos múltiplos projetos na mesma pasta:

1. **Após selecionar o repositório,** clique em **"Add variables"** (vamos fazer depois)
2. **Clique em Settings** (ícone de engrenagem)
3. **Em "Build"**, encontre **"Root Directory"**
4. **Digite:** `neurogame-backend`
5. **Clique em** "Save"

### 2.4 Configurar Variáveis de Ambiente

**IMPORTANTE:** O Railway precisa de TODAS as variáveis configuradas antes do deploy.

1. **Clique na aba "Variables"**
2. **Clique em "New Variable"** ou **"RAW Editor"**
3. **Cole todas as variáveis abaixo** (substitua pelos valores reais):

```env
NODE_ENV=production
PORT=3000

# Supabase (SUBSTITUA com suas chaves!)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_KEY=sua_chave_service_role_aqui

# JWT (GERE chaves fortes!)
JWT_SECRET=sua-chave-secreta-jwt-256-bits-forte
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=sua-chave-secreta-refresh-diferente
JWT_REFRESH_EXPIRES_IN=7d

# Asaas (use sandbox para testes)
ASAAS_API_KEY=sua_chave_asaas
ASAAS_WEBHOOK_SECRET=seu_webhook_secret
ASAAS_ENVIRONMENT=sandbox

# Planos
SUBSCRIPTION_VALUE=149.90
SUBSCRIPTION_CURRENCY=BRL

# Limites
MAX_DEVICES_PER_USER=3
HEARTBEAT_INTERVAL_HOURS=12
OFFLINE_GRACE_PERIOD_HOURS=48

# CORS (SUBSTITUA pela URL do seu admin na Vercel!)
CORS_ORIGIN=https://seu-admin.vercel.app,https://admin.neurogame.com.br
ALLOWED_ORIGINS=https://seu-admin.vercel.app,https://admin.neurogame.com.br

# Logs
LOG_LEVEL=info
```

**💡 Como gerar chaves JWT fortes:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Execute 2 vezes para gerar `JWT_SECRET` e `JWT_REFRESH_SECRET` diferentes.

4. **Clique em "Add"** para salvar

### 2.5 Fazer Deploy

1. **Após configurar variáveis,** o Railway vai **automaticamente iniciar o deploy**
2. **Aguarde** (leva 2-4 minutos)
3. **Acompanhe os logs** em tempo real na aba "Deployments"

### 2.6 Verificar Deploy

Quando terminar, você verá:
- ✅ Status: "Success" ou "Active"
- ✅ URL gerada automaticamente

---

## 🎯 ETAPA 3: Obter URL e Testar

### 3.1 Gerar Domínio Público

1. **Clique em Settings** (engrenagem)
2. **Em "Networking",** clique em **"Generate Domain"**
3. **O Railway vai gerar** uma URL tipo: `neurogame-backend.up.railway.app`
4. **Copie essa URL** - você vai precisar dela!

### 3.2 Testar a API

Abra o navegador ou use curl:

```bash
# Health check
https://neurogame-backend.up.railway.app/api/v1/health

# Deve retornar:
{
  "status": "ok",
  "timestamp": "2025-10-06T...",
  "uptime": 123.45,
  "environment": "production"
}
```

**✅ Se retornar isso, está funcionando!**

### 3.3 Testar Login

```bash
curl -X POST https://neurogame-backend.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'
```

**✅ Se retornar token JWT, está tudo OK!**

---

## 🔄 Atualizações Automáticas

A partir de agora, **toda vez que você fizer push no GitHub:**

1. Railway detecta automaticamente
2. Faz novo build
3. Faz deploy automaticamente
4. Sem downtime!

```bash
# No seu computador
cd neurogame-backend
# ... faça alterações ...
git add .
git commit -m "feat: alguma melhoria"
git push

# Railway faz deploy automaticamente!
```

---

## 🔒 Configurar Domínio Personalizado (Opcional)

Se você tem um domínio próprio:

1. **No Railway, vá em Settings → Networking**
2. **Clique em "Custom Domain"**
3. **Digite:** `api.neurogame.com.br`
4. **Configure DNS** no seu provedor de domínio:
   - Tipo: `CNAME`
   - Nome: `api`
   - Valor: `neurogame-backend.up.railway.app`
5. **Aguarde propagação** (5-30 minutos)

---

## 📊 Monitoramento

### Ver Logs

1. **No dashboard do projeto**
2. **Clique em "Deployments"**
3. **Veja logs em tempo real**

### Métricas

1. **Clique em "Metrics"**
2. **Veja:**
   - CPU usage
   - Memory usage
   - Network
   - Requests/min

---

## 🐛 Troubleshooting (Solução de Problemas)

### ❌ Deploy Failed - "Module not found"

**Causa:** Dependências não instaladas

**Solução:**
1. Verifique se `package.json` está correto
2. Verifique se Root Directory é `neurogame-backend`
3. Tente fazer "Redeploy"

### ❌ Application Error - "Cannot connect to Supabase"

**Causa:** Variáveis de ambiente incorretas

**Solução:**
1. Verifique variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_KEY`
2. Certifique-se que são do mesmo projeto
3. Teste as credenciais localmente primeiro

### ❌ CORS Error no Admin

**Causa:** URL do admin não está em `CORS_ORIGIN`

**Solução:**
1. Vá em Variables
2. Atualize `CORS_ORIGIN` e `ALLOWED_ORIGINS`
3. Adicione a URL do seu admin da Vercel
4. Formato: `https://seu-admin.vercel.app`

### ❌ "Cannot GET /"

**Causa:** Normal! O backend é API-only

**Solução:** Acesse `/api/v1/health` ao invés de `/`

---

## 💰 Custos e Limites

### Plano Gratuito (Hobby)
- ✅ **$5 em créditos grátis** por mês
- ✅ 512MB RAM
- ✅ 1GB Storage
- ✅ Shared CPU
- ✅ **Suficiente para começar!**

### Uso Estimado
Para o NeuroGame com poucos usuários:
- **~$3-5/mês** (dentro do free tier)
- Se ultrapassar, upgrade para **$5/mês** (Developer)

### Ver Uso Atual
1. Dashboard → Settings → Usage
2. Veja quanto já gastou dos $5

---

## 🔐 Segurança

### Boas Práticas

✅ **SIM:**
- Use variáveis de ambiente no Railway
- Gere chaves JWT fortes (256 bits)
- Use HTTPS (Railway faz automaticamente)
- Configure CORS corretamente

❌ **NÃO:**
- Não commite arquivo `.env` com valores reais
- Não exponha `SUPABASE_SERVICE_KEY` publicamente
- Não use senhas fracas para JWT

### Backups

O Supabase já faz backup automático do banco.

Para o código:
- ✅ GitHub (já é seu backup)
- ✅ Railway mantém histórico de deploys

---

## 📋 Checklist Pós-Deploy

Após deploy bem-sucedido:

- [ ] Backend está online (status "Active")
- [ ] URL pública gerada
- [ ] `/api/v1/health` responde OK
- [ ] Login funciona (teste com curl)
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado com URL do admin
- [ ] URL copiada para usar no Admin (Vercel)

---

## 🔗 Conectar com Admin Panel

Após backend deployado, **atualize o Admin Panel:**

1. **Vá no dashboard da Vercel** (seu admin)
2. **Settings → Environment Variables**
3. **Edite `VITE_API_URL`:**
   - De: `http://localhost:3000/api/v1`
   - Para: `https://neurogame-backend.up.railway.app/api/v1`
4. **Redeploy o admin** na Vercel
5. **Teste** o login no admin!

---

## 🚀 Próximos Passos

1. ✅ **Backend deployado no Railway**
2. ✅ **URL pública disponível**
3. ✅ **Atualizar Admin Panel** com nova URL
4. ✅ **Testar fluxo completo** (admin → backend → supabase)
5. ✅ **Atualizar launcher** com URL de produção
6. ✅ **Distribuir instalador** para usuários

---

## 📞 Suporte

**Railway:**
- Documentação: https://docs.railway.app
- Status: https://railway.statuspage.io
- Discord: https://discord.gg/railway

**Problemas com o projeto:**
- Verifique logs no Railway dashboard
- Teste variáveis de ambiente
- Verifique se Supabase está online

---

## 🎉 Parabéns!

Se você chegou até aqui, seu backend está **em produção** e acessível pela internet!

**URLs importantes para salvar:**

| Serviço | URL |
|---------|-----|
| **Backend API** | https://neurogame-backend.up.railway.app |
| **Health Check** | https://neurogame-backend.up.railway.app/api/v1/health |
| **Railway Dashboard** | https://railway.app/project/seu-projeto |
| **Supabase Dashboard** | https://app.supabase.com/project/seu-projeto |

---

**Desenvolvido com NeuroGame Platform v1.0.0**
**Backend em produção no Railway! 🚀**
