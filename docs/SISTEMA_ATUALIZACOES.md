# 🔄 Sistema de Atualizações NeuroGame

Este documento explica como funcionam as atualizações automáticas do launcher e dos jogos.

## 📦 Tipos de Atualização

### 1. **Atualização do Launcher** (Electron Auto-Updater)
- ✅ **Já implementado**
- Atualiza o aplicativo launcher em si
- Usa `electron-updater`
- Verifica automaticamente ao iniciar (após 5s)

### 2. **Atualização de Jogos** (Content Updater)
- ✅ **Implementado neste commit**
- Baixa novos jogos adicionados pelo admin
- Verifica a cada 30 minutos
- Atualização pode ser obrigatória

---

## 🎮 Como funciona - Atualização de Jogos

### Fluxo completo:

```
1. Admin adiciona novo jogo no painel
   └─> Jogo salvo no Supabase (tabela games)

2. Launcher verifica atualizações periodicamente
   └─> GET /api/v1/games/updates
   └─> Compara versão local vs servidor

3. Se houver novos jogos:
   └─> Dialog aparece automaticamente
   └─> Usuário clica "Baixar Agora"
   └─> Jogos são baixados e instalados
   └─> Biblioteca recarrega automaticamente
```

### Endpoints da API:

#### `GET /api/v1/games/updates`
Verifica se há novos jogos disponíveis.

**Query params:**
- `lastSyncVersion` (opcional) - Timestamp da última sincronização

**Response:**
```json
{
  "success": true,
  "data": {
    "hasUpdates": true,
    "contentVersion": 1709845200000,
    "totalGames": 15,
    "newGames": 3,
    "games": [
      {
        "id": "uuid",
        "title": "Novo Jogo",
        "description": "...",
        "download_url": "https://...",
        "file_size": 50000000
      }
    ]
  }
}
```

#### `GET /api/v1/games/manifest`
Retorna manifest completo com todos os jogos ativos.

**Response:**
```json
{
  "success": true,
  "data": {
    "manifestVersion": 1709845200000,
    "generatedAt": "2024-03-08T10:00:00Z",
    "totalGames": 15,
    "games": [
      {
        "id": "uuid",
        "title": "Jogo Exemplo",
        "version": "1.0.0",
        "downloadUrl": "https://...",
        "fileSize": 50000000,
        "checksum": "sha256hash",
        "updatedAt": "2024-03-08T09:00:00Z"
      }
    ]
  }
}
```

---

## 🛠️ Arquitetura Técnica

### Backend (`/neurogame-backend`)

**Arquivo:** `src/routes/gameRoutes.js`
- Rotas `/updates` e `/manifest`
- Calcula versão do conteúdo baseado no jogo mais recente
- Filtra apenas jogos ativos

### Frontend (`/neurogame-launcher`)

**1. Content Updater Service** (`src/services/contentUpdater.js`)
- Verifica atualizações
- Gerencia downloads
- Mantém versão local do conteúdo
- Verificação periódica (30 min)

**2. Content Update Dialog** (`src/components/ContentUpdateDialog.jsx`)
- UI para mostrar atualizações
- Barra de progresso de download
- Lista de novos jogos
- Instalação automática

**3. App Integration** (`src/App.jsx`)
- Verifica updates ao fazer login
- Inicia verificação periódica
- Mostra dialog quando há updates

---

## 🚀 Como funciona na prática

### Cenário 1: Admin adiciona novo jogo

```bash
# 1. Admin acessa painel e adiciona "Super Memória 2"
POST /api/v1/games
{
  "title": "Super Memória 2",
  "download_url": "https://storage.../super-memoria-2.zip",
  "is_active": true
}

# 2. Usuário com launcher aberto (máx 30 min depois)
# → contentUpdater.checkForUpdates() é chamado automaticamente
# → Dialog aparece: "1 novo jogo disponível!"
# → Usuário clica "Baixar Agora"
# → Jogo é baixado e instalado
# → Biblioteca recarrega com o novo jogo
```

### Cenário 2: Atualização obrigatória

Para forçar atualização obrigatória, você pode:

```javascript
// No main.js do Electron
ipcMain.on('check-forced-updates', async () => {
  const updates = await contentUpdater.checkForUpdates();

  if (updates.hasUpdates && updates.mandatory) {
    // Bloquear launcher até atualizar
    mainWindow.webContents.send('force-update', updates);
  }
});
```

---

## ⚙️ Configuração

### Storage Local

O launcher armazena:
- `contentVersion`: Timestamp da última sincronização
- `installedGames`: Array de IDs dos jogos instalados

### Verificação Periódica

```javascript
// Alterar intervalo de verificação
contentUpdater.startPeriodicCheck(60); // 60 minutos
```

### Download de Jogos

**TODO:** Implementar download real usando `electron-dl`:

```javascript
import { download } from 'electron-dl';

async downloadGame(game) {
  await download(BrowserWindow.getFocusedWindow(), game.download_url, {
    directory: app.getPath('userData') + '/games',
    onProgress: (progress) => {
      console.log(`${Math.round(progress.percent * 100)}%`);
    }
  });
}
```

---

## 📋 Checklist de Implementação

### Backend
- [x] Rota `/api/v1/games/updates`
- [x] Rota `/api/v1/games/manifest`
- [x] Cálculo de versão do conteúdo
- [ ] Adicionar campo `mandatory` nos jogos (para updates obrigatórios)
- [ ] Adicionar campo `version` na tabela games

### Frontend (Launcher)
- [x] Serviço ContentUpdater
- [x] ContentUpdateDialog component
- [x] Integração no App.jsx
- [x] Verificação periódica (30 min)
- [ ] Download real de jogos (electron-dl)
- [ ] Validação de checksum
- [ ] Retry automático em caso de erro
- [ ] Modo offline/cache

### Testes
- [ ] Teste: Admin adiciona jogo → Launcher detecta
- [ ] Teste: Download e instalação de jogo
- [ ] Teste: Update obrigatório bloqueia launcher
- [ ] Teste: Verificação periódica funciona
- [ ] Teste: Offline handling

---

## 🎯 Próximos Passos

1. **Implementar download real** com `electron-dl`
2. **Adicionar checksum validation** (SHA-256)
3. **Update obrigatório** com bloqueio de launcher
4. **Logs de download** para debugging
5. **Painel admin** mostrar estatísticas de downloads
6. **Notificação push** para avisar sobre novos jogos

---

## 🔒 Segurança

### Validação de Downloads
- [ ] Verificar checksum SHA-256
- [ ] Validar assinatura digital
- [ ] HTTPS obrigatório para downloads

### Autenticação
- [x] Todas as rotas requerem autenticação
- [x] Token JWT validado
- [x] Verificação de assinatura ativa

---

## 📊 Monitoramento

### Métricas importantes:
- Taxa de sucesso de downloads
- Tempo médio de download por jogo
- Quantidade de usuários que instalaram cada jogo
- Erros durante download/instalação

### Logs:
```javascript
[ContentUpdater] Verificando atualizações...
[ContentUpdater] 2 novos jogos disponíveis
[ContentUpdater] Baixando Super Memória 2...
[ContentUpdater] Download concluído: 50MB em 30s
[ContentUpdater] Jogo instalado com sucesso
```

---

**Última atualização:** 2025-10-04
