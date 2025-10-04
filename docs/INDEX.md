# 📚 Documentação do NeuroGame

Índice completo da documentação do projeto NeuroGame.

---

## 🚀 Início Rápido

### Para Desenvolvedores
- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Guia rápido para iniciar o desenvolvimento
- **[INICIAR_LAUNCHER_COMPLETO.md](INICIAR_LAUNCHER_COMPLETO.md)** - Como iniciar o launcher completo

### Para Produção
- **[DEPLOY.md](DEPLOY.md)** - Guia de deploy em produção
- **[README_INSTALADOR.md](README_INSTALADOR.md)** - Sistema de instalador e distribuição

---

## 📦 Sistema de Distribuição

### Instalador e Auto-Atualização
- **[README_INSTALADOR.md](README_INSTALADOR.md)** - Resumo executivo do sistema
- **[GUIA_BUILD_INSTALADOR.md](GUIA_BUILD_INSTALADOR.md)** - Guia técnico completo (EM BREVE)
- **[SISTEMA_COMPLETO.md](SISTEMA_COMPLETO.md)** - Arquitetura visual (EM BREVE)
- **[COMO_CRIAR_INSTALADOR.md](COMO_CRIAR_INSTALADOR.md)** - Guia rápido (EM BREVE)

---

## 🏗️ Arquitetura e Implementação

### Planejamento
- **[planejamento.md](planejamento.md)** - Planejamento inicial do projeto
- **[PRD.md](PRD.md)** - Product Requirements Document

### Implementação Técnica
- **[IMPLEMENTACAO_LAUNCHER.md](IMPLEMENTACAO_LAUNCHER.md)** - Detalhes do launcher
- **[IMPLEMENTACAO_ADMIN.md](IMPLEMENTACAO_ADMIN.md)** - Detalhes do painel admin
- **[SOLUCAO_LAUNCHER.md](SOLUCAO_LAUNCHER.md)** - Solução técnica do launcher

### Integrações
- **[INTEGRACAO_JOGOS.md](INTEGRACAO_JOGOS.md)** - Como integrar jogos
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Configuração do Supabase

---

## 🎯 Funcionalidades

### Sistema de Assinaturas
- Autenticação com JWT
- Proteção de jogos por assinatura
- Integração com Asaas/Stripe
- Heartbeat de validação

### Sistema de Jogos
- Biblioteca de jogos
- Download e instalação
- Proteção por assinatura
- Solicitação de novos jogos

### Auto-Atualização
- Verificação automática
- Download em background
- Instalação automática
- Versionamento semântico

---

## 📋 Próximos Passos

- **[PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md)** - Roadmap e melhorias futuras

---

## 🔗 Links Rápidos

### Repositórios
- Launcher: `neurogame-launcher/`
- Backend: `neurogame-backend/`
- Admin: `neurogame-admin/`

### Comandos Úteis

```bash
# Iniciar todos os serviços
npm run dev                    # Backend
cd neurogame-admin && npm run dev
cd neurogame-launcher && npm run dev

# Criar instalador
node release.js build

# Deploy
# Ver DEPLOY.md
```

---

## 📝 Convenções

### Nomenclatura de Arquivos
- `GUIA_*.md` - Guias técnicos detalhados
- `SISTEMA_*.md` - Documentação de arquitetura
- `COMO_*.md` - Tutoriais práticos
- `IMPLEMENTACAO_*.md` - Detalhes de implementação

### Status dos Documentos
- ✅ Completo e atualizado
- 🔄 Em revisão
- 📝 Em desenvolvimento
- ⏳ Planejado

---

## 🤝 Contribuindo

1. Leia a documentação relevante
2. Siga as convenções do projeto
3. Documente suas alterações
4. Atualize este índice se necessário

---

**Última atualização:** 04/10/2025
**Versão do Launcher:** 1.0.0
**Desenvolvido com ❤️ pela equipe NeuroGame**
