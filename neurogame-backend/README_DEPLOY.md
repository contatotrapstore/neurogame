# ✅ Backend - Pronto para Deploy no Railway

## 🎯 Status: PRONTO PARA DEPLOY! ✅

Todos os arquivos necessários foram criados e configurados.

---

## 📦 Arquivos Criados

- ✅ **railway.json** - Configuração do Railway
- ✅ **.railwayignore** - Arquivos ignorados no deploy
- ✅ **Procfile** - Comando de inicialização
- ✅ **.env.example** - Template de variáveis (atualizado)
- ✅ **DEPLOY_RAILWAY.md** - Guia completo passo a passo
- ✅ **README_DEPLOY.md** - Este arquivo (resumo)

---

## ⚡ Deploy Rápido (5 Passos)

### 1️⃣ Criar conta Railway
- Acesse: https://railway.app
- Login com GitHub
- Ganhe $5 grátis/mês

### 2️⃣ Novo Projeto
- "New Project" → "Deploy from GitHub repo"
- Selecione repositório `neurogame-platform`
- **Root Directory:** `neurogame-backend` ⚠️

### 3️⃣ Configurar Variáveis
Adicione no Railway (aba "Variables"):

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_KEY=sua_chave_service
JWT_SECRET=chave-forte-256-bits
JWT_REFRESH_SECRET=outra-chave-forte
ASAAS_API_KEY=sua_chave_asaas
ASAAS_WEBHOOK_SECRET=seu_webhook
ASAAS_ENVIRONMENT=sandbox
CORS_ORIGIN=https://seu-admin.vercel.app
```

**💡 Gerar chaves JWT:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ Deploy Automático
- Railway faz deploy automaticamente
- Aguarde 2-4 minutos

### 5️⃣ Gerar Domínio
- Settings → Networking → "Generate Domain"
- Copie a URL: `neurogame-backend.up.railway.app`

---

## 🧪 Testar

```bash
# Health check
curl https://neurogame-backend.up.railway.app/api/v1/health

# Login
curl -X POST https://neurogame-backend.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'
```

✅ Se retornar dados, está funcionando!

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

**Railway Free Tier:**
- ✅ **$5 grátis/mês** (sem cartão)
- ✅ Suficiente para 100-500 usuários
- ✅ Upgrade: $5/mês (Developer)

---

## 📖 Documentação Completa

Para guia detalhado com screenshots e troubleshooting:

👉 **Leia:** `DEPLOY_RAILWAY.md`

---

## 🚦 Checklist Pré-Deploy

- [x] Arquivos de config criados ✅
- [x] package.json com scripts corretos ✅
- [x] .env.example atualizado ✅
- [ ] Conta Railway criada
- [ ] Conta Supabase criada
- [ ] Credenciais Supabase obtidas
- [ ] Chaves JWT geradas
- [ ] Código no GitHub

---

## 🔗 Próximos Passos

Após backend deployado:

1. ✅ Copiar URL gerada pelo Railway
2. ✅ Atualizar `VITE_API_URL` no admin (Vercel)
3. ✅ Redeploy do admin
4. ✅ Testar login no admin
5. ✅ Atualizar launcher com URL de produção

---

## 🎯 Resultado Final

Após deploy bem-sucedido:

```
✅ Backend online: https://neurogame-backend.up.railway.app
✅ API funcionando: /api/v1/health
✅ HTTPS automático
✅ Deploy automático a cada push
✅ Logs em tempo real
✅ Pronto para receber requisições do admin!
```

---

**NeuroGame Backend v1.0.0**
**Pronto para produção! 🚀**
