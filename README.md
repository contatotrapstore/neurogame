# NeuroGame Platform

<div align="center">

![NeuroGame](Logo%20Verde.PNG)

**Plataforma completa de distribuição de jogos educacionais estilo Steam**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-28+-purple.svg)](https://www.electronjs.org/)

</div>

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Recursos](#-recursos)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Documentação](#-documentação)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🎯 Visão Geral

NeuroGame é uma plataforma completa de distribuição de jogos educacionais que oferece:

- **Launcher Desktop** - Aplicativo nativo para Windows, Mac e Linux
- **Dashboard Administrativo** - Interface web para gestão completa da plataforma
- **API REST** - Backend robusto com autenticação e controle de acesso
- **14 Jogos HTML5** - Catálogo inicial com jogos educacionais prontos

## ✨ Recursos

### Para Usuários Finais
- 🎮 Launcher desktop com interface intuitiva
- 🔐 Login seguro com autenticação JWT
- 📚 Biblioteca de jogos organizada
- ✅ Controle de acesso baseado em assinatura
- 🔄 Sincronização automática de novos jogos
- 🎯 Execução de jogos em WebView integrada

### Para Administradores
- 👥 Gerenciamento completo de usuários
- 🎮 CRUD de jogos (criar, editar, excluir)
- 💰 Sistema de planos e assinaturas
- 🔑 Controle granular de acesso por usuário
- 📊 Relatórios e histórico de acessos
- 🎨 Interface administrativa responsiva

### Para Desenvolvedores
- 🔌 API REST completa e documentada
- 🛡️ Autenticação JWT com refresh tokens
- 🗄️ Banco de dados Supabase (PostgreSQL)
- 📦 Supabase Client para queries
- 🧪 Estrutura preparada para testes
- 🚀 Fácil deploy e escalabilidade

## 🏗️ Arquitetura

```
┌─────────────────────┐
│  Launcher Desktop   │  ← Usuários finais (Electron + React)
│   (Windows/Mac/     │
│      Linux)         │
└──────────┬──────────┘
           │
           │ HTTPS/REST
           │
┌──────────▼──────────┐
│   Dashboard Admin   │  ← Administradores (React + Material-UI)
│    (Web Browser)    │
└──────────┬──────────┘
           │
           │ HTTPS/REST
           │
┌──────────▼──────────┐
│    Backend API      │  ← Servidor (Node.js + Express)
│  (Node.js/Express)  │
└──────────┬──────────┘
           │
           │ Supabase Client
           │
┌──────────▼──────────┐
│   Supabase          │  ← Backend-as-a-Service
│   (PostgreSQL +     │     (PostgreSQL + Auth + Storage)
│   Auth + Storage)   │
└─────────────────────┘
```

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Conta Supabase** (gratuita: [supabase.com](https://supabase.com))
- **Git** ([Download](https://git-scm.com/))

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/neurogame.git
cd neurogame
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Copie as credenciais (URL, anon key, service_role key)
3. Execute o schema SQL no SQL Editor do Supabase (arquivo `supabase-schema.sql`)
4. Gere os hashes de senha e execute os seeds (arquivo `supabase-seeds.sql`)

📖 **Guia completo:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 3. Configurar Backend

```bash
cd neurogame-backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com as credenciais do Supabase
```

### 4. Configurar Dashboard Admin

```bash
cd ../neurogame-admin

# Instalar dependências
npm install

# Criar arquivo .env
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
```

### 4. Configurar Launcher Desktop

```bash
cd ../neurogame-launcher

# Instalar dependências
npm install
```

## 🎮 Uso

### Iniciar Backend

```bash
cd neurogame-backend
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### Iniciar Dashboard Admin

```bash
cd neurogame-admin
npm run dev
```

O dashboard estará disponível em `http://localhost:3001`

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `Admin@123456`

### Iniciar Launcher Desktop

```bash
cd neurogame-launcher
npm start
```

**Credenciais de teste:**
- Usuário: `demo`
- Senha: `Demo@123456`

## 📚 Documentação

Documentação detalhada disponível em:

- [PRD.md](./PRD.md) - Product Requirements Document completo
- [Backend README](./neurogame-backend/README.md) - Documentação da API
- [IMPLEMENTACAO_ADMIN.md](./IMPLEMENTACAO_ADMIN.md) - Guia do Dashboard Admin
- [IMPLEMENTACAO_LAUNCHER.md](./IMPLEMENTACAO_LAUNCHER.md) - Guia do Launcher Desktop

### Endpoints da API

#### Autenticação
```
POST /api/v1/auth/register - Registrar usuário
POST /api/v1/auth/login - Login
POST /api/v1/auth/refresh-token - Renovar token
GET  /api/v1/auth/profile - Perfil do usuário
```

#### Jogos
```
GET  /api/v1/games - Listar jogos
GET  /api/v1/games/user/games - Jogos do usuário
GET  /api/v1/games/:id/validate - Validar acesso
POST /api/v1/games - Criar jogo (Admin)
PUT  /api/v1/games/:id - Atualizar jogo (Admin)
DELETE /api/v1/games/:id - Deletar jogo (Admin)
```

#### Usuários (Admin)
```
GET  /api/v1/users - Listar usuários
POST /api/v1/users - Criar usuário
PUT  /api/v1/users/:id - Atualizar usuário
DELETE /api/v1/users/:id - Deletar usuário
```

#### Assinaturas
```
GET  /api/v1/subscriptions/plans - Listar planos
POST /api/v1/subscriptions/assign - Atribuir assinatura (Admin)
GET  /api/v1/subscriptions/user/:userId - Assinatura do usuário
```

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM para Node.js
- **JWT** - Autenticação com tokens
- **Bcrypt** - Criptografia de senhas

### Dashboard Admin
- **React** 18 - Biblioteca UI
- **Material-UI** - Componentes React
- **React Query** - Gerenciamento de estado
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Vite** - Build tool

### Launcher Desktop
- **Electron** - Framework desktop
- **React** - UI components
- **Electron Builder** - Empacotamento
- **Electron Updater** - Auto-atualização

## 📁 Estrutura do Projeto

```
NeuroGame/
├── neurogame-backend/       # API Backend
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── controllers/     # Controladores
│   │   ├── middleware/      # Middlewares
│   │   ├── models/          # Modelos Sequelize
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Serviços
│   │   ├── utils/           # Utilitários
│   │   └── server.js        # Servidor principal
│   ├── package.json
│   └── README.md
│
├── neurogame-admin/         # Dashboard Admin
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas
│   │   ├── services/        # APIs
│   │   ├── utils/           # Utilitários
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── neurogame-launcher/      # Launcher Desktop
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # APIs
│   │   └── App.jsx
│   ├── electron.js          # Main process
│   └── package.json
│
├── Jogos/                   # Jogos HTML5
│   ├── autorama/
│   ├── balao/
│   ├── batalhadetanques/
│   └── ... (14 jogos)
│
├── Logo Branca.PNG          # Logos
├── Logo Verde.PNG
├── PRD.md                   # Product Requirements
├── IMPLEMENTACAO_ADMIN.md   # Guia Admin
├── IMPLEMENTACAO_LAUNCHER.md# Guia Launcher
└── README.md                # Este arquivo
```

## 🎮 Jogos Inclusos

1. **Autorama** - Corrida emocionante
2. **Balão** - Aventura aérea
3. **Batalha de Tanques** - Combate estratégico
4. **Correndo pelos Trilhos** - Condução de trem
5. **Desafio Aéreo** - Pilotagem de avião
6. **Desafio Automotivo** - Corrida de carros
7. **Desafio nas Alturas** - Escalada
8. **Fazendinha** - Simulação de fazenda
9. **Labirinto** - Navegação em labirintos
10. **Missão Espacial** - Exploração espacial
11. **Resgate em Chamas** - Missão de resgate
12. **Taxi City** - Simulador de táxi
13. **Tesouro do Mar** - Aventura submarina

## 💰 Planos de Assinatura

### Plano Básico - R$ 19,90/mês
- Acesso a 5 jogos selecionados
- Atualizações automáticas
- Suporte por email

### Plano Premium - R$ 39,90/mês
- Acesso a todos os 14 jogos
- Atualizações automáticas
- Suporte prioritário
- Novos jogos incluídos automaticamente

### Plano Educacional - R$ 99,90/3 meses
- Acesso personalizado
- Gestão de múltiplos usuários
- Relatórios de uso
- Suporte dedicado

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt (10 salt rounds)
- ✅ Autenticação JWT com expiração
- ✅ Refresh tokens para sessões longas
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configurável
- ✅ Headers de segurança com Helmet.js
- ✅ Validação de inputs
- ✅ HTTPS obrigatório em produção

## 📊 Roadmap

### Fase 1 - ✅ Completo
- [x] Backend API completo
- [x] Modelos de banco de dados (Supabase)
- [x] Autenticação e autorização
- [x] Seeds com jogos iniciais
- [x] 4 Controllers migrados para Supabase

### Fase 2 - ✅ Completo
- [x] Dashboard Admin completo (14 arquivos)
- [x] Launcher Desktop completo (28 arquivos)
- [x] Integração end-to-end
- [x] Todas dependências instaladas

### Fase 3 - 📅 Planejado
- [ ] Testes automatizados
- [ ] CI/CD com GitHub Actions
- [ ] Deploy em produção
- [ ] Documentação de API (Swagger)

### Fase 4 - 🔮 Futuro
- [ ] Sistema de pagamentos integrado
- [ ] Marketplace de jogos
- [ ] Modo offline no launcher
- [ ] Conquistas e pontuações
- [ ] Multiplayer em jogos selecionados

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- **NeuroGame Team** - [GitHub](https://github.com/neurogame)

## 📧 Suporte

Para suporte, envie um email para: admin@neurogame.com

## 🙏 Agradecimentos

- Todos os desenvolvedores de jogos HTML5
- Comunidade Open Source
- Usuários e beta testers

---

<div align="center">

**Desenvolvido com ❤️ pelo NeuroGame Team**

[Website](#) • [Documentação](./PRD.md) • [Issues](https://github.com/neurogame/issues)

</div>
