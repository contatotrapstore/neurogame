# 🎮 NeuroGame - Plataforma de Jogos com Assinatura

Sistema completo de distribuição e gerenciamento de jogos com launcher desktop, painel administrativo e sistema de assinaturas.

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+
- npm 8+
- Supabase (banco de dados)

### Instalação

```bash
# 1. Clonar repositório
git clone [url-do-repositorio]
cd NeuroGame

# 2. Instalar dependências do backend
cd neurogame-backend
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 4. Instalar dependências do admin
cd ../neurogame-admin
npm install

# 5. Instalar dependências do launcher
cd ../neurogame-launcher
npm install
```

### Executar em Desenvolvimento

```bash
# Terminal 1 - Backend
cd neurogame-backend
npm run dev

# Terminal 2 - Admin Panel
cd neurogame-admin
npm run dev

# Terminal 3 - Launcher
cd neurogame-launcher
npm run dev
```

---

## 📦 Estrutura do Projeto

```
NeuroGame/
├── neurogame-backend/       # API Backend (Node.js + Express)
├── neurogame-admin/         # Painel Admin (React + Vite)
├── neurogame-launcher/      # Launcher Desktop (Electron + React)
├── docs/                    # Documentação completa
├── release.js               # Script de automação de releases
└── package.json             # Dependências do projeto
```

---

## ✨ Funcionalidades

### 🎮 Launcher Desktop
- ✅ Interface moderna e intuitiva
- ✅ Biblioteca de jogos
- ✅ Download e instalação automática
- ✅ Sistema de auto-atualização
- ✅ Proteção por assinatura
- ✅ Solicitação de novos jogos

### 👨‍💼 Painel Administrativo
- ✅ Gerenciamento de usuários
- ✅ Gerenciamento de jogos
- ✅ Controle de assinaturas
- ✅ Aprovação de solicitações
- ✅ Dashboard com métricas

### 🔐 Sistema de Assinaturas
- ✅ Autenticação JWT
- ✅ Integração Asaas/Stripe
- ✅ Proteção de conteúdo
- ✅ Heartbeat de validação
- ✅ Webhooks de pagamento

### 📦 Sistema de Distribuição
- ✅ Instalador profissional (NSIS)
- ✅ Auto-atualização automática
- ✅ Versionamento semântico
- ✅ Release management
- ✅ Suporte multiplataforma

---

## 📚 Documentação

Toda a documentação está organizada na pasta [`docs/`](docs/):

### 🚀 Para Começar
- **[📖 Índice Completo](docs/INDEX.md)** - Navegação por toda documentação
- [Início Rápido](docs/INICIO_RAPIDO.md)
- [Iniciar Launcher Completo](docs/INICIAR_LAUNCHER_COMPLETO.md)
- [Deploy em Produção](docs/DEPLOY.md)

### 🔄 Sistemas
- **[Sistema de Atualizações](docs/SISTEMA_ATUALIZACOES.md)** - Auto-updates de launcher e jogos
- [Sistema de Instalador](docs/README_INSTALADOR.md)
- [Integração de Jogos](docs/INTEGRACAO_JOGOS.md)

### 🏗️ Arquitetura
- [PRD - Product Requirements](docs/PRD.md)
- [Planejamento](docs/planejamento.md)
- [Implementação Launcher](docs/IMPLEMENTACAO_LAUNCHER.md)
- [Implementação Admin](docs/IMPLEMENTACAO_ADMIN.md)
- [Solução Técnica](docs/SOLUCAO_LAUNCHER.md)

### 🚢 Deploy
- [Backend no Vercel](neurogame-backend/DEPLOY_VERCEL.md)
- [Admin no Vercel](neurogame-admin/DEPLOY_VERCEL.md)

### 🔧 Configuração
- [Setup Supabase](docs/SUPABASE_SETUP.md)
- [Próximos Passos](docs/PROXIMOS_PASSOS.md)

---

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- JWT Authentication
- Asaas API (Pagamentos)

### Frontend Admin
- React 18
- Material-UI
- React Router
- Axios

### Launcher
- Electron
- React 18
- Material-UI
- electron-updater

---

## 📥 Criar Instalador

### Primeira vez

```bash
# 1. Adicionar ícones em neurogame-launcher/build/
#    - icon.ico (Windows)
#    - icon.icns (macOS)
#    - icon.png (Linux)

# 2. Criar release
node release.js build
```

### Atualizações

```bash
# Bug fix (1.0.0 → 1.0.1)
node release.js build patch

# Nova feature (1.0.0 → 1.1.0)
node release.js build minor

# Breaking change (1.0.0 → 2.0.0)
node release.js build major
```

**Instalador gerado em:** `neurogame-backend/releases/`

---

## 🔄 Auto-Atualização

O launcher verifica automaticamente por atualizações:

1. **Ao iniciar** (após 5 segundos)
2. **Backend serve** metadata em `/api/v1/downloads/latest.yml`
3. **Download** em background com progresso
4. **Instalação** automática com reinicialização

---

## 🚢 Deploy

### Backend
```bash
cd neurogame-backend
npm install --production
npm start
```

### Admin Panel
```bash
cd neurogame-admin
npm run build
# Deploy pasta dist/ em servidor web
```

### Launcher
```bash
node release.js build
# Distribuir instalador gerado
```

Ver [DEPLOY.md](docs/DEPLOY.md) para detalhes completos.

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 🔗 Links

- **Documentação Completa:** [`docs/INDEX.md`](docs/INDEX.md)
- **Issues:** [GitHub Issues](#)
- **Suporte:** suporte@neurogame.com
- **Discord:** discord.gg/neurogame

---

## 📊 Status do Projeto

- ✅ Sistema de autenticação
- ✅ Sistema de assinaturas
- ✅ Launcher funcional
- ✅ Painel administrativo
- ✅ Sistema de instalador
- ✅ Auto-atualização
- ✅ Solicitações de jogos
- 🔄 Multiplayer (em desenvolvimento)
- 📝 Mobile app (planejado)

---

**Desenvolvido com ❤️ pela equipe NeuroGame**

*Última atualização: 04/10/2025*
