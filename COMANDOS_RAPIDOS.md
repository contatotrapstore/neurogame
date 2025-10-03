# ⚡ Comandos Rápidos - NeuroGame

## 🎯 COMEÇAR AGORA

### 1. Configurar Supabase (15 min)

```bash
# 1. Criar projeto em https://supabase.com
# 2. Copiar URL e keys
# 3. Executar no SQL Editor:
#    - supabase-schema.sql (criar tabelas)
#    - supabase-seeds.sql (popular dados)
```

### 2. Gerar Hashes de Senha (2 min)

```bash
cd neurogame-backend
npm install bcrypt
node generate-password-hashes.js
# Copiar hashes e colar em supabase-seeds.sql antes de executar
```

### 3. Configurar Backend (5 min)

```bash
cd neurogame-backend

# Criar .env
cp .env.example .env

# Editar .env:
# SUPABASE_URL=https://seu-projeto.supabase.co
# SUPABASE_ANON_KEY=sua_anon_key
# SUPABASE_SERVICE_KEY=sua_service_key

# Instalar dependências
npm install

# Iniciar servidor
npm run dev
```

**Testar:** http://localhost:3000/api/v1/health

---

## 🔧 COMPLETAR COMPONENTES

### Admin Dashboard (2-3h)

```bash
cd neurogame-admin

# Copiar código de IMPLEMENTACAO_ADMIN.md para:
# - src/App.jsx
# - src/components/Layout.jsx
# - src/components/ProtectedRoute.jsx
# - src/pages/Login.jsx
# - src/pages/Dashboard.jsx
# - src/pages/Users.jsx
# - src/pages/Games.jsx
# - src/pages/Plans.jsx
# - src/pages/Subscriptions.jsx

npm install
npm run dev
```

**Acesso:** http://localhost:3001
**Login:** admin / Admin@123456

### Launcher Desktop (2-3h)

```bash
cd neurogame-launcher

# Copiar código de IMPLEMENTACAO_LAUNCHER.md para:
# - package.json
# - electron.js
# - src/App.jsx
# - src/components/Login.jsx
# - src/components/GameLibrary.jsx
# - src/components/GameCard.jsx
# - src/components/GamePlayer.jsx
# - src/services/api.js
# - src/*.css

npm install
npm start
```

**Login:** demo / Demo@123456

---

## 🧪 TESTAR TUDO

### Backend

```bash
cd neurogame-backend
npm run dev

# Testar endpoints:
curl http://localhost:3000/api/v1/health
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123456"}'
```

### Admin Dashboard

```bash
cd neurogame-admin
npm run dev
# Acessar: http://localhost:3001/login
```

### Launcher

```bash
cd neurogame-launcher
npm start
# Janela Electron abrirá automaticamente
```

---

## 📦 BUILD PARA PRODUÇÃO

### Admin Dashboard

```bash
cd neurogame-admin
npm run build
# Output: dist/

# Deploy no Vercel:
npm install -g vercel
vercel --prod
```

### Launcher Desktop

```bash
cd neurogame-launcher
npm run dist
# Output: release/
# - Windows: .exe
# - macOS: .dmg
# - Linux: .AppImage
```

### Backend (Heroku)

```bash
cd neurogame-backend

# Login Heroku
heroku login
heroku create neurogame-api

# Configurar variáveis
heroku config:set SUPABASE_URL=sua_url
heroku config:set SUPABASE_SERVICE_KEY=sua_key
# ... outras variáveis

# Deploy
git push heroku main
```

---

## 🔍 COMANDOS ÚTEIS

### Ver logs do backend

```bash
# Desenvolvimento
tail -f logs/app.log

# Heroku
heroku logs --tail
```

### Ver tabelas no Supabase

```sql
-- No SQL Editor do Supabase:

-- Ver usuários
SELECT * FROM users;

-- Ver jogos
SELECT * FROM games;

-- Ver assinaturas
SELECT u.username, sp.name, us.end_date
FROM user_subscriptions us
JOIN users u ON us.user_id = u.id
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE us.is_active = true;

-- Ver jogos de um plano
SELECT sp.name, g.name as game_name
FROM plan_games pg
JOIN subscription_plans sp ON pg.plan_id = sp.id
JOIN games g ON pg.game_id = g.id
ORDER BY sp.name, g.name;
```

### Resetar banco de dados

```bash
# No SQL Editor do Supabase:
# 1. Deletar todas as tabelas
DROP TABLE IF EXISTS access_history CASCADE;
DROP TABLE IF EXISTS user_game_access CASCADE;
DROP TABLE IF EXISTS plan_games CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS users CASCADE;

# 2. Executar supabase-schema.sql novamente
# 3. Executar supabase-seeds.sql novamente
```

---

## 🆘 TROUBLESHOOTING

### Backend não conecta ao Supabase

```bash
# Verificar .env
cat neurogame-backend/.env

# Testar conexão manualmente
node -e "const {supabase} = require('./neurogame-backend/src/config/supabase'); supabase.from('users').select('count').then(console.log);"
```

### Admin Dashboard erro CORS

```bash
# Adicionar ao .env do backend:
CORS_ORIGIN=http://localhost:3001,http://localhost:5173
```

### Launcher não conecta à API

```javascript
// Verificar URL em:
// neurogame-launcher/src/services/api.js
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

### Senha inválida no Supabase

```bash
# Gerar novo hash:
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('SuaSenha', 10, (e,h) => console.log(h));"

# Atualizar no Supabase (SQL Editor):
UPDATE users SET password = 'novo_hash_aqui' WHERE username = 'admin';
```

---

## 📚 DOCUMENTAÇÃO RÁPIDA

| Preciso de... | Ver... |
|---------------|--------|
| Configurar Supabase | [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) |
| Adaptar código para Supabase | [MIGRACAO_CONTROLLERS.md](./MIGRACAO_CONTROLLERS.md) |
| Completar Admin | [IMPLEMENTACAO_ADMIN.md](./IMPLEMENTACAO_ADMIN.md) |
| Completar Launcher | [IMPLEMENTACAO_LAUNCHER.md](./IMPLEMENTACAO_LAUNCHER.md) |
| Status do projeto | [STATUS_PROJETO.md](./STATUS_PROJETO.md) |
| Próximos passos | [PROXIMOS_PASSOS.md](./PROXIMOS_PASSOS.md) |
| Instalação completa | [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) |
| Deploy | [DEPLOY.md](./DEPLOY.md) |

---

## ⚡ ATALHOS

### Iniciar tudo em paralelo (Windows)

```bash
# Terminal 1 - Backend
cd neurogame-backend && npm run dev

# Terminal 2 - Admin
cd neurogame-admin && npm run dev

# Terminal 3 - Launcher
cd neurogame-launcher && npm start
```

### Parar tudo

```bash
# Ctrl+C em cada terminal
# Ou fechar as janelas
```

---

**Comandos prontos para copiar e colar!** ⚡
