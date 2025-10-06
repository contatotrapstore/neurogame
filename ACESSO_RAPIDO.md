# 🎮 NeuroGame - Guia de Acesso Rápido

**Última atualização:** 2025-10-06
**Status:** ✅ Sistema Funcional

---

## 🔐 Credenciais de Acesso

### **Admin (Painel Administrativo)**
```
Email:    admin@neurogame.com
Senha:    Admin123
URL:      http://localhost:3001
```

### **Demo User (Launcher)**
```
Email:    demo@neurogame.com
Senha:    Demo@123456
```

---

## 🚀 Como Iniciar o Sistema

### **1. Iniciar Backend**
```bash
cd neurogame-backend
npm run dev
```
- ✅ Porta: 3000
- ✅ URL: http://localhost:3000
- ✅ Health: http://localhost:3000/api/v1/health

### **2. Iniciar Admin Panel**
```bash
cd neurogame-admin
npm run dev
```
- ✅ Porta: 3001
- ✅ URL: http://localhost:3001

### **3. Iniciar Launcher (Electron)**
```bash
cd neurogame-launcher
npm run dev
```
- ✅ Porta: 5174 (React)
- ✅ App: Electron Desktop

---

## 📊 Configuração do Supabase

### **Projeto Correto**
```
Nome:          NeuroGame
Project ID:    btsarxzpiroprpdcrpcx
Região:        sa-east-1 (São Paulo)
URL:           https://btsarxzpiroprpdcrpcx.supabase.co
Status:        ACTIVE_HEALTHY
```

### **Chaves de API**
```env
SUPABASE_URL=https://btsarxzpiroprpdcrpcx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0c2FyeHpwaXJvcHJwZGNycGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDQ1NTIsImV4cCI6MjA3NTAyMDU1Mn0.B6QsUU4WaiRo6WGQfC9Jgd9mF6aqXmTgcwKeCC5LLBY
```

---

## 🛠️ Comandos Úteis

### **Parar Todos os Servidores**
```bash
npx kill-port 3000 3001 5173 5174
```

### **Testar Login (cURL)**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@neurogame.com","password":"Admin123"}'
```

### **Verificar Conexão com Supabase**
```bash
curl https://btsarxzpiroprpdcrpcx.supabase.co/rest/v1/
```

---

## 📁 Estrutura do Projeto

```
NeuroGame/
├── neurogame-backend/      # API Backend (Node.js + Express)
├── neurogame-admin/        # Painel Admin (React + Vite)
├── neurogame-launcher/     # Launcher Desktop (Electron + React)
├── docs/                   # Documentação completa
├── README.md               # Readme principal
├── STATUS_ATUAL.md         # Status detalhado do sistema
└── ACESSO_RAPIDO.md        # Este arquivo
```

---

## 🔍 Troubleshooting

### **Erro 401 no Login**
- ✅ Credenciais corretas: `admin@neurogame.com` / `Admin123`
- ✅ Backend rodando em http://localhost:3000
- ✅ Projeto Supabase: `btsarxzpiroprpdcrpcx`

### **Erro "Port Already in Use"**
```bash
npx kill-port 3000  # ou 3001, 5174
```

### **Supabase Connection Error**
- Verificar `.env` no backend
- Confirmar SUPABASE_URL e SUPABASE_ANON_KEY

---

## 📚 Documentação Completa

- **[README.md](README.md)** - Overview do projeto
- **[STATUS_ATUAL.md](STATUS_ATUAL.md)** - Status e correções
- **[RESUMO_FINAL.md](RESUMO_FINAL.md)** - Resumo executivo
- **[docs/INDEX.md](docs/INDEX.md)** - Índice da documentação
- **[docs/INICIO_RAPIDO.md](docs/INICIO_RAPIDO.md)** - Guia de início

---

## ✅ Checklist de Verificação

- [x] Backend rodando em http://localhost:3000
- [x] Admin Panel rodando em http://localhost:3001
- [x] Login funcionando com `Admin123`
- [x] Conexão com Supabase estabelecida
- [x] Projeto correto: `btsarxzpiroprpdcrpcx`
- [x] Credenciais salvas no MCP Memory

---

**🎯 Tudo pronto! Acesse http://localhost:3001 e faça login.**
