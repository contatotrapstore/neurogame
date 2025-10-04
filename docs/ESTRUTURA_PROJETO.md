# 📁 Estrutura do Projeto NeuroGame

Mapa visual completo da estrutura do projeto.

## 🗂️ Estrutura de Diretórios

```
NeuroGame/
│
├── 📁 neurogame-backend/          # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/           # Lógica de negócio
│   │   ├── routes/                # Rotas da API
│   │   ├── middleware/            # Auth, validação, erros
│   │   ├── config/                # Configurações (Supabase, JWT)
│   │   └── services/              # Serviços externos (Asaas)
│   ├── api/
│   │   └── index.js               # Handler para Vercel serverless
│   ├── .env.example               # Template de variáveis
│   ├── vercel.json                # Config Vercel
│   ├── DEPLOY_VERCEL.md          # Guia de deploy
│   └── package.json
│
├── 📁 neurogame-admin/            # Painel Admin (React + Vite)
│   ├── src/
│   │   ├── components/            # Componentes reutilizáveis
│   │   ├── pages/                 # Páginas do admin
│   │   ├── services/              # APIs e utilitários
│   │   └── main.jsx               # Entry point
│   ├── public/                    # Assets estáticos
│   ├── .env.example               # Template de variáveis
│   ├── vercel.json                # Config Vercel
│   ├── DEPLOY_VERCEL.md          # Guia de deploy
│   └── package.json
│
├── 📁 neurogame-launcher/         # Launcher Desktop (Electron)
│   ├── src/
│   │   ├── components/            # Componentes React
│   │   │   ├── ContentUpdateDialog.jsx  # Dialog de updates
│   │   │   ├── PaymentAlert.jsx         # Alertas de pagamento
│   │   │   └── ...
│   │   ├── pages/                 # Páginas
│   │   │   ├── Login.jsx
│   │   │   ├── GameLibrary.jsx
│   │   │   ├── GameDetail.jsx
│   │   │   └── RenewPayment.jsx
│   │   ├── services/              # Serviços
│   │   │   ├── api.js
│   │   │   ├── contentUpdater.js  # Auto-updates de jogos
│   │   │   ├── storage.js
│   │   │   └── subscriptionApi.js
│   │   └── utils/                 # Utilitários
│   ├── main.js                    # Processo principal Electron
│   ├── preload.js                 # Preload script
│   ├── electron-builder.yml       # Config do builder
│   ├── README.md                  # Doc do launcher
│   └── package.json
│
├── 📁 docs/                       # Documentação
│   ├── INDEX.md                   # 📖 Índice completo
│   ├── INICIO_RAPIDO.md          # Guia início rápido
│   ├── SISTEMA_ATUALIZACOES.md   # Sistema de auto-updates
│   ├── IMPLEMENTACAO_LAUNCHER.md # Detalhes do launcher
│   ├── IMPLEMENTACAO_ADMIN.md    # Detalhes do admin
│   ├── DEPLOY.md                  # Deploy geral
│   ├── SUPABASE_SETUP.md         # Config Supabase
│   ├── PROXIMOS_PASSOS.md        # Roadmap
│   └── ...
│
├── 📄 README.md                   # README principal
├── 📄 package.json                # Dependências root
└── 📄 .gitignore                  # Git ignore

```

## 🔑 Arquivos Principais

### Backend
| Arquivo | Descrição |
|---------|-----------|
| `src/server.js` | Servidor Express principal |
| `src/routes/index.js` | Agregador de rotas |
| `src/routes/authRoutes.js` | Autenticação |
| `src/routes/gameRoutes.js` | Jogos + Updates |
| `src/routes/subscriptions.js` | Assinaturas |
| `api/index.js` | Handler Vercel serverless |
| `vercel.json` | Config deploy Vercel |

### Admin
| Arquivo | Descrição |
|---------|-----------|
| `src/main.jsx` | Entry point React |
| `src/App.jsx` | Componente principal |
| `src/pages/Dashboard.jsx` | Dashboard |
| `src/pages/Games.jsx` | Gestão de jogos |
| `src/pages/Users.jsx` | Gestão de usuários |
| `src/pages/Requests.jsx` | Solicitações de jogos |
| `vercel.json` | Config deploy Vercel |

### Launcher
| Arquivo | Descrição |
|---------|-----------|
| `main.js` | Processo principal Electron |
| `preload.js` | Bridge Electron-React |
| `src/App.jsx` | App React principal |
| `src/services/contentUpdater.js` | Auto-updates de jogos |
| `src/components/ContentUpdateDialog.jsx` | UI de updates |
| `electron-builder.yml` | Config instalador |

## 🔄 Fluxo de Dados

### Autenticação
```
Login.jsx → api.js → /api/v1/auth/login → authController.js → Supabase
```

### Jogos (Admin)
```
Games.jsx → api.js → /api/v1/games → gameController.js → Supabase
```

### Updates (Launcher)
```
contentUpdater.js → /api/v1/games/updates → gameRoutes.js → Supabase
                  ↓
        ContentUpdateDialog.jsx (UI)
```

### Assinaturas
```
RenewPayment.jsx → /api/v1/subscriptions/create → Asaas API
                                                  ↓
                                            Webhook callback
                                                  ↓
                                        Update Supabase
```

## 📦 Dependências Principais

### Backend
- `express` - Framework web
- `@supabase/supabase-js` - Cliente Supabase
- `jsonwebtoken` - JWT auth
- `bcrypt` - Hash de senhas
- `axios` - HTTP client (Asaas)
- `helmet` - Segurança
- `cors` - CORS

### Admin
- `react` - UI library
- `@mui/material` - Material-UI
- `react-router-dom` - Roteamento
- `axios` - HTTP client
- `vite` - Build tool

### Launcher
- `electron` - Desktop framework
- `react` - UI library
- `@mui/material` - Material-UI
- `electron-updater` - Auto-updates
- `electron-store` - Storage local
- `electron-builder` - Build instalador

## 🌐 APIs e Serviços

### Externos
- **Supabase** - Banco de dados PostgreSQL
- **Asaas** - Gateway de pagamentos
- **Vercel** - Hospedagem (backend + admin)

### Internas
```
Backend API (http://localhost:3000/api/v1)
├── /auth          # Autenticação
├── /games         # Jogos + Updates
├── /subscriptions # Assinaturas
├── /users         # Usuários
├── /payments      # Pagamentos
└── /webhooks      # Webhooks Asaas
```

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
JWT_SECRET=
ASAAS_API_KEY=
CORS_ORIGIN=
```

### Admin (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Launcher
Configurado via Electron Store (runtime)

## 📊 Status de Implementação

| Módulo | Status | Arquivo |
|--------|--------|---------|
| Backend API | ✅ Completo | `neurogame-backend/` |
| Admin Panel | ✅ Completo | `neurogame-admin/` |
| Launcher Base | ✅ Completo | `neurogame-launcher/` |
| Auto-updates Launcher | ✅ Completo | `main.js` |
| Auto-updates Jogos | ✅ Completo | `contentUpdater.js` |
| Sistema Assinaturas | ✅ Completo | `subscriptions.js` |
| Deploy Vercel | ✅ Completo | `vercel.json` |
| Documentação | ✅ Completo | `docs/` |

## 🚀 Próximos Módulos

- [ ] Download real de jogos (electron-dl)
- [ ] Validação de checksum
- [ ] Updates obrigatórios com bloqueio
- [ ] Analytics e métricas
- [ ] Multiplayer (futuro)

---

**Última atualização:** 2025-10-04
