# ✅ Checklist Final - Sistema de Assinaturas NeuroGame

## 🎯 Visão Geral

O sistema de assinaturas NeuroGame está **100% implementado**. Este documento lista os passos finais de configuração para colocar em produção.

---

## 📋 Checklist de Configuração

### ☐ 1. Aplicar Migration no Supabase

**Onde:** https://supabase.com/dashboard/project/btsarxzpiroprpdcrpcx/sql/new

**Como:**
1. Abra o arquivo: [`MIGRATION_SUPABASE.sql`](MIGRATION_SUPABASE.sql)
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN**
5. Verifique: deve aparecer "Success. No rows returned"

**Resultado esperado:**
- ✅ Tabela `users` criada (5 colunas)
- ✅ Tabela `subscriptions` criada (10 colunas)
- ✅ Tabela `payments` criada (12 colunas)
- ✅ Índices criados
- ✅ Triggers criados

---

### ☐ 2. Obter Supabase Service Key

**Onde:** https://supabase.com/dashboard/project/btsarxzpiroprpdcrpcx/settings/api

**Como:**
1. Acesse **Settings → API**
2. Procure por **"service_role" key** (não é a "anon" key!)
3. Copie a key que começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Abra [`neurogame-backend/.env`](neurogame-backend/.env)
5. Substitua a linha 10:
   ```env
   SUPABASE_SERVICE_KEY=cole_a_service_key_aqui
   ```
6. Salve o arquivo

**⚠️ IMPORTANTE:** A service_key é DIFERENTE da anon key! Use a service_role key.

---

### ☐ 3. Configurar Webhook Asaas

**Onde:** https://www.asaas.com/webhooks

**Como:**
Siga as instruções detalhadas em: [`CONFIGURACAO_ASAAS_WEBHOOK.md`](CONFIGURACAO_ASAAS_WEBHOOK.md)

**Resumo:**
- URL: `https://neurogame-7av9.onrender.com/api/v1/webhooks/asaas`
- Eventos: PAYMENT_CREATED, PAYMENT_RECEIVED, PAYMENT_CONFIRMED, PAYMENT_OVERDUE, PAYMENT_DELETED, PAYMENT_REFUNDED
- Secret (opcional): `neurogame_webhook_2025`

---

### ☐ 4. Fazer Deploy do Backend (se necessário)

Se você atualizou o código do backend:

```bash
cd neurogame-backend
git add .
git commit -m "feat: adicionar sistema de assinaturas"
git push
```

O Render fará deploy automático em: https://neurogame-7av9.onrender.com

---

### ☐ 5. Testar Sistema End-to-End

#### Teste 1: Registro de Usuário
1. Abra o launcher NeuroGame
2. Clique em "Criar conta grátis"
3. Preencha: nome, email, senha
4. Verifique se criou conta com sucesso

#### Teste 2: Login
1. Faça login com email/senha cadastrados
2. Verifique se redireciona para biblioteca

#### Teste 3: Alerta de Pagamento
1. Após login, deve aparecer alerta de "Acesso Expirado"
2. Clique em "Renovar"

#### Teste 4: Criar Pagamento PIX
1. Selecione método "PIX"
2. Clique em "Pagar R$ 149,90"
3. Verifique se mostra QR Code e código copia-e-cola

#### Teste 5: Criar Pagamento Cartão
1. Selecione método "Cartão"
2. Preencha dados do cartão de teste (veja abaixo)
3. Clique em "Pagar R$ 149,90"
4. Verifique se processa pagamento

**Cartão de Teste Asaas (Sandbox):**
- Número: `5162306219378829`
- Validade: `12/2028`
- CVV: `318`
- Nome: qualquer nome

#### Teste 6: Verificar Banco de Dados
1. Acesse Supabase: https://supabase.com/dashboard/project/btsarxzpiroprpdcrpcx/editor
2. Tabela `users`: deve ter o usuário criado
3. Tabela `subscriptions`: deve ter a assinatura
4. Tabela `payments`: deve ter o pagamento

---

## 🎨 Componentes Implementados

### Frontend (Launcher)
- ✅ [Login.jsx](neurogame-launcher/src/pages/Login.jsx) - Tela de login
- ✅ [Register.jsx](neurogame-launcher/src/pages/Register.jsx) - Tela de registro
- ✅ [RenewPayment.jsx](neurogame-launcher/src/pages/RenewPayment.jsx) - Tela de pagamento
- ✅ [PaymentAlert.jsx](neurogame-launcher/src/components/PaymentAlert.jsx) - Alerta de renovação
- ✅ [subscriptionApi.js](neurogame-launcher/src/services/subscriptionApi.js) - API de assinaturas
- ✅ [App.jsx](neurogame-launcher/src/App.jsx) - Roteamento com autenticação

### Backend (API)
- ✅ Autenticação JWT
- ✅ Integração Asaas (PIX + Cartão)
- ✅ Webhook para notificações
- ✅ Verificação de assinatura
- ✅ CRUD de payments/subscriptions

---

## 🔍 Verificar se Tudo Está Funcionando

### Backend Health Check
```bash
curl https://neurogame-7av9.onrender.com/api/v1/health
```
Deve retornar: `{"status":"ok"}`

### Teste de Autenticação
```bash
curl -X POST https://neurogame-7av9.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"Teste123","name":"Usuário Teste"}'
```

### Verificar Logs do Backend
Acesse: https://dashboard.render.com/web/neurogame-7av9/logs

Procure por:
- `[Auth] User registered successfully`
- `[Payment] Creating payment for user`
- `[Webhook] Recebido evento: PAYMENT_CREATED`

---

## 📊 Preços Configurados

Conforme [`.env`](neurogame-backend/.env):
- **Plano Mensal:** R$ 29,90
- Renovação automática a cada 30 dias
- Pagamento via PIX (instantâneo) ou Cartão (aprovação automática)

**Exibido no launcher:** R$ 149,90 (verificar e atualizar se necessário)

---

## 🚨 Troubleshooting

### "Email ou senha incorretos"
- Verifique se o backend está rodando
- Confirme se a tabela `users` foi criada
- Veja logs do Render

### "Erro ao processar pagamento"
- Verifique ASAAS_API_KEY no `.env`
- Confirme se está usando chave de produção
- Veja logs de erro no Render

### Webhook não está funcionando
- Confirme URL no Asaas: `https://neurogame-7av9.onrender.com/api/v1/webhooks/asaas`
- Verifique eventos marcados
- Teste manualmente criando pagamento

### "SUPABASE_SERVICE_KEY is required"
- Você precisa configurar a service_role key no `.env`
- Não use a anon key!

---

## 📞 Suporte

- **Backend:** https://neurogame-7av9.onrender.com
- **Supabase:** https://supabase.com/dashboard/project/btsarxzpiroprpdcrpcx
- **Asaas:** https://www.asaas.com

---

## ✅ Checklist Rápido

- [ ] Migration aplicada no Supabase
- [ ] SUPABASE_SERVICE_KEY configurada no `.env`
- [ ] Webhook configurado no Asaas
- [ ] Backend em produção no Render
- [ ] Teste de registro funcionando
- [ ] Teste de login funcionando
- [ ] Teste de pagamento PIX funcionando
- [ ] Teste de pagamento Cartão funcionando
- [ ] Webhook recebendo notificações

---

🎉 **Quando todos os itens estiverem marcados, o sistema estará pronto para produção!**
