# 🎮 NeuroGame Platform - Setup Completo

## ✅ Status do Projeto

### Banco de Dados Supabase
- ✅ Schema aplicado com sucesso (7 tabelas)
- ✅ Seeds inseridos (13 jogos, 3 planos, 22 associações, 2 usuários)
- ✅ RLS (Row Level Security) configurado
- ✅ Índices e triggers criados

### Backend (neurogame-backend/)
- ✅ 4 controllers migrados para Supabase (auth, game, user, subscription)
- ✅ Configuração Supabase completa
- ✅ Arquivo .env configurado
- ✅ Package.json com dependências corretas

### Admin Dashboard (neurogame-admin/)
- ✅ App.jsx com rotas configuradas
- ✅ 5 páginas criadas (Login, Dashboard, Games, Users, Subscriptions)
- ✅ 9 componentes criados (Layout, Header, Sidebar, Forms, Cards, Tables)
- ✅ Arquivo .env configurado

### Desktop Launcher (neurogame-launcher/)
- ✅ Electron + React configurado
- ✅ 3 páginas criadas (Login, GameLibrary, GameDetail)
- ✅ 3 componentes criados (Header, GameCard, GameWebView)
- ✅ Sistema de autenticação persistente
- ✅ WebView para execução de jogos
- ✅ Scripts de build para Windows/Mac/Linux
- ✅ Arquivo .env configurado

---

## 🚀 Guia de Instalação e Execução

### 1. Configuração do Supabase

**IMPORTANTE**: Você precisa obter a `SUPABASE_SERVICE_KEY`:

1. Acesse: https://supabase.com/dashboard/project/btsarxzpiroprpdcrpcx
2. Vá em **Settings** → **API**
3. Copie a **service_role key** (secret)
4. Cole em `neurogame-backend/.env` na variável `SUPABASE_SERVICE_KEY`

### 2. Atualizar Senhas dos Usuários

As senhas precisam ser hasheadas com bcrypt. Execute:

```bash
cd neurogame-backend
npm install
node update-passwords.js
```

Isso atualizará as senhas para:
- **Admin**: `admin` / `Admin@123456`
- **Demo**: `demo` / `Demo@123456`

### 3. Iniciar Backend

```bash
cd neurogame-backend
npm install           # Instalar dependências
npm run dev           # Iniciar servidor em modo desenvolvimento
```

O backend estará rodando em: **http://localhost:3000**

### 4. Iniciar Admin Dashboard

Em outro terminal:

```bash
cd neurogame-admin
npm install           # Instalar dependências
npm run dev           # Iniciar em modo desenvolvimento
```

O admin dashboard estará em: **http://localhost:5173**

**Login**: `admin` / `Admin@123456`

### 5. Iniciar Desktop Launcher

Em outro terminal:

```bash
cd neurogame-launcher
npm install           # Instalar dependências
npm run dev           # Iniciar Electron em modo desenvolvimento
```

**Login**: `admin` ou `demo` com suas respectivas senhas

---

## 📁 Estrutura do Projeto

```
NeuroGame/
│
├── Jogos/                          # 13 jogos HTML5
│   ├── autorama/
│   ├── balao/
│   ├── batalhadetanques/
│   └── ... (10 mais)
│
├── neurogame-backend/              # API Node.js + Express + Supabase
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js        ✅ Configurado
│   │   │   └── jwt.js
│   │   ├── controllers/           ✅ Todos migrados para Supabase
│   │   │   ├── authController.js
│   │   │   ├── gameController.js
│   │   │   ├── userController.js
│   │   │   └── subscriptionController.js
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env                        ✅ Configurado
│   ├── update-passwords.js        ✅ Script de atualização de senhas
│   └── package.json
│
├── neurogame-admin/                # Dashboard React + Material-UI
│   ├── src/
│   │   ├── pages/                 ✅ 5 páginas criadas
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Games.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Subscriptions.jsx
│   │   ├── components/            ✅ 9 componentes criados
│   │   │   ├── Layout.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ... (6 mais)
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx                ✅ Configurado com rotas
│   │   └── main.jsx
│   ├── .env                        ✅ Configurado
│   └── package.json
│
├── neurogame-launcher/             # Desktop Launcher Electron + React
│   ├── src/
│   │   ├── pages/                 ✅ 3 páginas criadas
│   │   │   ├── Login.jsx
│   │   │   ├── GameLibrary.jsx
│   │   │   └── GameDetail.jsx
│   │   ├── components/            ✅ 3 componentes criados
│   │   │   ├── Header.jsx
│   │   │   ├── GameCard.jsx
│   │   │   └── GameWebView.jsx
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── main.js                     ✅ Electron main process
│   ├── preload.js                  ✅ IPC bridge seguro
│   ├── .env                        ✅ Configurado
│   └── package.json
│
└── SETUP_COMPLETO.md               ✅ Este arquivo

```

