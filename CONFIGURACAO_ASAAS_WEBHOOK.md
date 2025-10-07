# 🔔 Configuração do Webhook Asaas - NeuroGame

## 📋 Instruções Passo a Passo

### 1. Acessar Dashboard Asaas

Acesse: **https://www.asaas.com/webhooks**

### 2. Adicionar Novo Webhook

Clique em **"Adicionar Webhook"** ou **"Novo Webhook"**

### 3. Configurar URL do Webhook

**URL do Webhook:**
```
https://neurogame-7av9.onrender.com/api/v1/webhooks/asaas
```

### 4. Selecionar Eventos

Marque os seguintes eventos:

✅ **PAYMENT_CREATED** - Quando um pagamento é criado
✅ **PAYMENT_RECEIVED** - Quando o pagamento é recebido (PIX)
✅ **PAYMENT_CONFIRMED** - Quando o pagamento é confirmado (Cartão)
✅ **PAYMENT_OVERDUE** - Quando o pagamento está vencido
✅ **PAYMENT_DELETED** - Quando o pagamento é deletado
✅ **PAYMENT_REFUNDED** - Quando o pagamento é reembolsado

### 5. Configurar Segurança (Opcional mas Recomendado)

Se o Asaas oferecer um campo de **Secret/Token**, use:
```
neurogame_webhook_2025
```

Este valor já está configurado no backend em `.env`:
```
ASAAS_WEBHOOK_SECRET=neurogame_webhook_2025
```

### 6. Salvar Configuração

Clique em **"Salvar"** ou **"Criar Webhook"**

---

## ✅ Verificar se o Webhook Está Funcionando

### Teste Manual via Logs

1. Crie um pagamento de teste no sistema NeuroGame
2. Monitore os logs do backend em: https://dashboard.render.com/web/neurogame-7av9
3. Procure por mensagens como:
   ```
   [Webhook] Recebido evento: PAYMENT_CREATED
   [Webhook] Pagamento processado com sucesso
   ```

### Teste no Dashboard Asaas

1. Acesse **Webhooks** no Asaas
2. Veja o histórico de chamadas
3. Verifique se há erros (status 4xx ou 5xx)
4. Status 200 = sucesso ✅

---

## 🔍 Troubleshooting

### Webhook retornando erro 401/403
- Verifique se o `ASAAS_WEBHOOK_SECRET` está correto no `.env`
- Certifique-se de que o backend está validando o secret corretamente

### Webhook retornando erro 500
- Verifique os logs do backend no Render
- Confirme se as tabelas `payments` e `subscriptions` foram criadas no Supabase

### Webhook não está sendo chamado
- Confirme se a URL está acessível publicamente
- Teste com: `curl https://neurogame-7av9.onrender.com/api/v1/health`
- Verifique se os eventos estão marcados corretamente

---

## 📝 Informações de Referência

**Backend URL:** https://neurogame-7av9.onrender.com
**Webhook Endpoint:** `/api/v1/webhooks/asaas`
**Ambiente:** Produção
**API Key:** Configurada no `.env` (ASAAS_API_KEY)

---

✅ **Configuração concluída!** O sistema agora receberá notificações automáticas de pagamentos do Asaas.
