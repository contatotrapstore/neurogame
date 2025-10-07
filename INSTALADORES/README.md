# 📦 Instaladores do NeuroGame Launcher

## ℹ️ Sobre esta Pasta

Os instaladores `.exe` do NeuroGame Launcher **não estão versionados no Git** devido ao tamanho (>260MB cada).

## 📥 Como Obter os Instaladores

### Opção 1: Compilar Localmente
```bash
cd neurogame-launcher
npm run build:win
```

O instalador será gerado em: `neurogame-launcher/dist-electron/`

### Opção 2: GitHub Releases (Recomendado para Produção)
Os instaladores oficiais serão disponibilizados nas [Releases do GitHub](https://github.com/GouveiaZx/NeuroGame/releases).

## 📋 Arquivos Nesta Pasta

### ✅ Versionados no Git:
- `README.md` - Este arquivo
- `LEIA-ME.txt` - Instruções para usuários finais

### ❌ NÃO Versionados (muito grandes):
- `NeuroGame Launcher Setup 1.0.5.exe` - 262MB (com 13 jogos embedados)

## 🚀 Versões Disponíveis

### v1.0.5 (Mais Recente) ⭐
- ✅ **262MB** - Inclui 13 jogos embedados no instalador
- ✅ Download com **axios + fs streams** (sem electron-dl)
- ✅ Extração com **extract-zip v2.0.1**
- ✅ Jogos salvos em **%APPDATA%/neurogame-launcher/Jogos**
- ✅ Sem necessidade de permissões de administrador
- ✅ 100% CommonJS compatível (sem módulos ESM)
- ✅ Conecta automaticamente ao backend: `https://neurogame.onrender.com/api/v1`

### Histórico de Versões

| Versão | Tamanho | Mudanças Principais | Data |
|--------|---------|---------------------|------|
| 1.0.5  | 262MB   | Axios download, userData path, 13 jogos embedados | 2025-10-07 |
| 1.0.4  | 83MB    | Melhorias gerais | 2025-10-07 |
| 1.0.3  | 83MB    | Sistema auto-update | 2025-10-07 |
| 1.0.2  | 83MB    | Correções de bugs | 2025-10-06 |
| 1.0.1  | 82MB    | Backend produção | 2025-10-06 |
| 1.0.0  | 82MB    | Versão inicial | 2025-10-06 |

## 📝 Como Gerar Nova Versão

1. **Atualizar versão no package.json:**
   ```json
   "version": "1.0.6"
   ```

2. **Limpar builds anteriores:**
   ```bash
   cd neurogame-launcher
   rm -rf dist dist-electron node_modules
   npm install
   ```

3. **Compilar:**
   ```bash
   npm run build:win
   ```

4. **Copiar para INSTALADORES:**
   ```bash
   cp "dist-electron/NeuroGame Launcher Setup 1.0.6.exe" ../INSTALADORES/
   ```

5. **Criar GitHub Release:**
   - Vá em [Releases](https://github.com/GouveiaZx/NeuroGame/releases)
   - Click em "Draft a new release"
   - Tag: `v1.0.6`
   - Anexe o arquivo `.exe`
   - Publish release

## 🏗️ Arquitetura do Launcher v1.0.5

### Sistema de Download
```
Usuario clica "Jogar"
  ↓
Verifica se jogo existe em %APPDATA%/Jogos
  ↓
Se não existe:
  1. Download com axios (stream)
  2. Salva ZIP em %TEMP%/neurogame-downloads
  3. Extrai com extract-zip para %APPDATA%/Jogos/{nome-jogo}
  4. Remove ZIP temporário
  5. Carrega jogo no webview
```

### Estrutura de Pastas
```
C:\Users\{usuario}\AppData\Roaming\
  └─ neurogame-launcher\
      ├─ config.json (electron-store)
      └─ Jogos\
          ├─ autorama\
          ├─ balao\
          ├─ batalha-de-tanques\
          └─ ... (outros jogos)
```

## 🔧 Dependências Principais

```json
{
  "axios": "^1.6.8",          // Download de arquivos
  "electron-store": "^8.2.0", // Armazenamento local
  "extract-zip": "^2.0.1",    // Extração de ZIPs
  "@mui/material": "^5.15.15" // Interface UI
}
```

**Nota:** Todas as dependências são **CommonJS** - sem módulos ESM!

## 📊 Informações Técnicas

### Conteúdo do Instalador
- Electron Runtime: ~150MB
- Interface React + MUI: ~10MB
- 13 Jogos (ZIPs): ~102MB
- **Total:** 262MB

### Performance
- Instalação: ~30-60s (depende do disco)
- Download de jogo: Limitado pela conexão
- Extração de jogo: 2-5s por jogo
- Inicialização: < 3s

### Requisitos do Sistema
- **OS:** Windows 7 SP1 ou superior
- **RAM:** 2GB mínimo (4GB recomendado)
- **Disco:** 500MB livres + espaço para jogos
- **Conexão:** Para download de jogos

## 💡 Resolução de Problemas

### "Erro ERR_REQUIRE_ESM"
✅ **Resolvido na v1.0.5** - Removido electron-dl (ESM) e substituído por axios (CommonJS)

### "EPERM: operation not permitted"
✅ **Resolvido na v1.0.5** - Jogos agora são salvos em %APPDATA% ao invés de Program Files

### "Game não baixa"
- Verificar conexão com internet
- Verificar se backend está online: https://neurogame.onrender.com/api/v1/health
- Verificar espaço em disco

## 🚀 Deploy

### Para Staging/Testing
```bash
npm run build:win
# Teste o instalador localmente
```

### Para Produção
1. Incrementar versão em `package.json`
2. Limpar e rebuild completo
3. Testar instalador em máquina limpa
4. Upload para GitHub Releases
5. Atualizar links de download

## 📞 Suporte

- **Documentação:** [docs/FUNCIONAMENTO_LAUNCHER.md](../docs/FUNCIONAMENTO_LAUNCHER.md)
- **Issues:** [GitHub Issues](https://github.com/GouveiaZx/NeuroGame/issues)

---

**Última atualização: 07/10/2025**
**Versão Atual: 1.0.5**
**Status: Produção ✅**
