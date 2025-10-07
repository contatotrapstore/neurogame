# 🌐 IPs do Render - NeuroGame Backend

**Data:** 06/10/2025
**Propósito:** Whitelist de IPs para acesso ao Supabase e serviços externos

---

## 📍 IPs do Backend no Render

Estes são os IPs de saída (outbound) do servidor Render onde o backend está hospedado:

```
100.20.92.101
44.225.181.72
44.227.217.144
74.220.48.0/24
74.220.56.0/24
```

### **Formato Detalhado:**

| IP/Range | Tipo | Observação |
|----------|------|------------|
| 100.20.92.101 | IP único | |
| 44.225.181.72 | IP único | |
| 44.227.217.144 | IP único | |
| 74.220.48.0/24 | Range (256 IPs) | 74.220.48.0 - 74.220.48.255 |
| 74.220.56.0/24 | Range (256 IPs) | 74.220.56.0 - 74.220.56.255 |

---

## 🔧 Quando Usar Esses IPs

### **1. Supabase - Firewall/Whitelist**

Se o Supabase estiver com restrição de IP, adicione esses IPs para permitir conexão do backend.

**Onde configurar:**
1. Acesse: https://supabase.com/dashboard
2. Projeto: `btsarxzpiroprpdcrpcx`
3. Settings → Database → Network Restrictions
4. Adicionar os 5 IPs/ranges acima

### **2. APIs Externas (Asaas, etc)**

Se APIs de terceiros exigirem whitelist de IPs:

**Asaas:**
- Não exige whitelist por padrão
- Autenticação via API key

**Stripe:**
- Não exige whitelist por padrão
- Autenticação via API key

**Outros serviços:**
- Verificar documentação específica

### **3. Firewall Personalizado**

Se você tiver firewall próprio ou serviço de CDN:
- Adicione esses IPs como permitidos
- Evita bloqueios de requisições legítimas

---

## ⚙️ Configuração no Supabase

### **Verificar se Precisa Whitelist**

Por padrão, o Supabase **NÃO requer** whitelist de IPs. Ele permite conexões de qualquer lugar com as credenciais corretas.

**Verificar configuração atual:**
1. Vá em: https://supabase.com/dashboard/project/btsarxzpiroprpdcrpcx/settings/database
2. Seção "Network Restrictions"
3. Verifique se está:
   - ✅ **"Allow all IP addresses"** → Não precisa configurar
   - ⚠️ **"Restrict to specific IPs"** → Adicione os IPs do Render

### **Como Adicionar IPs (Se Necessário)**

**Via Dashboard:**
1. Settings → Database → Network Restrictions
2. Clique em "Add IP address"
3. Adicione cada IP/range:
   ```
   100.20.92.101/32
   44.225.181.72/32
   44.227.217.144/32
   74.220.48.0/24
   74.220.56.0/24
   ```
4. Salvar

**Via SQL (Alternativa):**
```sql
-- Não aplicável - configuração via dashboard apenas
```

---

## 🔍 Verificar Conexão do Render

### **Teste de Conectividade**

Para verificar se o backend está conectando corretamente:

```bash
# 1. Health check
curl https://neurogame.onrender.com/api/v1/health

# 2. Verificar logs do Render
# Dashboard → neurogame → Logs
# Procurar por:
# ✅ "Supabase connection established successfully"
# ❌ "Failed to connect to Supabase"
```

### **Logs de Conexão**

**Sucesso:**
```
Supabase connection established successfully
Server running on http://0.0.0.0:3000
```

**Falha (se IP bloqueado):**
```
Failed to connect to Supabase: Error: connect ETIMEDOUT
Connection refused from IP: 100.20.92.101
```

---

## 🚨 Troubleshooting

### **Problema: Backend não conecta no Supabase**

**Sintomas:**
- Health check retorna erro 500
- Logs mostram "Failed to connect to Supabase"
- Timeout em conexões

**Possíveis causas:**
1. ✅ **IP bloqueado** - Supabase tem whitelist ativa
2. ✅ **Credenciais erradas** - Verificar .env
3. ✅ **Firewall externo** - ISP ou CDN bloqueando

**Solução:**
1. Verificar se Supabase permite o IP
2. Adicionar IPs do Render no whitelist
3. Verificar logs do Render para erro específico

### **Problema: Algumas requisições funcionam, outras não**

**Causa provável:**
- Render tem múltiplos IPs
- Apenas alguns estão no whitelist

**Solução:**
- Adicionar TODOS os IPs/ranges listados acima
- Incluir os ranges /24 completos

---

## 📝 Formato de Whitelist por Plataforma

### **Supabase**
```
100.20.92.101/32
44.225.181.72/32
44.227.217.144/32
74.220.48.0/24
74.220.56.0/24
```

### **AWS Security Group**
```
100.20.92.101/32
44.225.181.72/32
44.227.217.144/32
74.220.48.0/24
74.220.56.0/24
```

### **iptables**
```bash
iptables -A INPUT -s 100.20.92.101 -j ACCEPT
iptables -A INPUT -s 44.225.181.72 -j ACCEPT
iptables -A INPUT -s 44.227.217.144 -j ACCEPT
iptables -A INPUT -s 74.220.48.0/24 -j ACCEPT
iptables -A INPUT -s 74.220.56.0/24 -j ACCEPT
```

### **Cloudflare**
```
100.20.92.101/32
44.225.181.72/32
44.227.217.144/32
74.220.48.0/24
74.220.56.0/24
```

---

## 🔐 Segurança

### **Boas Práticas**

1. ✅ **Use whitelist + API keys** - Dupla camada de segurança
2. ✅ **Monitore logs** - Detecte acessos não autorizados
3. ✅ **Atualize IPs** - Render pode mudar IPs raramente
4. ✅ **Rate limiting** - Limite requisições por IP

### **O Que NÃO Fazer**

- ❌ Não abra 0.0.0.0/0 (todos os IPs) em produção
- ❌ Não confie apenas em IP (use API keys também)
- ❌ Não esqueça de adicionar os ranges /24
- ❌ Não bloqueie IPs do Vercel (admin panel)

---

## 📊 Status Atual

| Item | Status |
|------|--------|
| IPs documentados | ✅ Sim |
| Supabase whitelist | ⚠️ Verificar se necessário |
| Backend conectando | ✅ Sim (sem whitelist ativo) |
| Logs sem erros | ✅ Sim |

---

## 🔄 Atualizações Futuras

### **Se Render Mudar IPs:**

1. Render notifica por email (se configurado)
2. Atualizar este documento
3. Atualizar whitelist no Supabase
4. Testar conexão

### **Monitoramento:**

Configure alertas para:
- Falhas de conexão Supabase
- Erros 500 no health check
- Timeouts em requisições

---

## 📚 Referências

- **Render Docs:** https://render.com/docs/static-outbound-ip-addresses
- **Supabase Network:** https://supabase.com/docs/guides/platform/network-restrictions
- **IPs do Vercel (Admin):** Ver ADMIN_PRONTO_VERCEL.md

---

## ✅ Conclusão

IPs do Render documentados e prontos para uso em whitelist.

**Atualmente NÃO é necessário** configurar whitelist no Supabase, pois ele permite todas as conexões com credenciais válidas.

**Use esses IPs se:**
- Supabase ativar restrição de rede
- APIs externas exigirem whitelist
- Firewall personalizado for configurado

---

**Última atualização:** 06/10/2025
**Status:** ✅ Documentado
**Backend:** https://neurogame.onrender.com
