# 📦 Sistema de Downloads dos Jogos - NeuroGame

## ✅ Situação Atual

### **Downloads Configurados e Prontos**

Todos os 13 jogos estão configurados para download via servidor Render.

---

## 🎮 Arquivos de Jogos

### **Localização Local**
```
neurogame-backend/downloads/
├── autorama.zip (19 MB)
├── balao.zip (11 MB)
├── batalhadetanques.zip (8.5 MB)
├── correndopelostrilhos.zip (39 MB)
├── desafioaereo.zip (39 MB)
├── desafioautomotivo.zip (23 MB)
├── desafionasalturas.zip (44 MB)
├── fazendinha.zip (8.4 MB)
├── labirinto.zip (2.2 MB)
├── missaoespacial.zip (16 MB)
├── resgateemchamas.zip (14 MB)
├── taxicity.zip (6.2 MB)
└── tesourodomar.zip (12 MB)
```

**Total:** 237 MB de conteúdo de jogos

### **Status no Git**
✅ Arquivos commitados no repositório
✅ Serão deployados automaticamente no Render

---

## 🌐 Como os Downloads Funcionam

### **Fluxo do Download**

```
┌──────────────┐
│   LAUNCHER   │
│  (Cliente)   │
└──────┬───────┘
       │ 1. Usuário clica em "Baixar"
       │
       ▼
┌──────────────┐
│     API      │  2. GET /api/v1/games/:id
│   (Metadados)│     Retorna download_url
└──────┬───────┘
       │
       │ download_url: https://neurogame.onrender.com/downloads/autorama.zip
       │
       ▼
┌──────────────┐
│   BACKEND    │  3. GET /downloads/autorama.zip
│  (Render)    │     Serve arquivo ZIP via express.static
└──────┬───────┘
       │
       │ 4. Stream do arquivo ZIP
       │
       ▼
┌──────────────┐
│   LAUNCHER   │  5. Salva em AppData/Jogos/
│   (Cliente)  │     Descompacta e instala
└──────────────┘
```

### **URLs de Download (Produção)**

Base URL: `https://neurogame.onrender.com/downloads/`

| Jogo | URL |
|------|-----|
| Autorama | https://neurogame.onrender.com/downloads/autorama.zip |
| Balão | https://neurogame.onrender.com/downloads/balao.zip |
| Batalha de Tanques | https://neurogame.onrender.com/downloads/batalhadetanques.zip |
| Correndo pelos Trilhos | https://neurogame.onrender.com/downloads/correndopelostrilhos.zip |
| Desafio Aéreo | https://neurogame.onrender.com/downloads/desafioaereo.zip |
| Desafio Automotivo | https://neurogame.onrender.com/downloads/desafioautomotivo.zip |
| Desafio nas Alturas | https://neurogame.onrender.com/downloads/desafionasalturas.zip |
| Fazendinha | https://neurogame.onrender.com/downloads/fazendinha.zip |
| Labirinto | https://neurogame.onrender.com/downloads/labirinto.zip |
| Missão Espacial | https://neurogame.onrender.com/downloads/missaoespacial.zip |
| Resgate em Chamas | https://neurogame.onrender.com/downloads/resgateemchamas.zip |
| Taxi City | https://neurogame.onrender.com/downloads/taxicity.zip |
| Tesouro do Mar | https://neurogame.onrender.com/downloads/tesourodomar.zip |

---

## 🔧 Implementação Técnica

### **Backend (server.js)**

```javascript
// Serve game downloads (ZIP files)
const downloadsDir = path.resolve(__dirname, '..', 'downloads');
if (fs.existsSync(downloadsDir)) {
  app.use('/downloads', express.static(downloadsDir, {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === '.zip') {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
      }
    }
  }));
  console.log(`📦 Serving game downloads from: ${downloadsDir}`);
}
```

### **Database (Supabase)**

Cada jogo tem metadados configurados:

```sql
{
  "download_url": "https://neurogame.onrender.com/downloads/autorama.zip",
  "file_size": 19127109,
  "checksum": "052c67009511a80a6eb4ab4b92e0a2c7a74f4ece3a7e76999814907917afd018",
  "installer_type": "zip",
  "minimum_disk_space": 47817773
}
```

### **Launcher (gameDownload.js)**

O launcher:
1. Obtém `download_url` da API
2. Faz download do ZIP
3. Valida o checksum SHA-256
4. Descompacta para pasta local
5. Marca como instalado

