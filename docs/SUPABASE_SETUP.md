# 🗄️ Guia de Configuração do Supabase - NeuroGame

Este guia mostra como configurar o Supabase para a plataforma NeuroGame.

## 📋 Pré-requisitos

- Conta no Supabase (gratuita): https://supabase.com
- Node.js 18+ instalado
- Projeto NeuroGame clonado

## 1️⃣ Criar Projeto no Supabase

### 1.1. Acessar Supabase
1. Acesse https://supabase.com
2. Faça login ou crie uma conta
3. Clique em **"New Project"**

### 1.2. Configurar Projeto
- **Name:** neurogame-platform
- **Database Password:** Crie uma senha forte (anote!)
- **Region:** Escolha a mais próxima (ex: South America - São Paulo)
- **Pricing Plan:** Free (ou Pro se necessário)
- Clique em **"Create new project"**

⏳ Aguarde 2-3 minutos enquanto o projeto é criado.

## 2️⃣ Obter Credenciais

Após o projeto ser criado:

1. Acesse **Settings** → **API** no menu lateral
2. Copie as seguintes informações:

```
Project URL: https://seu-projeto.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE:**
- `anon key` → Usar no frontend (seguro)
- `service_role key` → Usar APENAS no backend (nunca expor!)

## 3️⃣ Configurar Backend

### 3.1. Criar arquivo .env

```bash
cd neurogame-backend
cp .env.example .env
```

### 3.2. Editar .env

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Supabase Configuration
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_KEY=sua_service_role_key_aqui

### Proteja suas credenciais

- Mantenha `.env` fora do reposit�rio (j� listado no `.gitignore`)
- Gere novas chaves no Supabase se alguma tiver sido versionada
- Jamais utilize a `service_role key` em aplica��es frontend/launcher

# JWT Configuration (gerados automaticamente pelo Supabase Auth, mas manter para compatibilidade)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_token_secret_change_this
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:5174

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@neurogame.com
ADMIN_PASSWORD=Admin@123456

# Games Directory
GAMES_DIR=../Jogos
```

## 4️⃣ Criar Tabelas no Supabase

### 4.1. Acessar SQL Editor

1. No dashboard do Supabase, clique em **SQL Editor** no menu lateral
2. Clique em **"New query"**

### 4.2. Executar Schema

1. Abra o arquivo `neurogame-backend/supabase-schema.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN** (ou pressione Ctrl+Enter)

✅ Você verá a mensagem: **Success. No rows returned**

Isso criará:
- 7 tabelas (users, games, subscription_plans, etc)
- Índices para performance
- Triggers para updated_at
- Row Level Security (RLS)
- Policies de acesso

### 4.3. Verificar Tabelas Criadas

1. Clique em **Table Editor** no menu lateral
2. Você deve ver 7 tabelas:
   - `users`
   - `games`
   - `subscription_plans`
   - `user_subscriptions`
   - `plan_games`
   - `user_game_access`
   - `access_history`

## 5️⃣ Popular com Dados Iniciais (Seeds)

### 5.1. Gerar Hashes de Senha

Antes de executar o seed, precisamos gerar os hashes das senhas:

```bash
cd neurogame-backend

# Instalar dependências
npm install

# Criar script temporário para gerar hashes
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin@123456', 10, (err, hash) => console.log('Admin hash:', hash));"
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Demo@123456', 10, (err, hash) => console.log('Demo hash:', hash));"
```

Anote os hashes gerados.

### 5.2. Atualizar supabase-seeds.sql

1. Abra `neurogame-backend/supabase-seeds.sql`
2. Substitua os placeholders `$2b$10$rKvV...` pelos hashes reais:

```sql
-- Admin user
INSERT INTO users (username, email, password, full_name, is_admin, is_active) VALUES
(
  'admin',
  'admin@neurogame.com',
  '$2b$10$[SEU_HASH_ADMIN_AQUI]', -- Cole o hash do Admin@123456
  'Administrator',
  true,
  true
);

