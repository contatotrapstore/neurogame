# 🎯 Próximos Passos Práticos - NeuroGame

Guia objetivo do que fazer agora para colocar o NeuroGame em produção.

## ✅ Status Atual

### Implementado e Funcionando
- ✅ Backend API completo (Node.js + Express + Supabase)
- ✅ Admin Panel completo (React + Vite + MUI)
- ✅ Launcher Desktop completo (Electron + React)
- ✅ Sistema de autenticação (email/senha)
- ✅ Sistema de assinaturas (integrado com Asaas)
- ✅ Sistema de auto-atualização do launcher
- ✅ Sistema de auto-atualização de jogos (novos jogos)
- ✅ Configuração para deploy no Vercel
- ✅ Documentação completa

### Em Desenvolvimento Local
```bash
# Tudo rodando em:
Backend:  http://localhost:3000
Admin:    http://localhost:3001
Launcher: Electron App
```

---

## 🚀 Fase 1: Deploy em Produção (Esta Semana)

### Prioridade ALTA

#### 1. Deploy do Backend no Vercel
```bash
cd neurogame-backend

# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Configurar variáveis de ambiente no dashboard
# https://vercel.com/seu-projeto/settings/environment-variables
```

**Variáveis necessárias:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `ASAAS_API_KEY` (se usar pagamentos)
- `CORS_ORIGIN` (URL do admin)

**Resultado:** API pública em `https://seu-backend.vercel.app`

---

#### 2. Deploy do Admin no Vercel
```bash
cd neurogame-admin

# 1. Criar .env com URL do backend em produção
echo "VITE_API_URL=https://seu-backend.vercel.app/api/v1" > .env

# 2. Deploy
vercel --prod

# 3. Atualizar CORS no backend
# Adicionar URL do admin em CORS_ORIGIN
```

**Resultado:** Admin em `https://seu-admin.vercel.app`

---

#### 3. Criar Instalador do Launcher
```bash
cd neurogame-launcher

# 1. Atualizar URL da API em produção
# Editar src/services/api.js para apontar para backend prod

# 2. Build
npm run build

# 3. Criar instalador
npm run dist

# Instalador gerado em: dist/
# - NeuroGame-Setup-1.0.0.exe (Windows)
# - NeuroGame-1.0.0.dmg (macOS)
# - NeuroGame-1.0.0.AppImage (Linux)
```

**Resultado:** Instalador pronto para distribuir

---

## 🔧 Fase 2: Melhorias Essenciais (Próxima Semana)

### Prioridade MÉDIA

#### 1. Download Real de Jogos
Atualmente o contentUpdater simula downloads. Implementar download real:

```javascript
// neurogame-launcher/src/services/contentUpdater.js
import { download } from 'electron-dl';

async downloadGame(game) {
  await download(BrowserWindow.getFocusedWindow(), game.download_url, {
    directory: app.getPath('userData') + '/games',
    onProgress: (progress) => {
      // Atualizar UI com progresso
    }
  });
}
```

**Dependência:**
```bash
npm install electron-dl
```

---

#### 2. Validação de Checksum
Garantir integridade dos downloads:

```javascript
async validateChecksum(filePath, expectedChecksum) {
  const hash = crypto.createHash('sha256');
  const stream = fs.createReadStream(filePath);

  return new Promise((resolve) => {
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => {
      const fileChecksum = hash.digest('hex');
      resolve(fileChecksum === expectedChecksum);
    });
  });
}
```

---

#### 3. Updates Obrigatórios
Bloquear launcher até atualizar quando necessário:

```javascript
// neurogame-launcher/main.js
if (updates.mandatory) {
  // Bloquear janela principal
  mainWindow.setClosable(false);
  mainWindow.setMinimizable(false);

  // Forçar atualização
  await contentUpdater.forceUpdate();

  // Desbloquear após atualizar
  mainWindow.setClosable(true);
  mainWindow.setMinimizable(true);
}
```

---

## 📊 Fase 3: Observabilidade (Semana 3)

### Prioridade MÉDIA

