# ✅ BACKEND - PRONTO PARA RENDER!

## 🎉 Preparação Completa!

O **Backend API** está 100% configurado e pronto para deploy no Render.

---

## 📦 Arquivos Criados

```
neurogame-backend/
├── render.yaml ✅                 (Configuração Render)
├── .renderignore ✅               (Arquivos ignorados)
├── .env.example ✅                (Template atualizado)
├── DEPLOY_RENDER.md ✅            (Guia completo - 15KB)
└── README_DEPLOY.md ✅            (Resumo rápido - 4KB)
```

---

## 🚀 COMO FAZER DEPLOY (5 Passos)

### Passo 1: Criar Conta Render
→ https://render.com
→ "Sign Up with GitHub"
→ **Plano Free** automático (sem cartão!)

### Passo 2: Novo Web Service
- Dashboard → "New +" → "Web Service"
- Conecte repositório `neurogame-platform`
- **Root Directory:** `neurogame-backend` ⚠️ IMPORTANTE!
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** **Free**

### Passo 3: Configurar Variáveis

**Obtenha credenciais Supabase:**
1. https://app.supabase.com → Seu projeto
2. Settings → API
3. Copie: URL, anon key, service_role key

**Gere chaves JWT:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Execute 2x para JWT_SECRET e JWT_REFRESH_SECRET

**Adicione no Render (seção Environment):**
```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_KEY=sua_chave_service_role
JWT_SECRET=chave-gerada-256-bits
JWT_REFRESH_SECRET=outra-chave-256-bits
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
ASAAS_API_KEY=sua_chave_asaas
ASAAS_WEBHOOK_SECRET=seu_webhook
ASAAS_ENVIRONMENT=sandbox
SUBSCRIPTION_VALUE=149.90
SUBSCRIPTION_CURRENCY=BRL
MAX_DEVICES_PER_USER=3
HEARTBEAT_INTERVAL_HOURS=12
OFFLINE_GRACE_PERIOD_HOURS=48
CORS_ORIGIN=https://seu-admin.vercel.app
ALLOWED_ORIGINS=https://seu-admin.vercel.app
LOG_LEVEL=info
```

### Passo 4: Deploy
- Clique em "Create Web Service"
- Aguarde 3-5 minutos
- Veja logs em tempo real

### Passo 5: URL e Teste
- Render gera: `https://neurogame-backend.onrender.com`
- Teste:
```bash
curl https://neurogame-backend.onrender.com/api/v1/health
```

✅ Se retornar `{"status":"ok"}` → **FUNCIONANDO!**

---

## 🧪 Testar Backend

```bash
# Health check
curl https://neurogame-backend.onrender.com/api/v1/health

# Login
curl -X POST https://neurogame-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'
```

✅ Se retornar token JWT → **PERFEITO!**

---

## 📖 Documentação Completa

Para guia detalhado:

👉 **LEIA:** [neurogame-backend/DEPLOY_RENDER.md](neurogame-backend/DEPLOY_RENDER.md)

Inclui:
- Screenshots do processo
- Como obter todas as credenciais
- Troubleshooting completo
- Configuração de domínio customizado
- Monitoramento e logs

---

## 🔧 Variáveis Essenciais

### Supabase (OBRIGATÓRIO)
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG...
```

**Onde:** Supabase Dashboard → Settings → API

### JWT (OBRIGATÓRIO)
```env
JWT_SECRET=chave-forte-256-bits
JWT_REFRESH_SECRET=outra-chave-forte-256-bits
```

**Como gerar:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### CORS (OBRIGATÓRIO)
```env
CORS_ORIGIN=https://seu-admin.vercel.app
ALLOWED_ORIGINS=https://seu-admin.vercel.app
```

**Quando:** Após deploy do admin na Vercel

---

## 💰 Custos Render

**Free Tier:**
- ✅ **$0/mês** (sem cartão)
- ✅ 750 horas/mês (24/7 para 1 serviço)
- ✅ 512MB RAM
- ✅ 100GB bandwidth/mês
- ✅ HTTPS/SSL grátis

**Limitação:**
- ⚠️ "Hiberna" após 15 min sem uso
- Primeira requisição demora ~30-60s

**Starter Plan ($7/mês):**
- ✅ Sem hibernação
- ✅ Melhor performance
- ✅ Recomendado para produção

---

## 🔄 Deploy Automático

Após configurar:

```bash
git add .
git commit -m "feat: melhoria"
git push

