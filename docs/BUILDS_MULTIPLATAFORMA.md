# 🖥️ Builds Multiplataforma - NeuroGame Launcher

Guia completo para gerar instaladores do launcher para Windows, macOS e Linux.

---

## 🎯 Limitações de Build

### ⚠️ Builds Nativos

O **electron-builder** tem limitações baseadas no sistema operacional host:

| Sistema Host | Pode Buildar |
|--------------|--------------|
| **Windows** | ✅ Windows only |
| **macOS** | ✅ macOS + ✅ Windows + ✅ Linux |
| **Linux** | ✅ Linux + ✅ Windows |

**Razão:** Builds macOS (.dmg) requerem ferramentas exclusivas do macOS (hdiutil, code signing).

---

## 🚀 Solução: GitHub Actions

Configuramos um workflow automatizado que builda em **3 máquinas virtuais** simultaneamente:

### Workflow Configurado

**Arquivo:** `.github/workflows/build-launcher.yml`

**Máquinas:**
- 🪟 `windows-latest` → Build Windows (.exe)
- 🍎 `macos-latest` → Build macOS (.dmg + .zip)
- 🐧 `ubuntu-latest` → Build Linux (.AppImage + .deb)

---

## 📦 Como Gerar Todos os Instaladores

### Opção 1: Via Tag (Recomendado)

```bash
# 1. Certifique-se de que está no branch correto
git checkout master

# 2. Crie uma tag de versão
git tag v1.0.9

# 3. Envie a tag para o GitHub
git push origin v1.0.9
```

✨ **O que acontece:**
1. GitHub Actions detecta a nova tag
2. Inicia builds em Windows, macOS e Linux simultaneamente
3. Gera todos os instaladores
4. Cria um **GitHub Release** automaticamente
5. Faz upload de todos os instaladores

### Opção 2: Manual (GitHub Interface)

1. Acesse: https://github.com/GouveiaZx/NeuroGame/actions
2. Selecione: **Build Launcher (Multi-Platform)**
3. Clique: **Run workflow**
4. Escolha: branch `master`
5. Digite: versão (ex: `1.0.9`)
6. Clique: **Run workflow**

---

## 📥 Instaladores Gerados

### Windows (.exe)
- **Arquivo:** `NeuroGame Launcher Setup 1.0.9.exe`
- **Tamanho:** ~274 MB
- **Formato:** NSIS Installer
- **Assinatura:** Não assinado (configurável)

### macOS (.dmg + .zip)
- **DMG:** `NeuroGame Launcher-1.0.9.dmg`
- **ZIP:** `NeuroGame Launcher-1.0.9-mac.zip`
- **Tamanho:** ~280 MB (cada)
- **Arquitetura:** Universal (Intel + Apple Silicon)
- **Assinatura:** Não assinado (requer Apple Developer)

### Linux
#### AppImage (Portável)
- **Arquivo:** `NeuroGame Launcher-1.0.9.AppImage`
- **Tamanho:** ~285 MB
- **Formato:** Single-file executable
- **Distros:** Todas (Ubuntu, Fedora, Arch, etc)

#### DEB (Debian/Ubuntu)
- **Arquivo:** `neurogame-launcher_1.0.9_amd64.deb`
- **Tamanho:** ~275 MB
- **Formato:** Pacote Debian
- **Instalação:** `sudo dpkg -i neurogame-launcher_1.0.9_amd64.deb`

---

## 🛠️ Build Local (Dev)

### Windows (no Windows)
```bash
cd neurogame-launcher
npm run build:win
```

### macOS (apenas no macOS)
```bash
cd neurogame-launcher
npm run build:mac
```

### Linux (no Linux ou macOS)
```bash
cd neurogame-launcher
npm run build:linux
```

### Todos (apenas no macOS)
```bash
cd neurogame-launcher
npm run build:all
```

---

## 📋 Scripts do package.json

```json
{
  "scripts": {
    "build": "vite build",
    "build:win": "npm run build && electron-builder --win",
    "build:mac": "npm run build && electron-builder --mac",
    "build:linux": "npm run build && electron-builder --linux",
    "build:all": "npm run build && electron-builder -mwl"
  }
}
```

---

## 🔧 Configuração (package.json)

### Windows
```json
{
  "win": {
    "target": ["nsis"],
    "icon": "build/icon.png",
    "publisherName": "NeuroGame"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "perMachine": false
  }
}
```

### macOS
```json
{
  "mac": {
    "target": ["dmg", "zip"],
    "icon": "build/icon.icns",
    "category": "public.app-category.games",
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist"
  }
}
```