#### 1. Adicionar Sentry para Erros
```bash
npm install @sentry/electron
```

```javascript
// main.js
import * as Sentry from '@sentry/electron';

Sentry.init({
  dsn: 'https://seu-dsn@sentry.io/projeto'
});
```

#### 2. Analytics Básico
```bash
npm install @vercel/analytics
```

```jsx
// admin/src/main.jsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.render(
  <>
    <App />
    <Analytics />
  </>
);
```

---

## 🎮 Fase 4: Conteúdo e Produto (Semana 4)

### Prioridade ALTA

#### 1. Adicionar Jogos Reais
1. Preparar jogos (HTML5/executáveis)
2. Upload para storage (Vercel Blob ou S3)
3. Adicionar no admin panel
4. Testar download no launcher

#### 2. Criar Landing Page
Landing page pública para atrair usuários:
- Features do NeuroGame
- Planos e preços
- Download do launcher
- CTA para cadastro

---

## 🔒 Fase 5: Segurança (Contínuo)

### Prioridade ALTA

#### Checklist de Segurança
- [ ] Rotacionar chaves JWT periodicamente
- [ ] Habilitar 2FA para admins
- [ ] Revisar políticas RLS no Supabase
- [ ] Implementar rate limiting agressivo
- [ ] Logs de auditoria para ações críticas
- [ ] Backup automático do banco

---

## 📋 Checklist de Deploy

### Antes do Deploy
- [ ] Testar todos os fluxos localmente
- [ ] Criar usuário admin no Supabase
- [ ] Configurar webhooks do Asaas
- [ ] Preparar domínios (se houver)
- [ ] Backup do banco de dados

### Deploy Backend
- [ ] Deploy no Vercel
- [ ] Configurar variáveis de ambiente
- [ ] Testar health check
- [ ] Testar login
- [ ] Verificar logs

### Deploy Admin
- [ ] Atualizar VITE_API_URL
- [ ] Deploy no Vercel
- [ ] Testar acesso admin
- [ ] Verificar CORS

### Launcher
- [ ] Atualizar URL da API
- [ ] Build production
- [ ] Criar instalador
- [ ] Testar em máquina limpa
- [ ] Preparar CDN para distribuição

### Pós-Deploy
- [ ] Monitorar logs (primeiro dia)
- [ ] Verificar métricas
- [ ] Testar fluxo completo
- [ ] Documentar problemas encontrados

---

## 🆘 Troubleshooting Comum

### Erro: CORS bloqueado
```javascript
// Backend: Adicionar domínio do admin em CORS_ORIGIN
CORS_ORIGIN=https://admin.neurogame.com,https://neurogame.com
```

### Erro: JWT inválido
- Verificar se JWT_SECRET é o mesmo no backend
- Verificar validade do token (expiração)

### Erro: Supabase connection failed
- Verificar SUPABASE_URL e SUPABASE_ANON_KEY
- Verificar se IP do Vercel está na whitelist (se houver)

### Launcher não atualiza
- Verificar se `latest.yml` está acessível
- Verificar URL do servidor de updates
- Verificar versão no package.json

---

## 📈 Métricas de Sucesso

### Semana 1
- ✅ Backend em produção (uptime > 99%)
- ✅ Admin acessível e funcional
- ✅ 10 usuários de teste criados

### Semana 2
- ✅ 3+ jogos disponíveis
- ✅ Auto-update funcionando
- ✅ Primeiro pagamento processado

### Semana 3
- ✅ 50+ usuários ativos
- ✅ Monitoramento configurado
- ✅ Zero erros críticos

### Mês 1
- ✅ 200+ usuários
- ✅ 10+ jogos
- ✅ Sistema estável

---

## 🎯 Próxima Ação IMEDIATA

**AGORA:** Deploy do backend no Vercel

```bash
cd neurogame-backend
vercel login
vercel --prod
```

Depois disso, seguir o checklist acima na ordem.

---

**Boa sorte com o deploy! 🚀**

_Última atualização: 2025-10-04_
