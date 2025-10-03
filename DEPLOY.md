# 🚀 Guia de Deploy em Produção - NeuroGame

Este guia cobre o deployment completo da plataforma NeuroGame em ambiente de produção.

## 📋 Pré-requisitos

- Servidor VPS ou Cloud (AWS, DigitalOcean, Azure, etc.)
- Domínio próprio (ex: `neurogame.com`)
- Certificado SSL (Let's Encrypt gratuito)
- PostgreSQL em servidor dedicado ou RDS
- Node.js 18+ instalado no servidor

## 🗂️ Arquitetura de Produção

```
┌─────────────────────────┐
│   neurogame.com         │  → Dashboard Admin (React build)
│   (Nginx + SSL)         │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│   api.neurogame.com     │  → Backend API (Node.js + PM2)
│   (Nginx + SSL)         │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│   PostgreSQL            │  → Banco de Dados
│   (RDS ou VPS)          │
└─────────────────────────┘

Launcher Desktop
├── Windows: neurogame-setup.exe
├── macOS: NeuroGame.dmg
└── Linux: neurogame.AppImage
```

## 1️⃣ Deploy do Backend (API)

### Opção A: Servidor VPS (Ubuntu)

#### 1.1. Configurar Servidor

```bash
# Conectar ao servidor
ssh root@seu-servidor.com

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib

# Instalar Nginx
apt install -y nginx

# Instalar PM2 (process manager)
npm install -g pm2

# Instalar Certbot (SSL gratuito)
apt install -y certbot python3-certbot-nginx
```

#### 1.2. Configurar PostgreSQL

```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar banco e usuário
CREATE DATABASE neurogame_db;
CREATE USER neurogame_user WITH PASSWORD 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON DATABASE neurogame_db TO neurogame_user;
\q

# Permitir conexões remotas (se necessário)
nano /etc/postgresql/15/main/pg_hba.conf
# Adicionar: host all all 0.0.0.0/0 md5

nano /etc/postgresql/15/main/postgresql.conf
# Descomentar: listen_addresses = '*'

# Reiniciar PostgreSQL
systemctl restart postgresql
```

#### 1.3. Deploy do Código

```bash
# Criar diretório
mkdir -p /var/www/neurogame-backend
cd /var/www/neurogame-backend

# Clonar repositório (ou fazer upload manual)
git clone https://github.com/seu-usuario/neurogame.git .
# Ou usar rsync/scp para fazer upload

# Instalar dependências
cd neurogame-backend
npm install --production

# Configurar variáveis de ambiente
nano .env
```

**Arquivo `.env` de produção:**

```env
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neurogame_db
DB_USER=neurogame_user
DB_PASSWORD=senha_forte_aqui

# JWT (GERAR NOVAS CHAVES!)
JWT_SECRET=chave_secreta_super_segura_123456789
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=refresh_secret_super_segura_987654321
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://neurogame.com,https://api.neurogame.com

# Admin
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@neurogame.com
ADMIN_PASSWORD=SenhaAdminForte@2025

# Games
GAMES_DIR=../Jogos
```

```bash
# Executar migrações e seeds
npm run migrate
npm run seed

# Configurar PM2
pm2 start src/server.js --name neurogame-api
pm2 save
pm2 startup
```

#### 1.4. Configurar Nginx (Reverse Proxy)

```bash
nano /etc/nginx/sites-available/neurogame-api
```

```nginx
server {
    listen 80;
    server_name api.neurogame.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Servir jogos estáticos
    location /games {
        alias /var/www/neurogame-backend/Jogos;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Ativar site
ln -s /etc/nginx/sites-available/neurogame-api /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Configurar SSL
certbot --nginx -d api.neurogame.com
```

### Opção B: Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create neurogame-api

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variáveis de ambiente
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=sua_chave_secreta
heroku config:set CORS_ORIGIN=https://seu-dominio.com

# Deploy
git push heroku main

# Executar migrações
heroku run npm run migrate
heroku run npm run seed

# Ver logs
heroku logs --tail
```

### Opção C: AWS EC2 + RDS

Similar ao VPS, mas usando:
- **EC2** para o servidor Node.js
- **RDS PostgreSQL** para o banco de dados
- **S3** para assets estáticos (opcional)
- **CloudFront** para CDN (opcional)

## 2️⃣ Deploy do Dashboard Admin

### 2.1. Build do Projeto

```bash
cd neurogame-admin

# Configurar variável de ambiente de produção
echo "VITE_API_URL=https://api.neurogame.com/api/v1" > .env.production

# Build para produção
npm run build
# Gera pasta dist/
```

### 2.2. Deploy no Servidor (Nginx)

```bash
# No servidor
mkdir -p /var/www/neurogame-admin
cd /var/www/neurogame-admin

# Fazer upload da pasta dist/
# Ou usar git + build no servidor
```

**Configurar Nginx:**

```bash
nano /etc/nginx/sites-available/neurogame-admin
```

```nginx
server {
    listen 80;
    server_name neurogame.com www.neurogame.com;
    root /var/www/neurogame-admin/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_comp_level 6;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Ativar site
ln -s /etc/nginx/sites-available/neurogame-admin /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# SSL
certbot --nginx -d neurogame.com -d www.neurogame.com
```

### 2.3. Deploy em Vercel (Alternativa)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd neurogame-admin
vercel --prod

# Configurar variáveis de ambiente no dashboard da Vercel
# VITE_API_URL=https://api.neurogame.com/api/v1
```

### 2.4. Deploy em Netlify (Alternativa)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build e deploy
cd neurogame-admin
npm run build
netlify deploy --prod --dir=dist

# Configurar variáveis no dashboard Netlify
```

## 3️⃣ Build do Launcher Desktop

### 3.1. Preparar para Distribuição

```bash
cd neurogame-launcher

# Configurar URL da API em produção
nano src/services/api.js
# Alterar: const API_BASE_URL = 'https://api.neurogame.com/api/v1';

# Ou usar variável de ambiente
# const API_BASE_URL = process.env.API_URL || 'https://api.neurogame.com/api/v1';
```

### 3.2. Build para Windows

```bash
# No Windows
npm run dist

# Gerará:
# release/NeuroGame Setup 1.0.0.exe
```

### 3.3. Build para macOS

```bash
# No macOS
npm run dist

# Gerará:
# release/NeuroGame-1.0.0.dmg
```

### 3.4. Build para Linux

```bash
# No Linux
npm run dist

# Gerará:
# release/NeuroGame-1.0.0.AppImage
```

### 3.5. Distribuição

**Opções:**

1. **Servidor próprio:**
   ```
   https://neurogame.com/downloads/NeuroGame-Setup.exe
   ```

2. **GitHub Releases:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   # Fazer upload dos executáveis no GitHub Releases
   ```

3. **CDN (CloudFront, Cloudflare):**
   - Upload para S3
   - Distribuir via CDN

## 4️⃣ Configurações de Segurança

### 4.1. Firewall

```bash
# UFW (Ubuntu)
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw enable

# Bloquear acesso direto à porta 3000
ufw deny 3000/tcp
```

### 4.2. Fail2Ban (Proteção contra brute force)

```bash
apt install -y fail2ban

nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
```

```bash
systemctl restart fail2ban
```

### 4.3. PostgreSQL

```bash
# Backup automático
crontab -e

# Adicionar:
0 2 * * * pg_dump neurogame_db > /backup/neurogame_$(date +\%Y\%m\%d).sql
```

### 4.4. Monitoramento

```bash
# PM2 Monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M

# Ver status
pm2 status
pm2 logs
pm2 monit
```

## 5️⃣ Domínio e DNS

### Configurar DNS

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | IP_DO_SERVIDOR | 3600 |
| A | www | IP_DO_SERVIDOR | 3600 |
| A | api | IP_DO_SERVIDOR | 3600 |
| CNAME | downloads | cdn.neurogame.com | 3600 |

## 6️⃣ CI/CD (GitHub Actions)

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Deploy Backend
        run: |
          cd neurogame-backend
          npm ci
          npm test
          # Deploy via SSH ou Heroku CLI

  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Build and Deploy
        run: |
          cd neurogame-admin
          npm ci
          npm run build
          # Deploy para Vercel/Netlify

  build-launcher:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Build Launcher
        run: |
          cd neurogame-launcher
          npm ci
          npm run dist
      - uses: actions/upload-artifact@v3
        with:
          name: launcher-${{ matrix.os }}
          path: neurogame-launcher/release/*
```

## 7️⃣ Monitoramento e Logs

### Logs do Backend

```bash
# Ver logs em tempo real
pm2 logs neurogame-api

# Logs salvos
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Ferramentas Recomendadas

- **Sentry** - Error tracking
- **New Relic** - APM
- **Datadog** - Monitoring
- **LogRocket** - Frontend monitoring
- **Uptime Robot** - Uptime monitoring (gratuito)

## 8️⃣ Backup e Restore

### Backup Completo

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/$DATE"

mkdir -p $BACKUP_DIR

# Backup banco de dados
pg_dump neurogame_db > $BACKUP_DIR/database.sql

# Backup código
tar -czf $BACKUP_DIR/backend.tar.gz /var/www/neurogame-backend
tar -czf $BACKUP_DIR/admin.tar.gz /var/www/neurogame-admin

# Backup uploads/assets
tar -czf $BACKUP_DIR/uploads.tar.gz /var/www/neurogame-backend/uploads

echo "Backup completo em $BACKUP_DIR"
```

### Automatizar

```bash
crontab -e
# Backup diário às 2h da manhã
0 2 * * * /root/backup.sh
```

### Restore

```bash
# Restaurar banco
psql neurogame_db < /backup/20250101_020000/database.sql

# Restaurar código
tar -xzf /backup/20250101_020000/backend.tar.gz -C /
```

## 9️⃣ Checklist de Deploy

### Backend
- [ ] Servidor configurado
- [ ] PostgreSQL instalado e configurado
- [ ] Código deployado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações executadas
- [ ] Seeds executados
- [ ] PM2 configurado
- [ ] Nginx configurado
- [ ] SSL instalado
- [ ] Firewall configurado
- [ ] Backups automatizados

### Dashboard Admin
- [ ] Build gerado
- [ ] Deploy realizado
- [ ] URL de API configurada
- [ ] SSL ativo
- [ ] Cache configurado
- [ ] SPA routing funcionando

### Launcher
- [ ] Build para Windows
- [ ] Build para macOS
- [ ] Build para Linux
- [ ] API em produção configurada
- [ ] Testes de instalação
- [ ] Distribuição configurada

### Geral
- [ ] DNS configurado
- [ ] Domínio funcionando
- [ ] Monitoramento ativo
- [ ] Logs configurados
- [ ] Documentação atualizada

## 🎉 Conclusão

Sua plataforma NeuroGame está pronta para produção!

**URLs Finais:**
- Dashboard Admin: `https://neurogame.com`
- API Backend: `https://api.neurogame.com`
- Downloads: `https://neurogame.com/downloads`

**Próximos passos:**
- Marketing e divulgação
- Onboarding de usuários
- Suporte ao cliente
- Novos jogos
- Melhorias contínuas

---

**Dúvidas?** Consulte a documentação completa ou entre em contato.
