# 🎮 NeuroGame - Plataforma de Distribuição de Jogos Educacionais

**Versão Launcher:** 1.0.9 | **Status:** ✅ 100% Operacional | **Última Atualização:** 07/10/2025

Sistema completo de distribuição e gerenciamento de jogos educacionais com launcher desktop, painel administrativo e backend robusto.

---

## 🌐 Sistema em Produção

| Componente | Status | URL/Versão |
|------------|--------|------------|
| **Backend API** | 🟢 Online | https://neurogame.onrender.com |
| **Admin Panel** | 🟢 Online | https://neurogame-admin.vercel.app |
| **Launcher Desktop** | 🟢 v1.0.9 | Instalador Windows (273.8 MB) |
| **Database** | 🟢 Online | Supabase PostgreSQL |

---

## 📦 Componentes do Sistema

### 1️⃣ Backend API (Node.js + Express)
**Deploy:** Render.com | **Repositório:** `neurogame-backend/`

✅ **Funcionalidades:**
- Autenticação JWT com refresh tokens
- Gerenciamento completo de jogos (CRUD)
- Sistema de assinaturas e planos
- Integração Asaas (pagamentos)
- API REST com validação de dados
- Sistema de solicitações de acesso
- Health check e monitoramento

### 2️⃣ Admin Panel (React + Material-UI)
**Deploy:** Vercel | **Repositório:** `neurogame-admin/`

✅ **Funcionalidades:**
- **Dashboard reformulado** com métricas em tempo real
- CRUD completo de jogos com **upload direto de pastas**
- Gerenciamento avançado de usuários
- Sistema de planos e assinaturas
- Aprovação de solicitações de acesso
- Interface responsiva e intuitiva
- **Formulário de jogos simplificado** (v2.0)

**Credenciais Admin:**
- Email: `admin@neurogame.com`
- Senha: `Admin123`

### 3️⃣ Launcher Desktop (Electron)
**Versão:** 1.0.9 | **Repositório:** `neurogame-launcher/`

✅ **Características:**
- Biblioteca com 13 jogos embedados
- **Download automático** com axios + fs streams
- Extração inteligente com extract-zip
- Armazenamento em `%APPDATA%` (sem admin)
- **Fullscreen otimizado** com auto-hide de controles
- Interface moderna Material-UI
- Proteção por assinatura
- Sistema de auto-atualização integrado

---

## 🎮 Catálogo de Jogos (13)

Todos os jogos estão disponíveis para download em produção:

| # | Jogo | Categoria | Tamanho |
|---|------|-----------|---------|
| 1 | Autorama | Corrida | 19.1 MB |
| 2 | Balão | Aventura | 11.3 MB |
| 3 | Batalha de Tanques | Ação | 8.9 MB |
| 4 | Correndo pelos Trilhos | Corrida | 39.9 MB |
| 5 | Desafio Aéreo | Simulação | 40.3 MB |
| 6 | Desafio Automotivo | Corrida | 23.3 MB |
| 7 | Desafio nas Alturas | Aventura | 45.7 MB |
| 8 | Fazendinha | Simulação | 8.7 MB |
| 9 | Labirinto | Puzzle | 2.2 MB |
| 10 | Missão Espacial | Aventura | 16.3 MB |
| 11 | Resgate em Chamas | Ação | 14.2 MB |
| 12 | Taxi City | Simulação | 6.4 MB |
| 13 | Tesouro do Mar | Aventura | 11.6 MB |

**Total:** ~248 MB de conteúdo educacional

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js 4.21
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT + Refresh Tokens
- **Payment:** Asaas API
- **Deploy:** Render.com
- **Validação:** Express Validator

### Admin Panel
- **Framework:** React 18 + Vite 5
- **UI:** Material-UI v5
- **Router:** React Router v6
- **HTTP:** Axios
- **Deploy:** Vercel
- **State:** React Hooks + Context

### Launcher
- **Framework:** Electron 29
- **UI:** React 18 + Material-UI v5
- **Build:** Electron Builder 24
- **Downloads:** Axios + fs streams
- **Extração:** extract-zip v2.0.1
- **Storage:** electron-store
- **Distribuição:** NSIS Installer

---

## ✨ Últimas Atualizações

### v1.0.9 (Launcher)
- ✅ Versão atualizada com latest.yml correto
- ✅ Sistema de auto-atualização funcional
- ✅ Melhorias de estabilidade

### v2.0 (Admin Panel)
- ✅ **Dashboard completamente reformulado**
  - 4 cards de estatísticas com ações rápidas
  - Lista de usuários recentes com status
  - Lista de jogos cadastrados
  - Painel de ações rápidas com gradiente
- ✅ **Formulário de jogos simplificado**
  - Upload direto de pasta completa do jogo
  - Upload de imagem de capa
  - Campos reduzidos para facilitar cadastro
  - Slug gerado automaticamente
  - Interface intuitiva e limpa
- ✅ **Menu admin simplificado**
  - Removido botão de Configurações
  - Foco em funcionalidades essenciais

