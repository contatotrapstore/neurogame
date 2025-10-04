# Product Requirements Document (PRD) - NeuroGame Platform

## 📋 VISÃO GERAL
Plataforma de distribuição de jogos educacionais estilo Steam com launcher desktop, sistema de assinaturas e controle de acesso por usuário.

## 🎯 OBJETIVOS DO PRODUTO
1. Criar uma plataforma desktop profissional para distribuição controlada de jogos educacionais
2. Implementar sistema de monetização via assinaturas (básico/premium/personalizado)
3. Fornecer controle granular de acesso e liberação de jogos por usuário
4. Garantir atualização automática do catálogo sem necessidade de reinstalação
5. Oferecer interface administrativa completa para gestão de usuários e conteúdo

## 👥 PERSONAS

### Usuário Final
- **Perfil:** Crianças e adolescentes em processo de aprendizado
- **Necessidades:** Interface simples, jogos acessíveis, experiência fluida
- **Cenário de uso:** Login no launcher, acesso aos jogos liberados, jogar sem complicações

### Administrador
- **Perfil:** Gestor da plataforma, educador ou responsável comercial
- **Necessidades:** Controle total sobre usuários, jogos e assinaturas
- **Cenário de uso:** Dashboard web para gerenciar toda a plataforma, adicionar novos jogos, controlar acessos

## 🏗️ ARQUITETURA DO SISTEMA

```
NeuroGame Platform
│
├── Backend (neurogame-backend)
│   ├── API REST com autenticação JWT
│   ├── Banco de dados PostgreSQL
│   ├── Controle de usuários e assinaturas
│   └── Servir jogos HTML5
│
├── Dashboard Admin (neurogame-admin)
│   ├── Interface web React
│   ├── Gerenciamento de usuários
│   ├── Gerenciamento de jogos
│   └── Relatórios e analytics
│
└── Launcher Desktop (neurogame-launcher)
    ├── Aplicação Electron
    ├── Login/Autenticação
    ├── Biblioteca de jogos
    └── WebView para executar jogos
```

## 📦 COMPONENTES PRINCIPAIS

### 1. Backend API (neurogame-backend)
**Tecnologias:** Node.js, Express, PostgreSQL, JWT, Bcrypt

**Funcionalidades:**
- Sistema de autenticação com JWT
- CRUD completo de usuários
- CRUD completo de jogos
- Sistema de planos e assinaturas
- Validação de acesso aos jogos
- Histórico de acessos
- Endpoints para sincronização do launcher
- Upload e gestão de arquivos de jogos

**Endpoints principais:**
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/games
POST   /api/games
PUT    /api/games/:id
DELETE /api/games/:id
GET    /api/games/:id/validate
POST   /api/subscriptions
GET    /api/subscriptions/:userId
```

### 2. Dashboard Administrativo (neurogame-admin)
**Tecnologias:** React, Material-UI, Axios, React Router

**Funcionalidades:**
- Login de administrador
- Dashboard com estatísticas gerais
- Gerenciamento de usuários:
  - Listar, criar, editar, excluir
  - Definir plano de assinatura
  - Liberar/bloquear jogos específicos
  - Visualizar histórico de acessos
- Gerenciamento de jogos:
  - Upload de novos jogos (HTML5 + assets)
  - Editar informações (nome, descrição, capa)
  - Excluir jogos
  - Categorizar jogos
- Gerenciamento de planos:
  - Criar planos personalizados
  - Definir jogos inclusos em cada plano
  - Configurar preços e duração
- Relatórios:
  - Usuários ativos
  - Jogos mais acessados
  - Receita de assinaturas

### 3. Launcher Desktop (neurogame-launcher)
**Tecnologias:** Electron, React/Vue, Axios

**Funcionalidades:**
- Tela de login/registro
- Biblioteca de jogos com:
  - Grid de cards com capas dos jogos
  - Nome e breve descrição
  - Indicador de acesso (liberado/bloqueado)
- Sistema de execução:
  - Clique em "Jogar"
  - Validação online de permissão
  - Abertura em WebView fullscreen
  - Botão para voltar à biblioteca
- Sincronização automática:
  - Check periódico de novos jogos
  - Atualização automática do catálogo
  - Notificações de novos jogos disponíveis
- Perfil do usuário:
  - Informações da conta
  - Plano atual
  - Opção de logout
- Auto-update do launcher

## 🎮 CATÁLOGO DE JOGOS

### Jogos Disponíveis (14 jogos HTML5):
1. **Autorama** - Jogo de corrida em pista
2. **Balão** - Controle de balão de ar quente
3. **Batalha de Tanques** - Combate com tanques
4. **Correndo pelos Trilhos** - Jogo de trem
5. **Desafio Aéreo** - Pilotagem de avião
6. **Desafio Automotivo** - Corrida automotiva
7. **Desafio nas Alturas** - Escalada e plataforma
8. **Fazendinha** - Simulação de fazenda
9. **Labirinto** - Navegação em labirinto
10. **Missão Espacial** - Exploração espacial
11. **Resgate em Chamas** - Missão de resgate
12. **Taxi City** - Simulação de táxi
13. **Tesouro do Mar** - Aventura submarina

### Estrutura de cada jogo:
```
/Jogos/[nome-do-jogo]/
  ├── index.html
  ├── game.js
  ├── assets/
  └── dependências (three.js, etc.)
