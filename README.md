# 🎮 NeuroGame - Plataforma de Distribuição de Jogos

Sistema completo de distribuição e gerenciamento de jogos com launcher desktop, painel administrativo e integração de pagamentos.

---

## 🌐 URLs de Produção

### **🔗 Backend API**
- **URL:** https://neurogame.onrender.com
- **Health:** https://neurogame.onrender.com/api/v1/health
- **Documentação:** https://neurogame.onrender.com/api/v1

### **🔗 Admin Panel**
- **URL:** https://neurogame-admin.vercel.app
- **Credenciais Admin:**
  - Email: `admin@neurogame.com`
  - Senha: `Admin123`

### **🗄️ Banco de Dados**
- **Supabase PostgreSQL**
- Project ID: `btsarxzpiroprpdcrpcx`
- Região: São Paulo (sa-east-1)

---

## 📦 Componentes do Sistema

### 1️⃣ **Backend API** (Node.js + Express)
- **Deploy:** Render.com
- **Repositório:** `neurogame-backend/`
- **Funções:**
  - Autenticação JWT
  - Gerenciamento de jogos
  - Sistema de assinaturas
  - Integração Asaas (pagamentos)
  - API REST completa

### 2️⃣ **Admin Panel** (React + Vite)
- **Deploy:** Vercel
- **Repositório:** `neurogame-admin/`
- **Funções:**
  - CRUD de jogos
  - Gerenciamento de usuários
  - Controle de assinaturas
  - Dashboard administrativo
  - Aprovação de solicitações

### 3️⃣ **Launcher Desktop** (Electron)
- **Distribuição:** Instalador Windows (.exe)
- **Repositório:** `neurogame-launcher/`
- **Funções:**
  - Biblioteca de jogos
  - Download e instalação automática
  - Auto-atualização
  - Proteção por assinatura
  - Interface moderna (Material-UI)

---

## 📊 Status do Sistema

✅ **100% Operacional em Produção**

### Backend (Render)
- ✅ API rodando e acessível
- ✅ Conexão Supabase estável
- ✅ 13 jogos cadastrados com downloads
- ✅ Autenticação JWT funcionando
- ✅ CORS configurado

### Admin Panel (Vercel)
- ✅ Deploy realizado
- ✅ Interface totalmente funcional
- ✅ Conectado ao backend de produção

### Launcher
- ✅ Instalador criado (82MB)
- ✅ Sistema de auto-atualização ativo
- ✅ Proteção de conteúdo implementada
- ✅ Downloads funcionando

### Banco de Dados
- ✅ 13 jogos com metadados completos
- ✅ Sistema de usuários operacional
- ✅ RLS policies configuradas
- ✅ Migrations aplicadas

---

## 🎮 Catálogo de Jogos (13)

Todos os jogos estão disponíveis para download em produção:

| # | Jogo | Categoria | Tamanho | Versão |
|---|------|-----------|---------|--------|
| 1 | Autorama | Corrida | 19.1 MB | 1.2.0 |
| 2 | Balão | Aventura | 11.3 MB | 1.0.0 |
| 3 | Batalha de Tanques | Ação | 8.9 MB | 1.0.0 |
| 4 | Correndo pelos Trilhos | Corrida | 39.9 MB | 1.0.0 |
| 5 | Desafio Aéreo | Simulação | 40.3 MB | 1.0.0 |
| 6 | Desafio Automotivo | Corrida | 23.3 MB | 1.0.0 |
| 7 | Desafio nas Alturas | Aventura | 45.7 MB | 1.0.0 |
| 8 | Fazendinha | Simulação | 8.7 MB | 1.0.0 |
| 9 | Labirinto | Puzzle | 2.2 MB | 1.0.0 |
| 10 | Missão Espacial | Aventura | 16.3 MB | 1.0.0 |
| 11 | Resgate em Chamas | Ação | 14.2 MB | 1.0.0 |
| 12 | Taxi City | Simulação | 6.4 MB | 1.0.0 |
| 13 | Tesouro do Mar | Aventura | 11.6 MB | 1.0.0 |

**Total:** ~248 MB de conteúdo

---

## 🛠️ Tecnologias

### Backend
- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL 17.6)
- **Auth:** JWT + Refresh Tokens
- **Payment:** Asaas API
- **Deploy:** Render.com

### Frontend Admin
- **Framework:** React 18 + Vite
- **UI:** Material-UI v5
- **Router:** React Router v6
- **HTTP:** Axios
- **Deploy:** Vercel

### Launcher
- **Framework:** Electron 33
- **UI:** React 18 + Material-UI v5
- **Build:** Electron Builder
- **Updates:** electron-updater
- **Distribuição:** NSIS Installer (Windows)

---

## 📚 Documentação Disponível

