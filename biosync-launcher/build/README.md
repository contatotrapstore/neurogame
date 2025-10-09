# Ícones do NeuroGame Launcher

## Requisitos de Ícones

Para construir o instalador corretamente, você precisa adicionar os seguintes arquivos de ícone nesta pasta:

### Windows
- **icon.ico** (256x256 pixels ou maior)
  - Formato: ICO com múltiplas resoluções (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
  - Usado para: Executável, instalador, atalhos

### macOS
- **icon.icns** (512x512 pixels ou maior)
  - Formato: ICNS com múltiplas resoluções
  - Usado para: App bundle, DMG

### Linux
- **icon.png** (512x512 pixels)
  - Formato: PNG transparente
  - Usado para: Desktop shortcuts, AppImage

## Como Criar os Ícones

### Opção 1: Usar ferramentas online
1. Crie um ícone PNG 512x512 com o logo do NeuroGame
2. Use https://www.icoconverter.com/ para converter para ICO
3. Use https://cloudconvert.com/png-to-icns para converter para ICNS

### Opção 2: Usar ferramentas de linha de comando

#### Para Windows (ICO):
```bash
# Usando ImageMagick
magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

#### Para macOS (ICNS):
```bash
# Usando iconutil (macOS only)
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
cp icon.png icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset
```

## Ícone Temporário

Se você não tiver os ícones prontos, pode usar um ícone temporário genérico:
1. Crie um PNG simples com o texto "NG" (NeuroGame)
2. Use as ferramentas acima para converter nos formatos necessários

## Verificar Ícones

Após adicionar os ícones, verifique se eles existem:
```bash
ls -la build/
# Deve mostrar: icon.ico, icon.icns, icon.png
```
