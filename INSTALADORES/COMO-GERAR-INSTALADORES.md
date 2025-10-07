# 🚀 Como Gerar Instaladores Multiplataforma

## Status Atual

### ✅ Windows - PRONTO
- **Instalador:** `NeuroGame Launcher Setup 1.0.9.exe` (262 MB)
- **Auto-update:** `latest.yml` ✅
- **Testado:** ✅ Funcional

### ⏳ macOS - Precisa GitHub Actions
- **Instaladores:** `.dmg` (Intel + ARM) + `.zip`
- **Auto-update:** `latest-mac.yml` (template criado)
- **Status:** Requer build em máquina macOS

### ⏳ Linux - Precisa GitHub Actions
- **Instaladores:** `.AppImage` + `.deb`
- **Auto-update:** `latest-linux.yml` (template criado)
- **Status:** Requer build em máquina Linux

---

## 🎯 Opção 1: GitHub Actions (Recomendado)

O repositório já está configurado com workflows automáticos!

### Passos:

1. **Tag já criada:** ✅ `v1.0.9` foi enviada
2. **Acesse:** https://github.com/GouveiaZx/NeuroGame/actions
3. **Aguarde:** ~15-20 minutos para builds completarem
4. **Download:** Vá em https://github.com/GouveiaZx/NeuroGame/releases/tag/v1.0.9

### O que será gerado:

```
✅ NeuroGame Launcher Setup-1.0.9.exe + latest.yml
✅ NeuroGame Launcher-1.0.9-x64.dmg (Intel)
✅ NeuroGame Launcher-1.0.9-arm64.dmg (Apple Silicon)
✅ NeuroGame Launcher-1.0.9-mac.zip + latest-mac.yml
✅ NeuroGame Launcher-1.0.9.AppImage + latest-linux.yml
✅ neurogame-launcher_1.0.9_amd64.deb
```

### Depois do build:

```bash
# Baixar os instaladores do release
cd INSTALADORES

# Windows - já temos ✅

# macOS
wget https://github.com/GouveiaZx/NeuroGame/releases/download/v1.0.9/NeuroGame\ Launcher-1.0.9-x64.dmg
wget https://github.com/GouveiaZx/NeuroGame/releases/download/v1.0.9/NeuroGame\ Launcher-1.0.9-arm64.dmg
wget https://github.com/GouveiaZx/NeuroGame/releases/download/v1.0.9/NeuroGame\ Launcher-1.0.9-mac.zip
wget https://github.com/GouveiaZx/NeuroGame/releases/download/v1.0.9/latest-mac.yml

# Linux
wget https://github.com/GouveiaZx/NeuroGame/releases/download/v1.0.9/NeuroGame\ Launcher-1.0.9.AppImage
wget https://github.com/GouveiaZx/NeuroGame/releases/download/v1.0.9/neurogame-launcher_1.0.9_amd64.deb
wget https://github.com/GouveiaZx/NeuroGame/releases/download/v1.0.9/latest-linux.yml
```

---

## 🎯 Opção 2: Build Local (Limitações)

### Windows (no Windows) ✅

```bash
cd neurogame-launcher
npm run build:win
```

**Resultado:** `dist-electron/NeuroGame Launcher Setup 1.0.9.exe`

### macOS (APENAS em macOS real)

```bash
cd neurogame-launcher
npm run build:mac
```

**Resultado:**
- `dist-electron/NeuroGame Launcher-1.0.9-x64.dmg`
- `dist-electron/NeuroGame Launcher-1.0.9-arm64.dmg`
- `dist-electron/latest-mac.yml`

### Linux (no Linux ou com Docker)

#### Opção A: Em máquina Linux

```bash
cd neurogame-launcher
npm run build:linux
```

#### Opção B: Com Docker (Windows/Mac)

```bash
cd neurogame-launcher

# Instalar dependências
docker run --rm -v "$(pwd):/project" -w /project electronuserland/builder:wine npm ci

# Build Linux
docker run --rm -v "$(pwd):/project" -w /project electronuserland/builder:wine npm run build:linux
```

**Resultado:**
- `dist-electron/NeuroGame Launcher-1.0.9.AppImage`
- `dist-electron/neurogame-launcher_1.0.9_amd64.deb`
- `dist-electron/latest-linux.yml`

---

## 🔄 Auto-Update

Todos os instaladores suportam auto-update via GitHub Releases:

### Arquivos de Metadados

1. **latest.yml** (Windows) ✅
2. **latest-mac.yml** (macOS) - template criado, será gerado no build
3. **latest-linux.yml** (Linux) - template criado, será gerado no build

### Como Funciona

1. Launcher verifica GitHub Releases ao iniciar
2. Compara versão local com `latest*.yml`
3. Se houver nova versão, baixa e instala automaticamente
4. Usuário é notificado e pode reiniciar

---

## ✅ Checklist de Release Completo

- [x] Windows 1.0.9 buildado e testado
- [x] Tag v1.0.9 criada e enviada ao GitHub
- [x] GitHub Actions configurado
- [ ] Aguardar builds de macOS e Linux completarem (~15 min)
- [ ] Baixar instaladores do GitHub Release
- [ ] Mover para pasta INSTALADORES/
- [ ] Testar instaladores em VMs/máquinas reais
- [ ] Commit final com todos os instaladores
- [ ] Push para GitLab (se necessário)

---

## 📊 Tamanhos Esperados

| Plataforma | Arquivo | Tamanho |
|------------|---------|---------|
| Windows | .exe | 262 MB |
| macOS Intel | .dmg (x64) | ~280 MB |
| macOS ARM | .dmg (arm64) | ~280 MB |
| macOS | .zip | ~275 MB |
| Linux | .AppImage | ~285 MB |
| Linux | .deb | ~275 MB |

---

## 🐛 Troubleshooting

### "Cannot build macOS on Windows"
**Solução:** Use GitHub Actions (já configurado) ou builde em um Mac real

### "Docker não está rodando"
**Solução:**
```bash
# Iniciar Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Aguardar 30-60 segundos
docker info
```

### "GitHub Actions falhou"
**Solução:**
1. Verifique logs em https://github.com/GouveiaZx/NeuroGame/actions
2. Certifique-se que branch `master` está atualizado
3. Re-crie a tag se necessário:
```bash
git tag -d v1.0.9
git push origin :refs/tags/v1.0.9
git tag v1.0.9
git push origin v1.0.9
```

---

## 📚 Documentação Completa

Veja `docs/BUILDS_MULTIPLATAFORMA.md` para guia detalhado com:
- Configurações do electron-builder
- Code signing (Windows/macOS)
- Entitlements macOS
- Testes de instaladores
- Troubleshooting avançado

---

**🎯 Próximo Passo:** Aguardar GitHub Actions completar os builds (acesse: https://github.com/GouveiaZx/NeuroGame/actions)