### Linux
```json
{
  "linux": {
    "target": ["AppImage", "deb"],
    "icon": "build/icon.png",
    "category": "Game",
    "maintainer": "NeuroGame Team"
  }
}
```

---

## 🎨 Ícones Necessários

### Windows & Linux
- **Arquivo:** `build/icon.png`
- **Tamanho:** 512x512px ou 1024x1024px
- **Formato:** PNG com transparência

### macOS
- **Arquivo:** `build/icon.icns`
- **Geração:** Electron-builder cria automaticamente do PNG
- **Ou manual:** Use `iconutil` no macOS

```bash
# Gerar .icns manualmente (macOS)
mkdir icon.iconset
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset
```

---

## 📊 Comparação de Tamanhos

| Plataforma | Instalador | Tamanho | Instalado |
|------------|------------|---------|-----------|
| Windows | .exe | ~274 MB | ~350 MB |
| macOS | .dmg | ~280 MB | ~360 MB |
| Linux AppImage | .AppImage | ~285 MB | ~285 MB |
| Linux DEB | .deb | ~275 MB | ~350 MB |

**Por que tão grande?**
- Electron runtime (~85 MB)
- Chromium engine (~120 MB)
- 13 jogos embedados (~248 MB)
- Node modules necessários

---

## 🔐 Code Signing (Opcional)

### Windows
```bash
# Certificado Code Signing EV
npm install -D electron-builder-notarize-win
```

```json
{
  "win": {
    "certificateFile": "cert.pfx",
    "certificatePassword": "password"
  }
}
```

### macOS
```bash
# Apple Developer Account necessário
npm install -D @electron/notarize
```

```json
{
  "mac": {
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  },
  "afterSign": "scripts/notarize.js"
}
```

---

## 🧪 Testando Instaladores

### Windows
1. Execute o `.exe`
2. Siga o assistente de instalação
3. Verifique instalação em `C:\Users\{user}\AppData\Local\Programs\neurogame-launcher`

### macOS
1. Abra o `.dmg`
2. Arraste o app para `/Applications`
3. Abra com Cmd+Click (se não assinado)

### Linux AppImage
```bash
chmod +x NeuroGame\ Launcher-1.0.9.AppImage
./NeuroGame\ Launcher-1.0.9.AppImage
```

### Linux DEB
```bash
sudo dpkg -i neurogame-launcher_1.0.9_amd64.deb
sudo apt-get install -f  # Instalar dependências
neurogame-launcher
```

---

## 🐛 Troubleshooting

### Erro: "Cannot build for macOS on Windows"
**Solução:** Use GitHub Actions ou builde em um Mac

### Erro: "Icon not found"
**Solução:**
```bash
# Verifique se o ícone existe
ls build/icon.png
```

### Erro: "No code signature found"
**Solução:** No macOS não assinado:
```bash
xattr -cr "/Applications/NeuroGame Launcher.app"
```

### Linux: "libgtk-3.so.0 not found"
**Solução:**
```bash
# Ubuntu/Debian
sudo apt-get install libgtk-3-0

# Fedora
sudo dnf install gtk3

# Arch
sudo pacman -S gtk3
```

---

## 📚 Recursos

### Documentação
- **Electron Builder:** https://www.electron.build/
- **Multi-Platform:** https://www.electron.build/multi-platform-build
- **Code Signing:** https://www.electron.build/code-signing

### Ferramentas
- **GitHub Actions:** https://github.com/features/actions
- **Electron Forge:** Alternativa ao electron-builder
- **Snapcraft:** Para Linux Snap packages

---

## ✅ Checklist de Release

- [ ] Atualizar versão no `package.json`
- [ ] Testar build localmente (se possível)
- [ ] Criar tag de versão (`git tag v1.0.9`)
- [ ] Push tag para GitHub
- [ ] Aguardar GitHub Actions completar
- [ ] Verificar todos os 3 instaladores no Release
- [ ] Testar instaladores em máquinas reais
- [ ] Atualizar documentação (README, etc)
- [ ] Anunciar nova versão

---

## 🎯 Próximos Passos

### Melhorias Futuras
- [ ] Implementar auto-update para macOS/Linux
- [ ] Code signing para todas as plataformas
- [ ] Testes automatizados E2E
- [ ] Builds notarizados (macOS)
- [ ] Snap/Flatpak para Linux
- [ ] ARM builds para Apple Silicon nativo

---

**Sistema de builds configurado e funcional!**

*Para gerar todos os instaladores, crie uma tag e envie para o GitHub.*
