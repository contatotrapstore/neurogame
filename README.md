# NeuroGame Platform

Plataforma completa para distribuição e execução de jogos educacionais composta por três aplicações:

1. **Backend API** – Node.js/Express conectado ao Supabase (PostgreSQL gerenciado)
2. **Dashboard Admin** – React + Vite para gestão de usuários, jogos e planos
3. **Launcher Desktop** – Electron + React para os jogadores acessarem a biblioteca

A pasta `Jogos/` contém os jogos HTML5 executados pelo launcher.

## Visão geral da arquitetura

```
[Launcher (Electron/React)] <-- REST --> [Backend API (Express)] <---> [Supabase]
             ^
             |
   [Admin Dashboard (React)]
```

- Backend expõe `/api/v1` com autenticação JWT e guarda estado no Supabase
- Admin dashboard consome a API para CRUD de jogos, usuários e assinaturas
- Launcher consome a mesma API e carrega os jogos HTML5 da pasta local `Jogos/`

## Requisitos

- Node.js 18+
- Conta Supabase (Free tier suficiente)
- Git / npm

## Passo a passo rápido

1. **Clonar o repositório**
   ```bash
   git clone <repo>
   cd NeuroGame
   ```

2. **Configurar Supabase**
   - Criar projeto no Supabase
   - Executar `supabase-schema.sql` e `supabase-seeds.sql` via SQL Editor
   - Copiar `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`

3. **Backend** (`neurogame-backend`)
   ```bash
   cp .env.example .env
   # Preencher credenciais Supabase + chaves JWT
   npm install
   npm run dev
   ```
   - API: `http://localhost:3000/api/v1`
   - Jogos estáticos: `http://localhost:3000/games/<pasta>`

4. **Admin** (`neurogame-admin`)
   ```bash
   cp .env.example .env   # API base default já aponta para http://localhost:3000/api/v1
   npm install
   npm run dev
   ```
   - Interface: `http://localhost:3001`
   - Login padrão: `admin / Admin@123456`

5. **Launcher** (`neurogame-launcher`)
   ```bash
   npm install
   npm run dev
   ```
   - Renderer em `http://localhost:5174`
   - Janela Electron abre automaticamente
   - Login padrão: `demo / Demo@123456`
   - Jogos esperados em `../Jogos/<folder>/index.html`

## Estrutura do repositório

```
NeuroGame/
+- neurogame-backend/
¦  +- src/
¦  +- supabase-schema.sql
¦  +- supabase-seeds.sql
+- neurogame-admin/
¦  +- src/
+- neurogame-launcher/
¦  +- src/
+- Jogos/
¦  +- autorama/
¦  +- balao/
¦  +- ... (14 jogos)
+- docs (*.md)
```

## Documentação útil

- `SUPABASE_SETUP.md` – passo a passo completo de configuração do Supabase
- `IMPLEMENTACAO_ADMIN.md` – descrição do dashboard admin
- `IMPLEMENTACAO_LAUNCHER.md` – descrição do launcher Electron
- `INICIO_RAPIDO.md` – visão geral do fluxo de inicialização
- `SOLUCAO_LAUNCHER.md` e `INICIAR_LAUNCHER_COMPLETO.md` – troubleshooting do launcher

## Próximos passos sugeridos

- Configurar CI/CD para publicar o backend e o dashboard
- Adicionar testes automatizados (unitários e end-to-end)
- Implementar rotina de auto-update no launcher
- Integrar pagamentos para planos de assinatura

## Licença

MIT