---

## ⚠️ Importante - Render Deploy

### **O Que Acontece no Deploy**

Quando você fizer `git push`, o Render irá:

1. ✅ Detectar alterações no repositório
2. ✅ Fazer build automático
3. ✅ Copiar pasta `downloads/` para o servidor
4. ✅ Servir arquivos via `/downloads/:filename`
5. ✅ Downloads funcionarão automaticamente

### **Limitações do Render Free Tier**

- **Espaço em disco:** Limitado (verificar plano)
- **Bandwidth:** 100 GB/mês (Free tier)
- **Cálculo:** 237 MB × quantidade de downloads

**Exemplo:**
- 100 usuários baixando todos os jogos = 23.7 GB
- Suficiente para ~400 downloads completos/mês

### **Soluções Alternativas (Futuro)**

Se o Render ficar limitado, considerar:

1. **Cloudflare R2** - $0.015/GB (mais barato)
2. **AWS S3** - Storage dedicado
3. **DigitalOcean Spaces** - CDN + Storage
4. **Backblaze B2** - Storage econômico

---

## 📊 Status Atual

| Item | Status |
|------|--------|
| Arquivos ZIP criados | ✅ 13 jogos (237 MB) |
| Commitados no Git | ✅ Sim |
| Rota `/downloads` | ✅ Implementada |
| Headers HTTP corretos | ✅ Configurados |
| Metadados no Supabase | ✅ Configurados |
| Deploy no Render | ⏳ Aguardando push |

---

## 🚀 Próximos Passos

### **Para Fazer os Downloads Funcionarem**

1. **Fazer Push para GitHub**
   ```bash
   git push origin master
   ```

2. **Render Deploy Automático**
   - Render detecta push
   - Faz build automático
   - Deploy em ~5 minutos

3. **Testar Downloads**
   ```bash
   # Testar URL diretamente
   curl -I https://neurogame.onrender.com/downloads/autorama.zip

   # Deve retornar:
   # HTTP/1.1 200 OK
   # Content-Type: application/zip
   # Content-Disposition: attachment; filename="autorama.zip"
   ```

4. **Testar no Launcher**
   - Abrir launcher
   - Clicar em "Baixar" em qualquer jogo
   - Verificar se download inicia
   - Verificar se jogo instala corretamente

---

## 🐛 Troubleshooting

### **Erro 404 ao baixar**

**Causa:** Arquivos não foram deployados no Render

**Solução:**
1. Verificar se pasta `downloads/` está commitada no Git
2. Fazer push para GitHub
3. Aguardar deploy no Render
4. Verificar logs do Render

### **Download muito lento**

**Causa:** Render Free tier tem bandwidth limitado

**Solução:**
1. Considerar upgrade do Render
2. Migrar para CDN dedicado (R2, S3)
3. Comprimir jogos mais (se possível)

### **Erro de checksum**

**Causa:** Arquivo corrompido durante download

**Solução:**
1. Launcher deve tentar novamente
2. Verificar integridade dos arquivos ZIP locais
3. Re-gerar checksums se necessário

---

## 📝 Notas Técnicas

### **Por Que NÃO Usar `/api/v1/downloads`?**

A rota está em `/downloads` (não `/api/v1/downloads`) porque:

1. ✅ Express.static serve arquivos diretamente (mais rápido)
2. ✅ Não passa pelos middlewares da API (sem rate limit)
3. ✅ Melhor para arquivos grandes (streaming)
4. ✅ Headers automáticos (Content-Length, Range, etc)

### **Por Que ZIP e Não EXE?**

- ✅ ZIP é menor (compressão)
- ✅ Multiplataforma (Windows, Mac, Linux)
- ✅ Launcher controla a descompactação
- ✅ Mais seguro (não executa automaticamente)

### **Checksums SHA-256**

Cada jogo tem um checksum único para garantir:
- ✅ Integridade do arquivo
- ✅ Detecção de corrupção
- ✅ Segurança contra modificação

---

## ✅ Conclusão

O sistema de downloads está **pronto e configurado**.

Após fazer `git push`, os jogos estarão disponíveis para download em produção via:

```
https://neurogame.onrender.com/downloads/:filename
```

O launcher baixará, validará e instalará os jogos automaticamente! 🎮

---

**Última atualização:** 06/10/2025
**Status:** ✅ Pronto para deploy
**Total de jogos:** 13 (237 MB)
