# 🎮 NeuroGame Launcher - Instalação macOS

## ⚠️ IMPORTANTE: Por que o macOS está bloqueando?

O macOS bloqueia aplicativos que não são:
- Distribuídos pela App Store
- Assinados com certificado Apple Developer ($99/ano)

**O NeuroGame Launcher é 100% SEGURO**, mas como é gratuito e open-source, não possui assinatura da Apple.

---

## 🚀 INSTALAÇÃO RÁPIDA (1 comando)

### Passo a Passo:

1. **Arraste `NeuroGame Launcher.app` para a pasta Applications**
   - Você pode encontrar Applications na barra lateral do Finder

2. **Abra o Terminal:**
   - Vá em `Aplicativos > Utilitários > Terminal`
   - Ou pressione `Cmd + Espaço` e digite "Terminal"

3. **Cole este comando e pressione ENTER:**

```bash
sudo xattr -cr "/Applications/NeuroGame Launcher.app" && sudo chmod -R 755 "/Applications/NeuroGame Launcher.app" && open "/Applications/NeuroGame Launcher.app"
```

4. **Digite sua senha do Mac** (os caracteres não aparecem - é normal!)

5. **Pronto!** O NeuroGame Launcher vai abrir automaticamente 🎉

---

## 🔍 O que cada parte do comando faz?

| Comando | O que faz |
|---------|-----------|
| `sudo` | Pede permissões de administrador |
| `xattr -cr` | Remove o bloqueio de "quarentena" do macOS |
| `chmod -R 755` | Corrige as permissões de execução |
| `open` | Abre o aplicativo |

---

## 🛠️ Método Alternativo (Interface Gráfica)

Se preferir não usar o Terminal:

1. Arraste `NeuroGame Launcher.app` para Applications

2. Tente abrir o app - vai aparecer um erro dizendo que está "danificado"

3. **NÃO clique em "Mover para o Lixo"** - Clique em **Cancelar**

4. Abra **Configurações do Sistema** (ícone da engrenagem)

5. Vá em **Privacidade e Segurança**

6. Role até o final da página

7. Você verá uma mensagem sobre o NeuroGame Launcher

8. Clique em **"Abrir Mesmo Assim"**

9. Confirme clicando em **"Abrir"** no alerta final

10. **AGORA** abra o Terminal e execute só isto:
```bash
xattr -cr "/Applications/NeuroGame Launcher.app"
```

11. Pronto! O app vai abrir normalmente

---

## ❓ Perguntas Frequentes

### Por que preciso fazer isso?

O macOS Gatekeeper protege contra apps maliciosos. Como o NeuroGame não tem certificado Apple (que custa $99/ano), o sistema bloqueia por padrão.

### É seguro?

**Sim!** Você pode verificar o código-fonte completo em:
👉 https://github.com/contatotrapstore/neurogame

### Vou precisar fazer isso toda vez?

**Não!** Após o primeiro desbloqueio, o app funcionará normalmente sempre.

### E se eu atualizar o app?

Você precisará executar o comando `xattr` novamente apenas na primeira abertura da nova versão.

### Qual versão devo baixar?

- **Intel Mac (antigos)**: Arquivo com `-x64`
- **Apple Silicon (M1/M2/M3)**: Arquivo com `-arm64`
- **Não tem certeza?**: Clique no logo da Apple > "Sobre Este Mac"

---

## 🆘 Precisa de Ajuda?

- 📧 **Email**: suporte@neurogame.com
- 💬 **Issues GitHub**: https://github.com/contatotrapstore/neurogame/issues
- 📱 **Suporte**: Abra um ticket no nosso repositório

---

## 🔐 Informações Técnicas

O bloqueio acontece por causa dos **Extended Attributes** do macOS, especificamente o atributo `com.apple.quarantine` que é automaticamente adicionado a arquivos baixados da internet.

**O que o comando faz:**
```bash
xattr -cr "/Applications/NeuroGame Launcher.app"
```
- `xattr` = Extended Attributes
- `-c` = Clear (limpar)
- `-r` = Recursive (recursivo, todos os arquivos dentro do .app)

**Sem permissões de admin (pode não funcionar sempre):**
```bash
xattr -d com.apple.quarantine "/Applications/NeuroGame Launcher.app"
```

---

**Versão do Launcher:** 1.0.9
**Data:** Outubro 2025
**Desenvolvido por:** NeuroGame Team

🎮 **Bom jogo!**