```

## 💰 SISTEMA DE ASSINATURAS

### Planos Propostos:

**Plano Básico**
- Acesso a 5 jogos selecionados
- R$ 19,90/mês
- Ideal para experimentação

**Plano Premium**
- Acesso a todos os 14 jogos
- R$ 39,90/mês
- Melhor custo-benefício

**Plano Personalizado**
- Admin define jogos específicos
- Preço flexível
- Para instituições educacionais

## 📊 BANCO DE DADOS

### Modelo de Dados:

```sql
Users
- id (PK)
- username (unique)
- email (unique)
- password_hash
- full_name
- subscription_plan_id (FK)
- is_active
- created_at
- updated_at

SubscriptionPlans
- id (PK)
- name
- description
- price
- duration_days
- created_at
- updated_at

Games
- id (PK)
- name
- slug (unique)
- description
- cover_image_url
- folder_path
- category
- is_active
- created_at
- updated_at

PlanGames (muitos-para-muitos)
- plan_id (FK)
- game_id (FK)

UserGameAccess (controle individual adicional)
- user_id (FK)
- game_id (FK)
- granted_at
- expires_at

AccessHistory (opcional)
- id (PK)
- user_id (FK)
- game_id (FK)
- accessed_at
```

## 🔒 SEGURANÇA

### Requisitos de Segurança:
1. Senhas criptografadas com bcrypt (salt rounds: 10)
2. Autenticação via JWT com expiração (24h)
3. Refresh tokens para sessões longas
4. HTTPS obrigatório em produção
5. Validação server-side de todas as requisições
6. Rate limiting para evitar ataques
7. CORS configurado adequadamente
8. Sanitização de inputs do usuário

## 🚀 ROADMAP DE DESENVOLVIMENTO

### Fase 1: Backend (Semana 1-2)
- ✅ Configurar projeto Node.js
- ✅ Criar estrutura de pastas
- ✅ Configurar banco de dados PostgreSQL
- ✅ Implementar modelos de dados
- ✅ Criar API de autenticação
- ✅ Implementar CRUD de usuários
- ✅ Implementar CRUD de jogos
- ✅ Sistema de validação de acesso
- ✅ Seeds com 14 jogos existentes

### Fase 2: Dashboard Admin (Semana 2-3)
- ⏳ Setup projeto React
- ⏳ Implementar tela de login
- ⏳ Dashboard principal
- ⏳ Gerenciamento de usuários
- ⏳ Gerenciamento de jogos
- ⏳ Sistema de upload de jogos
- ⏳ Configuração de planos
- ⏳ Relatórios básicos

### Fase 3: Launcher Desktop (Semana 3-4)
- ⏳ Setup projeto Electron
- ⏳ Tela de login
- ⏳ Biblioteca de jogos (grid)
- ⏳ Sistema de WebView para jogos
- ⏳ Sincronização automática
- ⏳ Validação online de acesso
- ⏳ Interface de perfil
- ⏳ Auto-update

### Fase 4: Integração (Semana 5)
- ⏳ Integrar todos os componentes
- ⏳ Preparar jogos HTML5
- ⏳ Testes end-to-end
- ⏳ Ajustes de UX/UI
- ⏳ Otimizações

### Fase 5: Deploy (Semana 6)
- ⏳ Deploy do backend (AWS/Heroku/DigitalOcean)
- ⏳ Build do launcher (Win/Mac/Linux)
- ⏳ Documentação completa
- ⏳ Guias de instalação
- ⏳ Preparação para lançamento

## 📈 MÉTRICAS DE SUCESSO

### KPIs:
1. **Usuários Ativos Mensais (MAU)**
2. **Taxa de Retenção**: % de usuários que retornam
3. **Tempo Médio de Sessão**: quanto tempo jogam
4. **Jogos Mais Populares**: quais são mais acessados
5. **Taxa de Conversão**: free trial → assinatura paga
6. **Receita Mensal Recorrente (MRR)**
7. **Churn Rate**: % de cancelamentos

## 🎨 DESIGN E UX

### Diretrizes:
- Interface limpa e moderna
- Cores: Verde (primária), Branco/Cinza (secundária)
- Usar logos disponíveis (Logo Branca.PNG, Logo Verde.PNG)
- Tipografia legível para crianças
- Cards de jogos atrativos com capas visuais
- Feedback visual claro (loading, erros, sucessos)
- Responsividade no dashboard admin
- Launcher com design desktop nativo

## 🛠️ STACK TECNOLÓGICA FINAL

### Backend:
- Node.js 18+
- Express.js
- PostgreSQL 15+
- Sequelize ORM
- JWT (jsonwebtoken)
- Bcrypt
- Multer (upload de arquivos)
- Express-validator

### Admin Dashboard:
- React 18+
- Material-UI v5
- React Router v6
- Axios
- React Query
- Formik + Yup

### Launcher Desktop:
- Electron 25+
- React 18+
- Electron Builder
- Electron Updater
- Axios

### DevOps:
- Git/GitHub
- Docker (opcional)
- CI/CD (GitHub Actions)
- PM2 (produção)

## 📚 DOCUMENTAÇÃO NECESSÁRIA

1. **README.md** - Visão geral do projeto
2. **INSTALLATION.md** - Guia de instalação para desenvolvedores
3. **API_DOCUMENTATION.md** - Documentação completa da API
4. **USER_GUIDE.md** - Manual do usuário final
5. **ADMIN_GUIDE.md** - Manual do administrador
6. **DEPLOYMENT.md** - Guia de deploy em produção

## ✅ CRITÉRIOS DE ACEITAÇÃO

### Backend:
- [ ] Autenticação funcional com JWT
- [ ] CRUD completo de usuários
- [ ] CRUD completo de jogos
- [ ] Sistema de planos implementado
- [ ] Validação de acesso funcionando
- [ ] Seeds com 14 jogos carregados
- [ ] Testes unitários (>80% cobertura)

### Dashboard Admin:
- [ ] Login de admin funcional
- [ ] Interface responsiva e intuitiva
- [ ] Todas as operações CRUD funcionando
- [ ] Upload de jogos operacional
- [ ] Relatórios exibindo dados corretos

### Launcher:
- [ ] Login/logout funcionando
- [ ] Biblioteca exibindo todos os jogos
- [ ] Jogos abrindo corretamente em WebView
- [ ] Validação de acesso impedindo jogos bloqueados
- [ ] Sincronização automática funcionando
- [ ] Build gerando executável para 3 plataformas

## 🔄 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ Criar estrutura de pastas
2. ⏭️ Inicializar projeto backend com npm
3. ⏭️ Configurar banco de dados PostgreSQL
4. ⏭️ Implementar modelos de dados
5. ⏭️ Criar primeiro endpoint de autenticação
6. ⏭️ Implementar validação de JWT
7. ⏭️ Criar seeds com dados dos 14 jogos

---

**Versão:** 1.0
**Data:** 02/10/2025
**Status:** Em Desenvolvimento
**Autor:** NeuroGame Team
