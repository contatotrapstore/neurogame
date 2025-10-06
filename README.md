# 🎮 NeuroGame - Plataforma de Jogos com Assinatura

Sistema completo de distribuição e gerenciamento de jogos com launcher desktop, painel administrativo e sistema de assinaturas.

---

## 🔐 Acesso Rápido

**📋 Credenciais Admin:**
- **Email:** `admin@neurogame.com`
- **Senha:** `Admin123`
- **URL:** http://localhost:3001

**📚 Documentação:** [ACESSO_RAPIDO.md](ACESSO_RAPIDO.md) | [STATUS_ATUAL.md](STATUS_ATUAL.md) | [docs/INDEX.md](docs/INDEX.md)

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+
- npm 8+
- Conta Supabase (banco de dados)

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Backend
cd neurogame-backend
npm install
cp .env.example .env
# Editar .env com credenciais do Supabase

# 3. Admin Panel
cd ../neurogame-admin
npm install

# 4. Launcher
cd ../neurogame-launcher
npm install
```

### Executar em Desenvolvimento

```bash
# Terminal 1 - Backend (localhost:3000)
cd neurogame-backend && npm run dev

# Terminal 2 - Admin (localhost:3001)
cd neurogame-admin && npm run dev

# Terminal 3 - Launcher (Electron)
cd neurogame-launcher && npm run dev
```

## 📂 Estrutura

```
NeuroGame/
├── neurogame-backend/    # API REST (Node.js + Express)
├── neurogame-admin/      # Painel Admin (React + Vite + MUI)
├── neurogame-launcher/   # Launcher Desktop (Electron + React)
├── TESTES_FINAIS.md      # Relatório de testes realizados
└── README.md             # Este arquivo
```

## ✨ Funcionalidades

### 🎮 Launcher Desktop
- Interface moderna com Material-UI
- Biblioteca de jogos com capas locais (offline)
- Download e instalação automática
- Sistema de auto-atualização
- Proteção por assinatura
- Solicitação de novos jogos

### 🔧 Painel Administrativo
- Gerenciamento de usuários
- CRUD de jogos
- Controle de assinaturas e planos
- Aprovação de solicitações
- Dashboard com métricas

### 💳 Sistema de Assinaturas
- Autenticação JWT + Refresh Token
- Integração com Asaas (gateway de pagamento)
- Proteção de conteúdo por assinatura
- Webhooks de pagamento
- 3 planos: Básico, Premium, Educacional

## 🛠️ Tecnologias

**Backend**
- Node.js + Express
- Supabase (PostgreSQL)
- JWT Authentication
- Asaas API

**Frontend Admin**
- React 18
- Material-UI v5
- React Router v6
- Axios

**Launcher**
- Electron 28
- React 18
- Material-UI v5
- electron-updater

## 📊 Status Atual (04/10/2025)

✅ **100% Funcional em Desenvolvimento**

- ✅ Sistema de autenticação
- ✅ CRUD de assinaturas
- ✅ 13 jogos cadastrados
- ✅ 14 capas locais offline
- ✅ Launcher Electron operacional
- ✅ Painel admin completo
- ✅ Migrations Supabase aplicadas
- ✅ Sistema de proteção de jogos

Ver [TESTES_FINAIS.md](TESTES_FINAIS.md) para detalhes dos testes.

## 🔐 Credenciais de Teste

**Admin**
- Email: `admin@neurogame.com`
- Senha: `Admin@123456`

## 🎯 Próximos Passos

1. **Configurar Produção**
   - Adicionar chaves reais do Asaas no `.env`
   - Configurar domínio e SSL

2. **Build e Deploy**
   ```bash
   # Launcher
   cd neurogame-launcher && npm run build

   # Admin
   cd neurogame-admin && npm run build

   # Backend (Vercel)
   vercel --prod
   ```

3. **Testes Pendentes**
   - [ ] Download completo de jogos
   - [ ] Validação de checksums
   - [ ] Auto-update em produção
   - [ ] Webhooks Asaas real

## 📚 Documentação

- **[TESTES_FINAIS.md](TESTES_FINAIS.md)** - Relatório de testes e status
- **Backend**: `/neurogame-backend/README.md`
- **Admin**: `/neurogame-admin/README.md`
- **Launcher**: `/neurogame-launcher/README.md`

## 🎮 Jogos Disponíveis (13)

1. Autorama (Corrida)
2. Balão (Aventura)
3. Batalha de Tanques (Ação)
4. Correndo pelos Trilhos (Corrida)
5. Desafio Aéreo (Simulação)
6. Desafio Automotivo (Corrida)
7. Desafio nas Alturas (Aventura)
8. Fazendinha (Simulação)
9. Labirinto (Puzzle)
10. Missão Espacial (Aventura)
11. Resgate em Chamas (Ação)
12. Taxi City (Simulação)
13. Tesouro do Mar (Aventura)

## 📝 Licença

MIT License - Livre para uso comercial e pessoal.

---

**Desenvolvido pela equipe NeuroGame**

*Última atualização: 04/10/2025*
