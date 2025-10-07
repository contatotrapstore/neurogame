# 🔑 Credenciais Admin - NeuroGame

## ✅ Conta Administrador Criada

**Email:** psitales.sales@gmail.com
**Senha:** 23112018Vt!
**Username:** psitalessales

### 🎯 Como Fazer Login

#### Opção 1: Login com Username (RECOMENDADO)
```json
{
  "username": "psitalessales",
  "password": "23112018Vt!"
}
```

#### Opção 2: Login com Email
```json
{
  "email": "psitales.sales@gmail.com",
  "password": "23112018Vt!"
}
```

**⚠️ Observação:** Caso o login com email não funcione imediatamente, use o **username** (`psitalessales`).

---

## 📊 Informações da Conta

**ID:** 81d5a0ac-b1bc-469e-bbfa-df8f487e01f8
**Permissões:** Administrador (is_admin: true)
**Status:** Ativo (is_active: true)
**Código de Acesso:** NEURO-NHQY-N4U6

---

## 💳 Assinatura

**Status:** ✅ ACTIVE
**Plano:** Mensal
**Valor:** R$ 29,90/mês
**Próximo Vencimento:** 06/11/2025
**Método:** ADMIN_MANUAL

---

## 🔗 Links de Acesso

### Painel Admin
https://neuro-game-nu.vercel.app/login

**Login:**
- Username: `psitalessales`
- Senha: `23112018Vt!`

### API Backend
https://neurogame-7av9.onrender.com

### Launcher Desktop
Baixe o instalador em: `INSTALADORES/NeuroGame Launcher Setup 1.0.9.exe`

**Login no Launcher:**
- Email: `psitales.sales@gmail.com`
- Senha: `23112018Vt!`

---

## 🧪 Teste de Login (API)

### Com cURL:
```bash
curl -X POST https://neurogame-7av9.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"psitalessales","password":"23112018Vt!"}'
```

### Resposta Esperada:
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "email": "psitales.sales@gmail.com",
      "isAdmin": true,
      "hasActiveSubscription": true
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

## ✅ Testes Confirmados

- ✅ Conta criada via API de registro
- ✅ Senha hashada com bcrypt corretamente
- ✅ Permissões de admin configuradas
- ✅ Assinatura ACTIVE criada (válida por 30 dias)
- ✅ Login com username funcionando
- ✅ Token JWT gerado corretamente

---

## 🔧 Outras Contas Disponíveis

### Admin Padrão
**Email:** admin@neurogame.com
**Senha:** Admin123
**Username:** admin

---

**Última Atualização:** 07/10/2025 16:40
