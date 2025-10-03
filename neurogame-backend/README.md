# NeuroGame Backend API

Backend API para a plataforma NeuroGame - Sistema de distribuição de jogos educacionais.

## 🚀 Tecnologias

- Node.js 18+
- Express.js
- PostgreSQL 15+
- Sequelize ORM
- JWT Authentication
- Bcrypt para criptografia

## 📦 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados PostgreSQL

Certifique-se de ter o PostgreSQL instalado e rodando. Crie um banco de dados:

```sql
CREATE DATABASE neurogame_db;
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neurogame_db
DB_USER=postgres
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_REFRESH_SECRET=sua_refresh_secret_aqui

# Admin
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@neurogame.com
ADMIN_PASSWORD=Admin@123456
```

### 4. Executar migrações

```bash
npm run migrate
```

### 5. Popular banco de dados com dados iniciais

```bash
npm run seed
```

Isso criará:
- 1 usuário admin
- 1 usuário demo
- 13 jogos
- 3 planos de assinatura

## 🎮 Executar

### Modo desenvolvimento

```bash
npm run dev
```

### Modo produção

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação (`/api/v1/auth`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/register` | Registrar novo usuário | Não |
| POST | `/login` | Login de usuário | Não |
| POST | `/refresh-token` | Renovar token | Não |
| GET | `/profile` | Obter perfil do usuário | Sim |
| POST | `/logout` | Logout | Sim |

### Jogos (`/api/v1/games`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/` | Listar todos os jogos | Sim |
| GET | `/user/games` | Jogos acessíveis ao usuário | Sim |
| GET | `/:id` | Obter jogo por ID | Sim |
| GET | `/:id/validate` | Validar acesso ao jogo | Sim |
| GET | `/categories` | Listar categorias | Sim |
| POST | `/` | Criar novo jogo | Admin |
| PUT | `/:id` | Atualizar jogo | Admin |
| DELETE | `/:id` | Deletar jogo | Admin |

### Usuários (`/api/v1/users`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/` | Listar todos os usuários | Admin |
| GET | `/:id` | Obter usuário por ID | Admin |
| POST | `/` | Criar novo usuário | Admin |
| PUT | `/:id` | Atualizar usuário | Admin |
| DELETE | `/:id` | Deletar usuário | Admin |
| POST | `/game-access` | Conceder acesso a jogo | Admin |
| DELETE | `/:userId/game-access/:gameId` | Revogar acesso | Admin |
| GET | `/:id/history` | Histórico de acessos | Admin |

### Assinaturas (`/api/v1/subscriptions`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/plans` | Listar planos | Não |
| GET | `/plans/:id` | Obter plano por ID | Não |
| GET | `/user/:userId` | Assinatura do usuário | Sim |
| POST | `/plans` | Criar plano | Admin |
| PUT | `/plans/:id` | Atualizar plano | Admin |
| DELETE | `/plans/:id` | Deletar plano | Admin |
| GET | `/` | Listar assinaturas | Admin |
| POST | `/assign` | Atribuir assinatura | Admin |
| PUT | `/:id/cancel` | Cancelar assinatura | Admin |

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123456"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Usar token nas requisições

Inclua o token no header `Authorization`:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Testes

```bash
npm test
```

## 📊 Estrutura do Banco de Dados

### Users
- id (UUID)
- username
- email
- password (hash)
- full_name
- is_active
- is_admin
- last_login

### Games
- id (UUID)
- name
- slug
- description
- cover_image
- folder_path
- category
- is_active
- order

### SubscriptionPlans
- id (UUID)
- name
- description
- price
- duration_days
- features (JSONB)
- is_active

### UserSubscriptions
- id (UUID)
- user_id
- plan_id
- start_date
- end_date
- is_active
- auto_renew

### PlanGames (Many-to-Many)
- plan_id
- game_id

### UserGameAccess (Individual access)
- user_id
- game_id
- granted_at
- expires_at
- granted_by

### AccessHistory
- id (UUID)
- user_id
- game_id
- accessed_at
- session_duration
- ip_address

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia em modo desenvolvimento com nodemon
- `npm run migrate` - Executa migrações do banco
- `npm run seed` - Popula banco com dados iniciais
- `npm test` - Executa testes

## 📝 Credenciais Padrão

### Admin
- **Username:** admin
- **Password:** Admin@123456

### Demo
- **Username:** demo
- **Password:** Demo@123456

⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

## 🛡️ Segurança

- Senhas criptografadas com bcrypt (10 salt rounds)
- JWT com expiração de 24h
- Refresh tokens com expiração de 7 dias
- Rate limiting (100 requisições por 15 minutos)
- CORS configurável
- Helmet.js para headers de segurança
- Validação de inputs com express-validator

## 📄 Licença

MIT

## 👥 Suporte

Para suporte, entre em contato através de: admin@neurogame.com