---

## 🚀 Como Usar

### Para Usuários

1. **Baixar o Launcher**
   - Baixe `NeuroGame Launcher Setup 1.0.9.exe` (273.8 MB)
   - Execute o instalador
   - Não requer permissões de administrador

2. **Fazer Login**
   - Abra o NeuroGame Launcher
   - Entre com suas credenciais
   - Navegue pela biblioteca

3. **Jogar**
   - Escolha um jogo
   - Download automático se necessário
   - Clique em "Jogar" e divirta-se!

### Para Administradores

1. **Acessar Admin Panel**
   - URL: https://neurogame-admin.vercel.app
   - Login: admin@neurogame.com / Admin123

2. **Adicionar Novo Jogo**
   - Menu "Jogos" → Botão "Novo Jogo"
   - Preencha nome (slug é gerado automaticamente)
   - **Selecione a pasta completa do jogo**
   - Faça upload da imagem de capa (opcional)
   - Configure categoria e versão
   - Salvar

3. **Gerenciar Usuários**
   - Menu "Usuários" → Ver lista completa
   - Criar, editar ou desativar usuários
   - Atribuir assinaturas

---

## 📚 Documentação

### Documentos Essenciais
- **[docs/INDEX.md](docs/INDEX.md)** - Índice completo da documentação
- **[docs/STATUS_PRODUCAO.md](docs/STATUS_PRODUCAO.md)** - Status detalhado do sistema
- **[docs/GUIA_DEPLOY_PRODUCAO.md](docs/GUIA_DEPLOY_PRODUCAO.md)** - Guia de deploy
- **[docs/FUNCIONAMENTO_LAUNCHER.md](docs/FUNCIONAMENTO_LAUNCHER.md)** - Como funciona o launcher
- **[docs/INTEGRACAO_JOGOS.md](docs/INTEGRACAO_JOGOS.md)** - Como adicionar jogos
- **[docs/PROXIMOS_PASSOS.md](docs/PROXIMOS_PASSOS.md)** - Roadmap do projeto

### Documentação Técnica
- **[docs/ESTRUTURA_PROJETO.md](docs/ESTRUTURA_PROJETO.md)** - Arquitetura
- **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** - Setup do banco
- **[docs/SISTEMA_ATUALIZACOES.md](docs/SISTEMA_ATUALIZACOES.md)** - Auto-update
- **[docs/IMPLEMENTACAO_ADMIN.md](docs/IMPLEMENTACAO_ADMIN.md)** - Admin técnico
- **[docs/IMPLEMENTACAO_LAUNCHER.md](docs/IMPLEMENTACAO_LAUNCHER.md)** - Launcher técnico

---

## 🔐 Segurança

- ✅ JWT Authentication (24h) + Refresh Tokens (7 dias)
- ✅ HTTPS obrigatório em produção
- ✅ CORS configurado com whitelist
- ✅ Row Level Security (RLS) no Supabase
- ✅ Rate Limiting implementado
- ✅ Validação de inputs
- ✅ Checksums SHA-256 para downloads
- ✅ Context isolation no Electron
- ✅ bcrypt para hash de senhas (12 rounds)

---

## 📈 Métricas

### Performance
- API Response Time: ~150-200ms
- Admin Load Time: ~1.2s
- Launcher Install: 273.8 MB
- Download Speed: Conforme conexão do usuário
- Extração de jogos: ~2-5s por jogo

### Infraestrutura (Custo Zero)
- **Backend:** Render Free Tier
- **Admin:** Vercel Hobby
- **Database:** Supabase Free Tier
- **CDN:** Render + Vercel

---

## 🎯 Roadmap

### ✅ Concluído
- Sistema de autenticação completo
- 13 jogos catalogados e funcionais
- Dashboard admin reformulado
- Formulário de cadastro simplificado
- Launcher com auto-atualização
- Deploy em produção (backend + admin)

### 🔄 Em Desenvolvimento
- Sistema de emails transacionais
- Analytics e métricas de uso
- Warm-up automático do backend

### 📝 Planejado
- Versão Mac e Linux do launcher
- Sistema de conquistas
- Multiplayer em jogos selecionados
- App mobile (React Native)
- Marketplace de jogos

---

## 📞 Suporte e Links

### URLs
- **Backend Health:** https://neurogame.onrender.com/api/v1/health
- **Admin Panel:** https://neurogame-admin.vercel.app
- **Documentação:** [docs/INDEX.md](docs/INDEX.md)

### Repositórios
- **GitHub:** https://github.com/GouveiaZx/NeuroGame
- **GitLab:** https://gitlab.com/neurogame1/neurogame

### Contato
- **Email:** suporte@neurogame.com.br
- **Issues:** Use o sistema de issues do repositório

---

## 📝 Licença

Proprietary - © 2025 NeuroGame. Todos os direitos reservados.

---

**Desenvolvido e mantido pela equipe NeuroGame**

*Sistema em produção desde 2025 | Plataforma educacional de jogos*