### Guias de Deploy
- [ADMIN_PRONTO_VERCEL.md](ADMIN_PRONTO_VERCEL.md) - Deploy do admin no Vercel
- [BACKEND_PRONTO_RENDER.md](BACKEND_PRONTO_RENDER.md) - Deploy do backend no Render
- [GUIA_DEPLOY_PRODUCAO.md](GUIA_DEPLOY_PRODUCAO.md) - Guia completo de deploy
- [RESUMO_FINAL_DEPLOY.md](RESUMO_FINAL_DEPLOY.md) - Resumo executivo

### Documentação Técnica (docs/)
- [INDEX.md](docs/INDEX.md) - Índice completo
- [DEPLOY.md](docs/DEPLOY.md) - Configuração de deploy
- [ESTRUTURA_PROJETO.md](docs/ESTRUTURA_PROJETO.md) - Arquitetura
- [README_INSTALADOR.md](docs/README_INSTALADOR.md) - Sistema de instalador
- [SISTEMA_ATUALIZACOES.md](docs/SISTEMA_ATUALIZACOES.md) - Auto-update
- [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) - Configuração do banco
- [INTEGRACAO_JOGOS.md](docs/INTEGRACAO_JOGOS.md) - Como adicionar jogos
- [PROXIMOS_PASSOS.md](docs/PROXIMOS_PASSOS.md) - Roadmap

### Implementação
- [IMPLEMENTACAO_ADMIN.md](docs/IMPLEMENTACAO_ADMIN.md) - Admin panel
- [IMPLEMENTACAO_LAUNCHER.md](docs/IMPLEMENTACAO_LAUNCHER.md) - Launcher
- [PRD.md](docs/PRD.md) - Product Requirements Document
- [planejamento.md](docs/planejamento.md) - Planejamento inicial

---

## 🔐 Segurança

- ✅ **JWT Authentication** com tokens de curta duração (24h)
- ✅ **Refresh Tokens** para renovação segura (7 dias)
- ✅ **HTTPS** obrigatório em produção
- ✅ **CORS** configurado apenas para domínios autorizados
- ✅ **RLS (Row Level Security)** no Supabase
- ✅ **Rate Limiting** implementado
- ✅ **Validação de inputs** em todas as rotas
- ✅ **Checksums SHA-256** para downloads

---

## 📈 Métricas do Sistema

### Performance
- API Response Time: ~150-200ms
- Admin Load Time: ~1.2s
- Launcher Install Size: 82MB
- Database: 13 jogos + usuários

### Infraestrutura
- **Backend:** Render Free Tier (upgradeável)
- **Frontend:** Vercel Hobby (grátis)
- **Database:** Supabase Free Tier
- **CDN:** Render (arquivos estáticos)

---

## 🚀 Como Usar

### Para Usuários Finais

1. **Baixar o Launcher**
   - Acesse o site ou link de download
   - Execute o instalador `NeuroGame Launcher Setup 1.0.0.exe`
   - Siga o assistente de instalação

2. **Fazer Login**
   - Abra o NeuroGame Launcher
   - Entre com suas credenciais
   - Navegue pela biblioteca de jogos

3. **Baixar e Jogar**
   - Escolha um jogo
   - Clique em "Baixar"
   - Após download, clique em "Jogar"

### Para Administradores

1. **Acessar o Admin Panel**
   - Vá para https://neurogame-admin.vercel.app
   - Login: `admin@neurogame.com` / `Admin123`

2. **Gerenciar Jogos**
   - Menu "Jogos" → Adicionar/Editar/Excluir
   - Configure metadados, capas e downloads

3. **Gerenciar Usuários**
   - Menu "Usuários" → Ver lista
   - Editar perfis e assinaturas

---

## 🎯 Próximos Passos

### Curto Prazo
- [ ] Adicionar mais jogos ao catálogo
- [ ] Implementar sistema de emails
- [ ] Analytics e métricas de uso
- [ ] Sistema de notificações

### Médio Prazo
- [ ] Versão Mac e Linux do launcher
- [ ] Sistema de conquistas
- [ ] Modo offline melhorado
- [ ] Chat de suporte integrado

### Longo Prazo
- [ ] Marketplace de jogos
- [ ] Sistema de reviews
- [ ] API pública para desenvolvedores
- [ ] App mobile (React Native)

---

## 📞 Suporte

- **Email:** suporte@neurogame.com.br
- **Documentação:** [docs/INDEX.md](docs/INDEX.md)
- **Issues:** Reportar no sistema de gerenciamento

---

## 📝 Licença

Proprietary - © 2025 NeuroGame

---

**Sistema desenvolvido e mantido pela equipe NeuroGame**

*Última atualização: 06/10/2025*
*Status: Produção ✅*