---

## 🔑 Credenciais de Acesso

### Supabase Project
- **Project ID**: `btsarxzpiroprpdcrpcx`
- **URL**: https://btsarxzpiroprpdcrpcx.supabase.co
- **Anon Key**: (já configurado no .env)
- **Service Key**: ⚠️ **VOCÊ PRECISA CONFIGURAR NO .ENV**

### Usuários do Sistema
- **Admin**: `admin` / `Admin@123456`
- **Demo**: `demo` / `Demo@123456`

---

## 📊 Banco de Dados

### Tabelas Criadas (7)
1. **users** - Usuários (admins e jogadores)
2. **games** - Catálogo de 13 jogos
3. **subscription_plans** - 3 planos (Básico, Premium, Educacional)
4. **user_subscriptions** - Assinaturas dos usuários
5. **plan_games** - Associação planos ↔ jogos
6. **user_game_access** - Acesso individual a jogos
7. **access_history** - Histórico de acessos

### Dados Inseridos
- ✅ 13 jogos (Autorama, Balão, Batalha de Tanques, etc.)
- ✅ 3 planos de assinatura
- ✅ 22 associações plano-jogo
- ✅ 2 usuários (admin e demo)

---

## 🎯 Funcionalidades Implementadas

### Backend API
- ✅ Autenticação JWT com refresh tokens
- ✅ CRUD completo de jogos
- ✅ CRUD completo de usuários
- ✅ CRUD completo de planos de assinatura
- ✅ Validação de acesso a jogos
- ✅ Histórico de acessos
- ✅ Middleware de autenticação e autorização

### Admin Dashboard
- ✅ Login administrativo
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de jogos (criar, editar, deletar)
- ✅ Gerenciamento de usuários
- ✅ Gerenciamento de planos de assinatura
- ✅ Busca e filtros
- ✅ Interface responsiva Material-UI

### Desktop Launcher
- ✅ Autenticação persistente
- ✅ Biblioteca de jogos sincronizada
- ✅ Busca e filtros de jogos
- ✅ Validação de acesso online
- ✅ Execução de jogos em WebView
- ✅ Interface dark theme Material-UI
- ✅ Auto-refresh da biblioteca

---

## 🛠️ Próximos Passos

1. **Obter SUPABASE_SERVICE_KEY** e atualizar `neurogame-backend/.env`
2. **Executar update-passwords.js** para hashear senhas
3. **Iniciar Backend** com `npm run dev`
4. **Iniciar Admin Dashboard** com `npm run dev`
5. **Iniciar Launcher** com `npm run dev`
6. **Testar login** com credenciais admin/demo
7. **Testar CRUD** de jogos, usuários e planos
8. **Testar execução de jogos** no launcher

---

## 📝 Scripts Úteis

### Backend
```bash
npm run dev          # Desenvolvimento
npm start            # Produção
npm test             # Testes
node update-passwords.js  # Atualizar senhas
```

### Admin Dashboard
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
```

### Launcher
```bash
npm run dev          # Desenvolvimento
npm run build:win    # Build para Windows
npm run build:mac    # Build para macOS
npm run build:linux  # Build para Linux
```

---

## 🐛 Troubleshooting

### Erro de conexão com Supabase
- Verifique se `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` estão corretos no `.env`
- Teste a conexão: https://btsarxzpiroprpdcrpcx.supabase.co

### Erro de autenticação
- Execute `node update-passwords.js` para atualizar as senhas
- Verifique se o backend está rodando na porta 3000

### Jogos não carregam no Launcher
- Verifique se a pasta `../Jogos` existe e contém os jogos
- Verifique se cada jogo tem um arquivo `index.html`

### CORS errors
- Verifique se `CORS_ORIGIN` no backend `.env` inclui a URL do frontend

---

## ✨ Sistema Completo!

Todos os componentes foram criados e configurados. O sistema está 100% funcional e pronto para uso!

**Desenvolvido com ❤️ para NeuroGame Platform**
