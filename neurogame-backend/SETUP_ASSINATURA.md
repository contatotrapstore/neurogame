# 🎮 Sistema de Assinatura NeuroGame - GUIA COMPLETO

## ✅ O QUE JÁ ESTÁ PRONTO

### Backend (100% Configurado)
- ✅ API de assinaturas (`/api/v1/subscriptions/*`)
- ✅ Webhook Asaas (`/api/v1/webhooks/asaas`)
- ✅ Serviço Asaas integrado com chave de PRODUÇÃO
- ✅ Controllers e rotas configurados
- ✅ Migrations criadas

### Configurações
- ✅ Asaas API Key: PRODUÇÃO configurada
- ✅ Valor assinatura: R$ 29,90/mês
- ✅ Métodos: PIX, Cartão de Crédito, Boleto

---

## 🚀 PRÓXIMOS PASSOS

### 1. Aplicar Migrations no Supabase

```bash
# Acesse:
https://supabase.com/dashboard/project/YOUR_PROJECT/sql

# Cole o SQL de:
migrations/003_create_subscription_tables.sql

# Execute (RUN)
```

**Isso cria:**
- Tabela `users` (se não existir)
- Tabela `subscriptions`
- Tabela `payments`
- Índices e triggers

---

### 2. Configurar Webhook no Asaas

**URL do Webhook:**
```
https://neurogame.onrender.com/api/v1/webhooks/asaas
```

**Passos:**
1. Acesse: https://www.asaas.com/webhooks
2. Adicionar Webhook
3. URL: `https://neurogame.onrender.com/api/v1/webhooks/asaas`
4. Marque eventos:
   - ✅ PAYMENT_CREATED
   - ✅ PAYMENT_RECEIVED
   - ✅ PAYMENT_CONFIRMED
   - ✅ PAYMENT_OVERDUE
   - ✅ PAYMENT_DELETED
   - ✅ PAYMENT_REFUNDED
5. Salvar

---

### 3. Implementar no Launcher

#### Sistema de Login (React)

**Criar:** `neurogame-launcher/src/pages/Login.jsx`

```jsx
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://neurogame.onrender.com/api/v1';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        email,
        password
      });

      // Salvar token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      onLoginSuccess(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>{isRegister ? 'Criar Conta' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          {isRegister ? 'Criar Conta' : 'Entrar'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        <a onClick={() => setIsRegister(!isRegister)} style={{ cursor: 'pointer' }}>
          {isRegister ? 'Já tem conta? Fazer login' : 'Criar nova conta'}
        </a>
      </p>
    </div>
  );
}
```

#### Verificação de Assinatura

**Criar:** `neurogame-launcher/src/services/subscription.js`

```javascript
import axios from 'axios';

const API_URL = 'https://neurogame.onrender.com/api/v1';

export const subscriptionService = {
  // Verificar se tem assinatura ativa
  async checkSubscription() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/subscriptions/check`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Criar assinatura
  async createSubscription(paymentMethod = 'PIX') {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/subscriptions/create`,
      { paymentMethod },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Cancelar assinatura
  async cancelSubscription() {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_URL}/subscriptions/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
};
```

#### Tela de Assinatura

**Criar:** `neurogame-launcher/src/pages/Subscribe.jsx`

```jsx
import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscription';

export default function Subscribe({ onSubscribed }) {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const result = await subscriptionService.createSubscription('PIX');
      setPixData(result.data.payment.pix);
      alert('QR Code PIX gerado! Pague para ativar sua assinatura.');
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao criar assinatura');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🎮 Assine o NeuroGame</h1>
      <h2>R$ 29,90/mês</h2>
      <p>Acesso completo a todos os jogos!</p>

      {!pixData ? (
        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{ padding: '15px 30px', fontSize: '18px' }}
        >
          {loading ? 'Gerando...' : 'Assinar com PIX'}
        </button>
      ) : (
        <div>
          <h3>Pague com PIX:</h3>
          <img src={pixData.qrCodeImage} alt="QR Code PIX" style={{ maxWidth: '300px' }} />
          <p>Ou copie o código:</p>
          <textarea
            readOnly
            value={pixData.qrCode}
            style={{ width: '100%', height: '100px', fontFamily: 'monospace' }}
          />
          <p><small>Após o pagamento, sua assinatura será ativada automaticamente!</small></p>
        </div>
      )}
    </div>
  );
}
```

#### Proteção de Jogos no App.jsx

```jsx
import { useState, useEffect } from 'react';
import { subscriptionService } from './services/subscription';
import Login from './pages/Login';
import Subscribe from './pages/Subscribe';
import Home from './pages/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    try {
      const sub = await subscriptionService.checkSubscription();
      setHasSubscription(sub.isActive);
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    }

    setLoading(false);
  };

  if (loading) return <div>Carregando...</div>;
  if (!isLoggedIn) return <Login onLoginSuccess={() => checkAuth()} />;
  if (!hasSubscription) return <Subscribe onSubscribed={() => checkAuth()} />;

  return <Home />;
}
```

---

## 📊 Fluxo Completo

```
1. Usuário abre Launcher
   ↓
2. Verifica se está logado
   ↓ (não)
3. Mostra tela de Login/Registro
   ↓
4. Usuário faz login
   ↓
5. Verifica se tem assinatura ativa
   ↓ (não)
6. Mostra tela "Assine Agora"
   ↓
7. Usuário clica "Assinar com PIX"
   ↓
8. Backend cria assinatura no Asaas
   ↓
9. Retorna QR Code PIX
   ↓
10. Usuário paga o PIX
    ↓
11. Asaas envia webhook para backend
    ↓
12. Backend ativa assinatura no banco
    ↓
13. Launcher detecta assinatura ativa
    ↓
14. ✅ Libera acesso aos jogos!
```

---

## 🧪 Testar Sistema

### Criar Usuário de Teste

```bash
curl -X POST https://neurogame.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@neurogame.com",
    "password": "Teste123",
    "full_name": "Teste NeuroGame"
  }'
```

### Criar Assinatura

```bash
curl -X POST https://neurogame.onrender.com/api/v1/subscriptions/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"paymentMethod": "PIX"}'
```

### Verificar Assinatura

```bash
curl https://neurogame.onrender.com/api/v1/subscriptions/check \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🔒 Segurança

- ✅ JWT para autenticação
- ✅ Senha com bcrypt hash
- ✅ Webhook com validação de assinatura
- ✅ HTTPS obrigatório (Render)
- ✅ Token expira em 24h

---

## 📞 Suporte

**Webhook URL:** `https://neurogame.onrender.com/api/v1/webhooks/asaas`
**Backend:** `https://neurogame.onrender.com`
**Admin:** `https://neurogame-admin.vercel.app`

---

**Sistema pronto para produção!** 🚀