# Render detecta e faz deploy automaticamente!
```

---

## 🔗 Conectar com Admin

Após backend deployado:

1. **Copie URL:** `https://neurogame-backend.onrender.com`
2. **Vercel Dashboard** (admin) → Settings → Environment Variables
3. **Edite `VITE_API_URL`:**
   ```
   https://neurogame-backend.onrender.com/api/v1
   ```
4. **Redeploy** admin
5. **Teste** login!

---

## ⚠️ IMPORTANTE: CORS

**NÃO ESQUEÇA!** Após deploy do admin:

1. Copie URL do admin: `https://seu-admin.vercel.app`
2. No Render → Environment
3. Edite:
   ```env
   CORS_ORIGIN=https://seu-admin.vercel.app
   ALLOWED_ORIGINS=https://seu-admin.vercel.app
   ```
4. Save → Render faz redeploy automático

**Sem isso = erro CORS!**

---

## 📋 Checklist Completo

### Preparação
- [x] Arquivos de config criados ✅
- [x] .env.example atualizado ✅
- [x] Documentação completa ✅
- [ ] Código no GitHub
- [ ] Conta Render criada
- [ ] Conta Supabase criada

### Deploy
- [ ] Web Service criado
- [ ] Root Directory: `neurogame-backend`
- [ ] Todas variáveis configuradas
- [ ] Deploy bem-sucedido
- [ ] Health check OK
- [ ] Login testado

### Pós-Deploy
- [ ] URL copiada
- [ ] Admin atualizado
- [ ] CORS configurado
- [ ] Endpoints testados
- [ ] Logs verificados

---

## 🎯 Resultado Final

```
✅ Backend: https://neurogame-backend.onrender.com
✅ Health: https://neurogame-backend.onrender.com/api/v1/health
✅ HTTPS automático
✅ Deploy automático
✅ Logs em tempo real
✅ $0/mês (Free)
✅ Pronto para admin conectar!
```

---

## 🚦 Ordem de Deploy

```
1º → BACKEND (Render) ← Você está aqui!
     ↓
2º → ADMIN (Vercel) ← Já preparado!
     ↓
3º → LAUNCHER (Distribuir instalador)
```

---

## 🐛 Problemas Comuns

### "Build failed"
→ Verifique Root Directory: `neurogame-backend`
→ Veja logs de build

### "Cannot connect to Supabase"
→ Verifique variáveis SUPABASE_*
→ Teste credenciais no Supabase

### "CORS error"
→ Adicione URL do admin em CORS_ORIGIN
→ Salve e aguarde redeploy

### "Service Unavailable (503)"
→ Normal no plano Free (hibernação)
→ Aguarde 30-60s na primeira requisição
→ Upgrade para $7/mês para evitar

---

## 📞 Links Úteis

| Serviço | Link |
|---------|------|
| **Render** | https://render.com |
| **Supabase** | https://supabase.com |
| **Docs Render** | https://render.com/docs |
| **Guia Completo** | neurogame-backend/DEPLOY_RENDER.md |

---

## 🎉 Está Tudo Pronto!

O backend está **100% preparado** para deploy no Render.

**Próximo passo:**
1. Leia: `neurogame-backend/DEPLOY_RENDER.md`
2. Siga os 5 passos acima
3. Deploy em 15-20 minutos!

---

**Desenvolvido com NeuroGame Platform v1.0.0**
**Backend pronto para produção no Render! 🚀**
