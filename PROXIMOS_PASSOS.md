# Próximos Passos – NeuroGame Platform

Com backend, admin e launcher funcionando, os próximos passos recomendados focam em qualidade, operação e evolução do produto.

## 1. Qualidade e testes

- [ ] Adicionar testes unitários no backend (Jest + Supertest)
- [ ] Criar suíte end-to-end (Playwright ou Cypress) cobrindo login, gestão no admin e execução de jogo no launcher
- [ ] Configurar verificação automática de lint/format (ESLint + Prettier)

## 2. Observabilidade

- [ ] Integrar logs estruturados no backend (pino/winston)
- [ ] Adicionar monitoramento (Logflare/Sentry) para admin e launcher
- [ ] Configurar métricas básicas (requests/min, erros, latência)

## 3. Deploy e infra

- [ ] Publicar backend em serviço gerenciado (Render, Railway, Fly.io)
- [ ] Publicar admin (Vercel/Netlify) apontando para a API pública
- [ ] Empacotar launcher (`npm run build && npm run build:win` etc.)
- [ ] Automatizar releases com GitHub Actions (build + upload artefatos)

## 4. Produto

- [ ] Implementar fluxo de atualização automática no launcher (`check-for-updates`)
- [ ] Integrar pagamentos/assinaturas (ex.: Stripe) para planos Basic/Premium
- [ ] Criar página pública apresentando a plataforma (landing page)
- [ ] Planejar novos jogos e conteúdo

## 5. Segurança

- [ ] Rotacionar periodicamente as chaves do Supabase (anon/service)
- [ ] Habilitar 2FA nas contas administrativas
- [ ] Revisar políticas RLS e permissões na tabela `users`
- [ ] Implementar auditoria de ações críticas no backend

## 6. Documentação contínua

- [ ] Registrar changelog por release
- [ ] Adicionar diagramas atualizados de arquitetura
- [ ] Documentar endpoints no Swagger/OpenAPI
- [ ] Criar manual de operação para suporte

## 7. Roadmap sugerido (30-60 dias)

1. Semana 1-2: testes automatizados + pipeline CI/CD
2. Semana 3-4: deploy público + observabilidade
3. Semana 5-6: pagamento e melhorias no launcher
4. Semana 7-8: novos jogos, landing page e documentação extra

Com esses passos, o projeto evolui de um MVP funcional para um produto pronto para escala e manutenção contínua.
