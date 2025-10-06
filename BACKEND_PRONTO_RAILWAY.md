# ✅ BACKEND - PRONTO PARA RAILWAY!

## 🎉 Preparação Completa!

O **Backend API** está 100% configurado e pronto para deploy no Railway.

---

## 📦 Arquivos Criados

```
neurogame-backend/
├── railway.json ✅                (Configuração Railway)
├── .railwayignore ✅              (Arquivos ignorados)
├── Procfile ✅                    (Comando de start)
├── .env.example ✅                (Template atualizado)
├── DEPLOY_RAILWAY.md ✅           (Guia completo)
└── README_DEPLOY.md ✅            (Resumo rápido)
```

---

## 🚀 COMO FAZER DEPLOY (5 Passos)

### Passo 1: Criar Conta Railway
→ https://railway.app
→ Login com GitHub
→ $5 grátis/mês sem cartão!

### Passo 2: Novo Projeto
- Dashboard → "New Project"
- "Deploy from GitHub repo"
- Selecione `neurogame-platform`
- **Root Directory:** `neurogame-backend` ⚠️

### Passo 3: Configurar Variáveis

**Obtenha credenciais Supabase:**
1. https://app.supabase.com → Seu projeto
2. Settings → API
3. Copie: URL, anon key, service_role key

**Gere chaves JWT:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Execute 2x para gerar JWT_SECRET e JWT_REFRESH_SECRET

**Adicione no Railway (aba Variables):**
```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_KEY=sua_chave_service_role
JWT_SECRET=chave-gerada-256-bits
JWT_REFRESH_SECRET=outra-chave-gerada-256-bits
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
ASAAS_API_KEY=sua_chave_asaas
ASAAS_WEBHOOK_SECRET=seu_webhook_secret
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

### Passo 4: Deploy Automático
- Railway detecta e inicia deploy
- Aguarde 2-4 minutos
- Veja logs em tempo real

### Passo 5: Gerar Domínio
- Settings → Networking
- "Generate Domain"
- Copie: `neurogame-backend.up.railway.app`

---

## 🧪 Testar Backend

```bash
# Health check
curl https://neurogame-backend.up.railway.app/api/v1/health

# Deve retornar:
{
  "status": "ok",
  "timestamp": "...",
  "environment": "production"
}

# Testar login
curl -X POST https://neurogame-backend.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'
```

✅ Se retornar token JWT, está perfeito!

---

## 📖 Documentação Completa

Para guia detalhado:

👉 **Leia:** `neurogame-backend/DEPLOY_RAILWAY.md`

---

## 🔧 Variáveis Essenciais

### Supabase (OBRIGATÓRIO)
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG...
```

**Onde obter:**
- Supabase Dashboard → Settings → API

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
```

**Quando configurar:**
- Após fazer deploy do admin na Vercel
- Use a URL gerada pela Vercel

### Asaas (Opcional para testes)
```env
ASAAS_API_KEY=sua_chave
ASAAS_ENVIRONMENT=sandbox
```

**Quando configurar:**
- Necessário para sistema de pagamentos
- Use `sandbox` para testes
- Obtenha em: https://asaas.com

---

## 💰 Custos Railway

**Hobby Plan (Grátis):**
- ✅ $5 em créditos/mês
- ✅ 512MB RAM
- ✅ 1GB Storage
- ✅ Shared CPU

**Uso Estimado:**
- Backend simples: ~$2-4/mês
- **Fica dentro do free tier!**

**Se precisar mais:**
- Developer Plan: $5/mês
- 8GB RAM, 100GB Storage

---

## 🔄 Deploy Automático

Após configurar, toda alteração no código:

```bash
git add .
git commit -m "feat: alguma melhoria"
git push

# Railway detecta e faz deploy automaticamente!
```

---

## 🔗 Conectar com Admin

Após backend deployado:

1. **Copie a URL:** `https://neurogame-backend.up.railway.app`
2. **Vá no Vercel** (dashboard do admin)
3. **Settings → Environment Variables**
4. **Edite `VITE_API_URL`:**
   ```
   https://neurogame-backend.up.railway.app/api/v1
   ```
5. **Redeploy** o admin na Vercel
6. **Teste** login no admin!

---

## ⚠️ IMPORTANTE: CORS

**NÃO ESQUEÇA!** Após deploy do admin na Vercel:

1. Copie a URL do admin: `https://seu-admin.vercel.app`
2. Adicione no Railway (Variables):
   ```env
   CORS_ORIGIN=https://seu-admin.vercel.app
   ALLOWED_ORIGINS=https://seu-admin.vercel.app
   ```
3. Railway faz redeploy automático

**Sem isso, você terá erro "CORS"!**

---

## 📋 Checklist Completo

### Preparação
- [x] Arquivos de config criados ✅
- [x] .env.example atualizado ✅
- [x] Documentação completa ✅
- [ ] Código no GitHub
- [ ] Conta Railway criada
- [ ] Conta Supabase criada

### Deploy
- [ ] Projeto criado no Railway
- [ ] Root Directory configurado (`neurogame-backend`)
- [ ] Todas variáveis adicionadas
- [ ] Deploy bem-sucedido
- [ ] Domínio gerado
- [ ] Health check funcionando

### Pós-Deploy
- [ ] URL copiada
- [ ] Admin atualizado com URL
- [ ] CORS configurado
- [ ] Login testado
- [ ] Endpoints testados

---

## 🎯 Resultado Final

Após deploy completo:

```
✅ Backend: https://neurogame-backend.up.railway.app
✅ Health: https://neurogame-backend.up.railway.app/api/v1/health
✅ HTTPS automático
✅ Deploy automático
✅ Logs em tempo real
✅ $5 grátis/mês
✅ Pronto para admin conectar!
```

---

## 🚦 Ordem Recomendada de Deploy

```
1º → BACKEND (Railway) ← Você está aqui!
     ↓
2º → ADMIN (Vercel)
     ↓
3º → LAUNCHER (Distribuir instalador)
```

---

## 🐛 Problemas Comuns

### "Module not found"
→ Verifique Root Directory: `neurogame-backend`

### "Cannot connect to Supabase"
→ Verifique variáveis SUPABASE_*

### "CORS error"
→ Adicione URL do admin em CORS_ORIGIN

### Logs não aparecem
→ Vá em Deployments → Clique no deploy → View Logs

---

## 📞 Links Úteis

| Serviço | Link |
|---------|------|
| Railway | https://railway.app |
| Supabase | https://supabase.com |
| Documentação Railway | https://docs.railway.app |
| Guia Completo | neurogame-backend/DEPLOY_RAILWAY.md |

---

## 🎉 Está Tudo Pronto!

O backend está **100% preparado** para deploy no Railway.

**Próximo passo:**
1. Leia o guia completo: `neurogame-backend/DEPLOY_RAILWAY.md`
2. Siga os 5 passos acima
3. Deploy em 15-20 minutos!

---

**Desenvolvido com NeuroGame Platform v1.0.0**
**Backend pronto para produção! 🚀**