-- Demo user
INSERT INTO users (username, email, password, full_name, is_admin, is_active) VALUES
(
  'demo',
  'demo@neurogame.com',
  '$2b$10$[SEU_HASH_DEMO_AQUI]', -- Cole o hash do Demo@123456
  'Demo User',
  false,
  true
);
```

### 5.3. Executar Seeds

1. Volte ao **SQL Editor** do Supabase
2. Crie uma **New query**
3. Copie todo o conteúdo de `supabase-seeds.sql` (com os hashes atualizados)
4. Cole no SQL Editor
5. Clique em **RUN**

✅ Você verá uma tabela mostrando os counts:
```
Games: 13
Subscription Plans: 3
Plan-Game Associations: 21
Users: 2
```

### 5.4. Verificar Dados

1. Clique em **Table Editor**
2. Abra a tabela `games` → Deve mostrar 13 jogos
3. Abra a tabela `subscription_plans` → Deve mostrar 3 planos
4. Abra a tabela `users` → Deve mostrar 2 usuários (admin e demo)

## 6️⃣ Instalar Dependências do Backend

```bash
cd neurogame-backend
npm install
```

Isso instalará:
- `@supabase/supabase-js` (cliente Supabase)
- express, bcrypt, jwt, etc.

## 7️⃣ Testar Conexão

```bash
npm run dev
```

Você deve ver:

```
✅ Supabase connection established successfully.
✅ Database models synchronized
🚀 NeuroGame API Server
📍 Environment: development
🌐 Server running on http://localhost:3000
```

### 7.1. Testar Endpoint

Abra o navegador ou Postman:

```
GET http://localhost:3000/api/v1/health
```

Resposta esperada:
```json
{
  "success": true,
  "message": "NeuroGame API is running",
  "timestamp": "2025-10-02T..."
}
```

### 7.2. Testar Login

```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123456"
}
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

## 8️⃣ Configurar Row Level Security (RLS)

As policies já foram criadas pelo schema, mas você pode visualizá-las:

1. Acesse **Authentication** → **Policies** no Supabase
2. Verá policies para cada tabela:
   - Service role tem acesso total
   - Usuários autenticados têm acesso limitado aos próprios dados
   - Jogos ativos são públicos

## 9️⃣ Backup e Manutenção

### 9.1. Backup Automático

O Supabase faz backup automático diário no plano Free.

Para backup manual:
1. Acesse **Database** → **Backups**
2. Clique em **Start a backup**

### 9.2. Visualizar Logs

1. Acesse **Logs** → **Postgres Logs**
2. Veja todas as queries executadas

### 9.3. Monitorar Performance

1. Acesse **Database** → **Reports**
2. Veja gráficos de performance, queries lentas, etc.

## 🔒 Segurança

### Boas Práticas:

1. **Nunca exponha o service_role key** no frontend
2. Use **RLS (Row Level Security)** para proteger dados
3. **Rotacione keys** periodicamente (Settings → API)
4. Em produção, **limite CORS** ao seu domínio específico
5. **Monitore uso** para evitar ataques (Database → API)

### Atualizar Keys:

Se comprometer uma key:
1. Settings → API → **Reset JWT secret**
2. Atualize todos os `.env` com novas keys

## 📊 Limites do Plano Free

- **Database:** 500 MB
- **Bandwidth:** 5 GB/mês
- **API Requests:** Ilimitado
- **Edge Functions:** 500K invocações/mês
- **Auth Users:** 50,000

💡 Para produção, considere upgradar para o plano **Pro** ($25/mês).

## 🚀 Próximos Passos

1. ✅ Supabase configurado e rodando
2. ✅ Backend conectado e testado
3. ⏭️ Completar componentes do Admin Dashboard
4. ⏭️ Completar Launcher Desktop
5. ⏭️ Testar integração completa

## 🆘 Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou as keys corretas do Supabase
- Confirme que não há espaços extras no .env

### Erro: "relation 'users' does not exist"
- Execute o `supabase-schema.sql` novamente
- Verifique se está no projeto correto

### Erro ao fazer login: "Invalid credentials"
- Confirme que os hashes de senha foram gerados corretamente
- Verifique se executou o seed com os hashes corretos

### Queries lentas:
- Verifique se os índices foram criados (schema)
- Monitore em Database → Reports
- Considere adicionar índices customizados

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

**Pronto!** 🎉 Seu backend NeuroGame agora está usando Supabase como banco de dados!
