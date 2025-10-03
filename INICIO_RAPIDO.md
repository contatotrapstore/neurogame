# 🚀 Guia de Início Rápido - NeuroGame Platform

Este guia vai te ajudar a ter a plataforma NeuroGame rodando em **15 minutos**.

## ⚡ Pré-requisitos Rápidos

1. **Node.js 18+** → [Download](https://nodejs.org/)
2. **PostgreSQL 15+** → [Download](https://www.postgresql.org/download/)
3. **Git** → [Download](https://git-scm.com/)

## 📝 Passo a Passo

### 1️⃣ Backend (5 minutos)

```bash
# Navegar até a pasta do backend
cd neurogame-backend

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
```

**Edite o arquivo `.env`** com suas configurações do PostgreSQL:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neurogame_db
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI
```

```bash
# Criar banco de dados (Windows - abra PowerShell como Admin)
# Se usar pgAdmin, crie um banco chamado "neurogame_db" manualmente

# Executar migrações e seeds
npm run migrate
npm run seed

# Iniciar servidor
npm run dev
```

✅ Backend rodando em `http://localhost:3000`

### 2️⃣ Dashboard Admin (3 minutos)

Abra um **novo terminal**:

```bash
# Navegar até a pasta do admin
cd neurogame-admin

# Instalar dependências
npm install

# Criar arquivo .env
echo VITE_API_URL=http://localhost:3000/api/v1 > .env

# Iniciar dashboard
npm run dev
```

✅ Dashboard rodando em `http://localhost:3001`

**Acesse:** `http://localhost:3001/login`
- **Usuário:** `admin`
- **Senha:** `Admin@123456`

### 3️⃣ Launcher Desktop (3 minutos)

Abra um **novo terminal**:

```bash
# Navegar até a pasta do launcher
cd neurogame-launcher

# Instalar dependências
npm install

# Iniciar launcher
npm start
```

✅ Launcher abrirá automaticamente

**Login de teste:**
- **Usuário:** `demo`
- **Senha:** `Demo@123456`

## 🎮 Testando a Plataforma

### No Dashboard Admin:

1. Acesse `http://localhost:3001/login`
2. Faça login com `admin` / `Admin@123456`
3. Explore:
   - **Dashboard** - Estatísticas gerais
   - **Usuários** - Gerenciar usuários
   - **Jogos** - Ver 14 jogos cadastrados
   - **Planos** - 3 planos configurados
   - **Assinaturas** - Gerenciar assinaturas

### No Launcher Desktop:

1. Faça login com `demo` / `Demo@123456`
2. Veja a biblioteca de jogos
3. Clique em "Jogar" em qualquer jogo liberado
4. O jogo abrirá em tela cheia

## 🔧 Comandos Úteis

### Backend
```bash
npm run dev      # Modo desenvolvimento
npm start        # Modo produção
npm run migrate  # Rodar migrações
npm run seed     # Popular banco de dados
```

### Dashboard Admin
```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

### Launcher
```bash
npm start        # Desenvolvimento
npm run dist     # Build para distribuição
```

## ⚠️ Solução de Problemas Comuns

### Erro de conexão com banco de dados

**Problema:** `Unable to connect to the database`

**Solução:**
1. Verifique se o PostgreSQL está rodando
2. Confirme se o banco `neurogame_db` existe
3. Verifique usuário e senha no arquivo `.env`

```bash
# Windows - Verificar se PostgreSQL está rodando
Get-Service postgresql*

# Criar banco manualmente
psql -U postgres
CREATE DATABASE neurogame_db;
\q
```

### Porta já em uso

**Problema:** `Port 3000 already in use`

**Solução:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Ou altere a porta no .env
PORT=3001
```

### Erro ao instalar dependências

**Problema:** Erro ao executar `npm install`

**Solução:**
```bash
# Limpar cache do npm
npm cache clean --force

# Deletar node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### Jogos não aparecem no launcher

**Problema:** Lista de jogos vazia

**Solução:**
1. Verifique se o seed foi executado: `npm run seed` (no backend)
2. Confirme que o backend está rodando
3. Verifique a URL da API no launcher

### Login falha no Dashboard ou Launcher

**Problema:** "Invalid credentials"

**Solução:**
1. Verifique se usou as credenciais corretas
2. Confirme que o seed foi executado
3. Backend deve estar rodando

## 📊 Estrutura após instalação

```
NeuroGame/
├── neurogame-backend/
│   ├── node_modules/       ✅ Instalado
│   ├── .env                ✅ Configurado
│   └── [servidor rodando]  ✅ http://localhost:3000
│
├── neurogame-admin/
│   ├── node_modules/       ✅ Instalado
│   ├── .env                ✅ Configurado
│   └── [dev rodando]       ✅ http://localhost:3001
│
├── neurogame-launcher/
│   ├── node_modules/       ✅ Instalado
│   └── [app rodando]       ✅ Janela Electron
│
└── Jogos/                  ✅ 14 jogos prontos
```

## 🎯 Próximos Passos

Agora que tudo está funcionando:

### Para Desenvolvimento:

1. **Adicionar novo jogo:**
   - Use o Dashboard Admin → Jogos → Criar Novo
   - Ou faça POST para `/api/v1/games`

2. **Criar novo usuário:**
   - Dashboard Admin → Usuários → Criar Novo
   - Atribua uma assinatura ao usuário

3. **Modificar planos:**
   - Dashboard Admin → Planos → Editar
   - Adicione/remova jogos dos planos

### Para Produção:

1. **Deploy do Backend:**
   - Configure variáveis de ambiente em produção
   - Use PostgreSQL em servidor dedicado
   - Configure domínio e HTTPS

2. **Build do Dashboard:**
   ```bash
   cd neurogame-admin
   npm run build
   # Deploy da pasta dist/ para servidor web
   ```

3. **Build do Launcher:**
   ```bash
   cd neurogame-launcher
   npm run dist
   # Executáveis estarão em release/
   ```

## 📚 Documentação Completa

- [README.md](./README.md) - Visão geral completa
- [PRD.md](./PRD.md) - Requisitos do produto
- [Backend README](./neurogame-backend/README.md) - API detalhada
- [IMPLEMENTACAO_ADMIN.md](./IMPLEMENTACAO_ADMIN.md) - Dashboard Admin
- [IMPLEMENTACAO_LAUNCHER.md](./IMPLEMENTACAO_LAUNCHER.md) - Launcher Desktop

## 💡 Dicas

1. **Desenvolvimento simultâneo:** Deixe os 3 terminais abertos (backend, admin, launcher)
2. **Hot reload:** Alterações no código recarregam automaticamente
3. **Debug:** Use `console.log()` ou as DevTools do Electron
4. **Testes:** Crie usuários de teste no Dashboard Admin
5. **Backup:** Faça backup do banco regularmente

## 🆘 Precisa de Ajuda?

- 📖 Leia a [documentação completa](./README.md)
- 🐛 Reporte bugs criando uma issue
- 💬 Entre em contato: admin@neurogame.com

---

**Pronto!** 🎉 Sua plataforma NeuroGame está funcionando!

Agora você pode:
- ✅ Gerenciar usuários e jogos
- ✅ Configurar planos de assinatura
- ✅ Testar o launcher desktop
- ✅ Começar a desenvolver novas features

**Bom desenvolvimento!** 🚀
