# 📚 Documentação do NeuroGame

Índice completo da documentação da plataforma NeuroGame em produção.

---

## 🌐 URLs de Produção

- **Backend API:** https://neurogame.onrender.com
- **Admin Panel:** https://neurogame-admin.vercel.app
- **Database:** Supabase (btsarxzpiroprpdcrpcx)

---

## 🚀 Guias de Deploy

### Produção Atual
- **[../ADMIN_PRONTO_VERCEL.md](../ADMIN_PRONTO_VERCEL.md)** ✅ - Admin deployado no Vercel
- **[../BACKEND_PRONTO_RENDER.md](../BACKEND_PRONTO_RENDER.md)** ✅ - Backend deployado no Render
- **[../RESUMO_FINAL_DEPLOY.md](../RESUMO_FINAL_DEPLOY.md)** ✅ - Resumo executivo do deploy
- **[../GUIA_DEPLOY_PRODUCAO.md](../GUIA_DEPLOY_PRODUCAO.md)** ✅ - Guia completo passo a passo

### Configuração
- **[DEPLOY.md](DEPLOY.md)** - Guia geral de deploy
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Configuração do banco de dados

---

## 📦 Sistema de Distribuição

### Instalador e Launcher
- **[README_INSTALADOR.md](README_INSTALADOR.md)** ✅ - Sistema de instalador Windows
- **[SISTEMA_ATUALIZACOES.md](SISTEMA_ATUALIZACOES.md)** ✅ - Auto-update do launcher
- **[IMPLEMENTACAO_LAUNCHER.md](IMPLEMENTACAO_LAUNCHER.md)** - Detalhes técnicos

### Jogos
- **[INTEGRACAO_JOGOS.md](INTEGRACAO_JOGOS.md)** - Como adicionar novos jogos
- **Status:** 13 jogos cadastrados com downloads configurados

---

## 🏗️ Arquitetura e Estrutura

### Planejamento
- **[PRD.md](PRD.md)** - Product Requirements Document
- **[planejamento.md](planejamento.md)** - Planejamento inicial do projeto
- **[ESTRUTURA_PROJETO.md](ESTRUTURA_PROJETO.md)** - Estrutura de pastas

### Implementação
- **[IMPLEMENTACAO_ADMIN.md](IMPLEMENTACAO_ADMIN.md)** - Painel administrativo
- **[IMPLEMENTACAO_LAUNCHER.md](IMPLEMENTACAO_LAUNCHER.md)** - Launcher desktop

---

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- JWT + Refresh Tokens
- Login/Registro de usuários
- Proteção de rotas
- Session validation

### ✅ Sistema de Jogos
- Catálogo com 13 jogos
- Downloads via URL (Render CDN)
- Checksums SHA-256
- Instalação automática
- Proteção por assinatura

### ✅ Painel Administrativo
- CRUD de jogos
- Gerenciamento de usuários
- Controle de assinaturas
- Dashboard com métricas
- Aprovação de solicitações

### ✅ Launcher Desktop
- Interface Material-UI
- Biblioteca de jogos offline
- Auto-atualização (electron-updater)
- Download/instalação de jogos
- Sistema de proteção

### ✅ Infraestrutura
- Backend: Render.com
- Frontend: Vercel
- Database: Supabase PostgreSQL
- CDN: Render (arquivos estáticos)

---

## 📊 Status do Sistema

| Componente | Status | URL/Info |
|------------|--------|----------|
| Backend API | ✅ Online | https://neurogame.onrender.com |
| Admin Panel | ✅ Online | https://neurogame-admin.vercel.app |
| Database | ✅ Ativo | Supabase sa-east-1 |
| Launcher | ✅ Pronto | Instalador 82MB |
| Jogos | ✅ 13 jogos | ~248MB total |

---

## 🔗 Links Úteis

### Repositórios (Estrutura Local)
```
NeuroGame/
├── neurogame-backend/      # API Node.js + Express
├── neurogame-admin/        # React + Vite + MUI
├── neurogame-launcher/     # Electron + React
├── docs/                   # Documentação
└── INSTALADORES/           # Builds do launcher
```

### Documentos de Referência
- **[../README.md](../README.md)** - Documentação principal
- **[PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md)** - Roadmap e melhorias

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js 18 + Express
- Supabase (PostgreSQL 17.6)
- JWT Authentication
- Asaas Payment Gateway

### Frontend
- React 18 + Vite
- Material-UI v5
- React Router v6
- Axios

### Desktop
- Electron 33
- electron-builder
- electron-updater
- NSIS Installer

---

## 📋 Roadmap

### Curto Prazo
- [ ] Sistema de emails (SendGrid/Mailgun)
- [ ] Analytics (Google Analytics)
- [ ] Mais jogos no catálogo
- [ ] Melhorias de UX

### Médio Prazo
- [ ] Launcher para Mac/Linux
- [ ] Sistema de conquistas
- [ ] Modo offline aprimorado
- [ ] Chat de suporte

### Longo Prazo
- [ ] Marketplace de jogos
- [ ] API pública
- [ ] App mobile
- [ ] Sistema de reviews

Veja [PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md) para mais detalhes.

---

## 📝 Convenções de Documentação

### Nomenclatura
- `README_*.md` - Resumos executivos
- `GUIA_*.md` - Tutoriais passo a passo
- `SISTEMA_*.md` - Arquitetura de sistemas
- `IMPLEMENTACAO_*.md` - Detalhes técnicos
- `*_PRONTO_*.md` - Status de deploy

### Status
- ✅ Implementado e em produção
- 🔄 Em desenvolvimento
- 📝 Planejado
- ⏳ Aguardando

---

## 🔐 Credenciais de Acesso

### Admin Panel
- **URL:** https://neurogame-admin.vercel.app
- **Email:** admin@neurogame.com
- **Senha:** Admin123

### Supabase
- **Project ID:** btsarxzpiroprpdcrpcx
- **Região:** sa-east-1 (São Paulo)
- **URL:** https://btsarxzpiroprpdcrpcx.supabase.co

---

## 📞 Suporte

- **Documentação:** Este diretório
- **Email:** suporte@neurogame.com.br
- **Issues:** Sistema de gerenciamento interno

---

**Última atualização:** 06/10/2025
**Status:** ✅ Produção
**Versão:** 1.0.0

**Desenvolvido pela equipe NeuroGame**
