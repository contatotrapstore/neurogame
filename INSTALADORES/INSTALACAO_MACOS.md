# 🎮 Como Instalar o NeuroGame Launcher no macOS

⚠️ **IMPORTANTE**: O macOS bloqueia apps não assinados. Mas temos a solução! **É super rápido (30 segundos)**.

---

## 🚀 MÉTODO RÁPIDO - 1 COMANDO (RECOMENDADO)

### O jeito mais fácil e garantido:

1. **Baixe o instalador** apropriado para seu Mac:
   - **Intel Mac (antigos)**: `NeuroGame Launcher-X.X.X-x64.zip` ou `.dmg`
   - **Apple Silicon M1/M2/M3**: `NeuroGame Launcher-X.X.X-arm64.zip` ou `.dmg`

2. **Arraste `NeuroGame Launcher.app` para Applications**

3. **Abra o Terminal** (Aplicativos > Utilitários > Terminal)

4. **COPIE E COLE este comando e pressione ENTER:**

```bash
sudo xattr -cr "/Applications/NeuroGame Launcher.app" && sudo chmod -R 755 "/Applications/NeuroGame Launcher.app" && open "/Applications/NeuroGame Launcher.app"
```

5. **Digite sua senha do Mac** (não aparece enquanto digita - é normal!)

6. **PRONTO! 🎉** O launcher abre automaticamente e está pronto para usar!

---

## 📝 Método Alternativo (Interface Gráfica)

1. **Baixe o instalador** apropriado para seu Mac:
   - **Intel Mac (x64)**: `NeuroGame Launcher-X.X.X-x64.dmg`
   - **Apple Silicon/M1/M2 (arm64)**: `NeuroGame Launcher-X.X.X-arm64.dmg`

2. **Abra o arquivo .dmg** baixado

3. **Arraste o NeuroGame Launcher** para a pasta Applications

4. **Ao tentar abrir pela primeira vez**, você verá a mensagem:
   ```
   "NeuroGame Launcher" está danificado e não pode ser aberto.
   Você deve movê-lo para o Lixo.
   ```

5. **NÃO clique em "Mover para o Lixo"**. Clique em **"Cancelar"**

6. **Abra as Preferências do Sistema** (Configurações do Sistema):
   - Vá em **"Privacidade e Segurança"** ou **"Segurança e Privacidade"**
   - Role para baixo até ver a mensagem sobre o NeuroGame Launcher
   - Clique no botão **"Abrir Mesmo Assim"** ou **"Permitir"**

7. **Confirme** clicando em **"Abrir"** quando aparecer o alerta final

8. **Pronto!** O launcher agora está instalado e pode ser aberto normalmente

### Método 2: Usando o Terminal (Alternativo)

Se o Método 1 não funcionar, você pode usar o Terminal:

1. **Abra o Terminal** (Applications > Utilities > Terminal)

2. **Execute o seguinte comando** (substitua X.X.X pela versão):
   ```bash
   xattr -cr /Applications/NeuroGame\ Launcher.app
   ```

3. **Tente abrir o aplicativo** novamente

4. Se ainda aparecer o alerta, vá em **Preferências do Sistema > Segurança** e clique em **"Abrir Mesmo Assim"**

## Por que isso acontece?

O macOS Gatekeeper bloqueia aplicativos que não são:
- Baixados da App Store
- Assinados com um certificado de desenvolvedor da Apple registrado

Como o NeuroGame Launcher é um aplicativo gratuito e de código aberto, não possui assinatura da Apple, mas é **100% seguro**.

## Formatos Disponíveis

- **DMG**: Instalador padrão do macOS (recomendado)
- **ZIP**: Arquivo compactado com o .app (para usuários avançados)

## Desinstalação

Para desinstalar o NeuroGame Launcher:

1. Arraste **NeuroGame Launcher.app** da pasta Applications para o Lixo
2. Delete a pasta de dados do usuário (opcional):
   ```
   ~/Library/Application Support/neurogame-launcher
   ```

## Problemas Comuns

### O aplicativo não abre mesmo depois de permitir

1. Tente o comando do Terminal (Método 2)
2. Reinicie o Mac
3. Verifique se baixou a versão correta para sua arquitetura

### Erro de permissões

Se aparecer erro de permissões:
```bash
sudo chmod -R 755 /Applications/NeuroGame\ Launcher.app
```

## Suporte

Se ainda tiver problemas, entre em contato:
- Email: suporte@neurogame.com
- GitHub Issues: https://github.com/contatotrapstore/neurogame/issues
