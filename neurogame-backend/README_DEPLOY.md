# ✅ Backend - Pronto para Deploy no Render

## 🎯 Status: PRONTO PARA DEPLOY! ✅

Todos os arquivos necessários foram criados e configurados.

---

## 📦 Arquivos Criados

- ✅ **render.yaml** - Configuração do Render
- ✅ **.renderignore** - Arquivos ignorados no deploy
- ✅ **.env.example** - Template de variáveis (atualizado)
- ✅ **DEPLOY_RENDER.md** - Guia completo passo a passo
- ✅ **README_DEPLOY.md** - Este arquivo (resumo)

---

## ⚡ Deploy Rápido (5 Passos)

### 1️⃣ Criar conta Render
- Acesse: https://render.com
- Login com GitHub
- Plano Free automático (sem cartão!)

### 2️⃣ Novo Web Service
- "New +" → "Web Service"
- Selecione repositório `neurogame-platform`
- **Root Directory:** `neurogame-backend` ⚠️
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 3️⃣ Configurar Variáveis
Adicione no Render (seção "Environment"):

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_KEY=sua_chave_service
JWT_SECRET=chave-forte-256-bits
JWT_REFRESH_SECRET=outra-chave-forte
ASAAS_API_KEY=sua_chave_asaas
ASAAS_WEBHOOK_SECRET=seu_webhook
ASAAS_ENVIRONMENT=sandbox
CORS_ORIGIN=https://seu-admin.vercel.app
ALLOWED_ORIGINS=https://seu-admin.vercel.app
LOG_LEVEL=info
```

**💡 Gerar chaves JWT:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ Deploy
- Selecione plano **"Free"**
- Clique em "Create Web Service"
- Aguarde 3-5 minutos

### 5️⃣ Testar
```bash
curl https://neurogame-backend.onrender.com/api/v1/health
```

✅ Se retornar `{"status":"ok"}` → **FUNCIONANDO!**

---

## 📋 Variáveis Obrigatórias

| Variável | Onde Obter | Obrigatório |
|----------|------------|-------------|
| `SUPABASE_URL` | Supabase → Settings → API | ✅ Sim |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API | ✅ Sim |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API | ✅ Sim |
| `JWT_SECRET` | Gerar com crypto | ✅ Sim |
| `JWT_REFRESH_SECRET` | Gerar com crypto | ✅ Sim |
| `ASAAS_API_KEY` | asaas.com | ⚠️ Para produção |
| `CORS_ORIGIN` | URL do admin Vercel | ✅ Sim |

---

## 🔧 Configuração CORS

**IMPORTANTE:** Adicione a URL do admin após deploy da Vercel:

```env
CORS_ORIGIN=https://seu-admin.vercel.app,https://admin.neurogame.com.br
ALLOWED_ORIGINS=https://seu-admin.vercel.app,https://admin.neurogame.com.br
```

---

## 💰 Custos

**Render Free Tier:**
- ✅ **$0/mês** (sem cartão)
- ✅ 750 horas/mês
- ✅ 512MB RAM
- ✅ 100GB bandwidth
- ✅ SSL grátis

**Limitação:**
- ⚠️ Serviço "hiberna" após 15 min sem uso
- Primeira requisição pode demorar 30-60s

**Upgrade:**
- **$7/mês** (Starter) - sem hibernação

---

## 📖 Documentação Completa

Para guia detalhado com screenshots e troubleshooting:

👉 **Leia:** `DEPLOY_RENDER.md`

---

## 🚦 Checklist Pré-Deploy

- [x] Arquivos de config criados ✅
- [x] package.json com scripts corretos ✅
- [x] .env.example atualizado ✅
- [ ] Conta Render criada
- [ ] Conta Supabase criada
- [ ] Credenciais Supabase obtidas
- [ ] Chaves JWT geradas
- [ ] Código no GitHub

---

## 🔗 Próximos Passos

Após backend deployado:

1. ✅ Copiar URL gerada pelo Render
2. ✅ Atualizar `VITE_API_URL` no admin (Vercel)
3. ✅ Redeploy do admin
4. ✅ Testar login no admin
5. ✅ Atualizar launcher com URL de produção

---

## 🎯 Resultado Final

Após deploy bem-sucedido:

```
✅ Backend online: https://neurogame-backend.onrender.com
✅ API funcionando: /api/v1/health
✅ HTTPS automático
✅ Deploy automático a cada push
✅ Logs em tempo real
✅ Pronto para receber requisições do admin!
```

---

## ⚠️ Importante sobre Hibernação

No plano Free, o Render coloca o serviço em "sleep" após 15 minutos sem requisições.

**Impacto:**
- Primeira requisição demora 30-60s (serviço "acorda")
- Requisições seguintes são normais

**Solução:**
- Para produção com usuários ativos: Upgrade para $7/mês
- Para testes: Plano Free funciona perfeitamente

---

**NeuroGame Backend v1.0.0**
**Pronto para produção no Render! 🚀**
