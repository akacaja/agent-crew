# Changelog

## crew-panel 0.6.0 (2026-11-04)

- O feedback deixa de usar o FormSubmit (o serviço estava fora do ar, erro 522) e ganha dois caminhos, sem os rótulos "Opção 1" e "Opção 2":
  - **Enviar feedback** (Google Forms), logo abaixo da caixa de comentário: envio direto do painel, sem conta. O formulário fica em `GOOGLE_FORM`, no `register.tsx` (se o id ficar vazio, o botão some).
  - **Publicar pelo GitHub Issues**, abaixo, com o aviso sobre a conta: um link que abre o GitHub já preenchido com a nota, o comentário, a versão e o editor (formulário em `.github/ISSUE_TEMPLATE/feedback.yml`). Comentários longos são cortados para o link caber.
- O e-mail da autora não aparece mais no código.
- Acima da caixa de texto, o painel compacto agora ocupa uma linha só: bolinhas, etapa atual, quantas foram feitas e o tempo, com o botão "Ver etapas" ao lado. O nome do card fica na lista completa e na linha de status.
- "Ver etapas" abre a lista completa numa aba do editor (`.crew/current-card/pipeline.md`, que se atualiza a cada etapa), pela conexão da extensão com o editor. Se o editor não deixar, a lista abre ali mesmo, como antes.
- Entre uma etapa e outra, o painel diz "Preparando a próxima etapa" em vez de voltar para "Começando".

## crew-panel 0.5.4 (2026-11-04)

- Envio de feedback mais robusto: avisa ao FormSubmit de onde vem o formulário, entende a resposta dele e, se der erro, mostra o motivo embaixo da mensagem.

## crew-panel 0.5.3 (2026-11-04)

- Aba atual e avaliação escolhida aparecem como texto sublinhado, sem botão; só o que dá para trocar é botão. O editor desenha todo botão com fundo próprio, então essa é a forma de marcar o que está ativo.

## crew-panel 0.5.2 (2026-11-04)

- Botão "Enviar feedback" abaixo da caixa de comentário. Enter continua enviando, indicado por ↵ ao lado da caixa.

## crew-panel 0.5.1 (2026-11-04)

- Abas e botões de avaliação em contorno, preenchidos só quando escolhidos; a borda destaca ao passar o mouse.

## crew-panel 0.5.0 (2026-11-04)

- O feedback agora é uma aba dentro do mesmo painel (Pipeline | Feedback), em vez de um segundo painel. Some o título duplicado e a rolagem ao trocar de aba.
- Avaliação com ícones de polegar para cima e para baixo (contorno; preenchido quando escolhido). No terminal, que não desenha ícones, ficam só os textos.
- Depois de enviar, o botão "Voltar para a pipeline" volta para a primeira aba.

## 0.9.0 (2026-11-04)

- Todas as perguntas da preparação podem ser puladas, uma a uma ou todas de uma vez. Item pulado usa um padrão e fica marcado "(padrão)" no perfil.
- Novos comandos para definir um item a qualquer momento: `/agent-crew:set-language`, `set-level`, `set-area`, `set-project` e `set-design`. Funcionam até antes de preparar o projeto.
- `/agent-crew:profile` mostra uma tabela com cada configuração, se é padrão e o comando para mudar.
- No fim da preparação, o kit mostra "Suas configurações" e ensina como revê-las.

## 0.8.0 (2026-11-04)

- O idioma é sempre a primeira pergunta, no `/agent-crew:start` e no `/agent-crew:new-project`, e não é perguntado de novo na mesma conversa.
- Painel compacto acima da caixa de texto (VS Code e Cursor): nome do card, etapa atual, agente e modelo, progresso e aviso. A lista completa abre em "Ver todas as etapas".
- Barra de progresso que aparece igual em qualquer fonte (● e ○).
- Sem perfil no projeto, o painel usa o último idioma escolhido.

## 0.7.0 (2026-11-04)

- O projeto passa a se chamar **agent-crew**. Repositório: akacaja/agent-crew.
- Plugins: `kit-agentes` → `agent-crew` e `kit-painel` → `crew-panel`. Comandos: `/agent-crew:start`, `new-project`, `card`, `mentor`, `profile`, `pause`, `resume`, `/crew-panel` e `/crew-feedback`.
- Agentes em inglês: explorer, planner, implementer, tester, reviewer, documenter e mentor.
- Pastas e arquivos em inglês: `.kit/` → `.crew/` (`profile.md`, `current-card/`, `archive/`, `glossary.md`, `new-files.md`) e `contexto/` → `context/` (`README.md`, `design.md`, `prototype/`).
- O painel fala inglês ou português, conforme o idioma do perfil do projeto; as etapas aparecem como Explore, Understand, Plan, Implement, Test, Review, Document e Mentor em inglês.
- Projetos preparados com versões anteriores precisam rodar `/agent-crew:new-project` de novo.

## 0.6.0 (2026-11-04)

- Novo `/kit-agentes:start`: boas-vindas, conferência do computador (Git, versão do Claude Code, painel), explicação no nível da pessoa e projeto de treino com um card pequeno.
- Instalar o `kit-agentes` instala junto o `kit-painel`.
- README começa com um texto pronto para colar no Claude do editor, que faz a instalação.

## 0.5.0 (2026-11-04)

- Comandos em inglês: `/kit-agentes:new-project`, `/kit-agentes:card`, `/kit-agentes:mentor`, `/kit-agentes:profile`, `/kit-agentes:pause`, `/kit-agentes:resume`, `/kit-panel` e `/kit-feedback`. O kit continua respondendo no idioma da pessoa.
- O destino do feedback fica numa única linha do código, pronto para trocar o e-mail pelo apelido do FormSubmit.

## 0.4.0 (2026-11-04)

- Novo plugin `kit-painel`: painel da pipeline ao lado do chat, com as 8 etapas, agente, modelo, tempo, correções e uso do modelo reserva.
- Linha de status com a etapa atual. Quando o kit espera você, ela muda, aparece um aviso e chega uma notificação.
- Formulário de feedback (gostei ou não gostei, mais um comentário) enviado por e-mail para a autora: `/kit-feedback` ou o botão no painel.
- `/kit-painel` abre o painel, ou mostra o mesmo conteúdo em texto onde o painel não aparece.
- O card chama os agentes em primeiro plano, um de cada vez, e o planejador sempre duas vezes (entendimento e plano).

## 0.3.0 (2026-11-04)

- Perfil por projeto (`.kit/perfil.md`): nível (iniciante, intermediário, avançado), área de atuação, idioma, tipo de projeto e regras.
- O kit responde no idioma da pessoa.
- Conversa de preparação no `/kit-agentes:novo-projeto`, com perguntas uma de cada vez.
- Sistema de design: Figma, biblioteca pronta, código existente ou tema simples criado pelo kit. Valores só no arquivo de tema; regras de uso em `contexto/design.md`.
- O card agora tem uma etapa de entendimento: o planejador lista dúvidas e o kit pergunta antes de planejar. Nunca assume.
- Plano explicado no nível da pessoa, com aprovação conforme o nível.
- Explicação ao fim de cada etapa: o que foi feito, arquivos criados ou alterados, como e por quê.
- "O que fazer agora" ao fim do card.
- Branch própria por card e conferência de mudanças não salvas antes de começar.
- Testador confere a tela no navegador quando o card mexe em interface.
- Revisor confere o sistema de design e as regras do perfil.
- Handoffs são arquivados em `.kit/arquivo/`, nunca apagados.
- Novos comandos: `/kit-agentes:perfil`, `/kit-agentes:pausar` e `/kit-agentes:retomar`.
- Confirmação antes de comandos que apagam ou sobrescrevem.
- Regras específicas de uma empresa saíram do kit e passaram a ser configuradas no perfil.

## 0.2.0

- Modelo reserva por agente.
- Mentor com glossário e explicação de arquivos novos.
