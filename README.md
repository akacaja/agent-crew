# agent-crew

[English](README.en.md)

Um kit para desenvolver com IA no Claude Code. Cada tarefa passa por uma equipe de agentes especialistas, e um mentor explica o que foi feito no seu nível e no seu idioma.

Feito para dois tipos de pessoa:

- **Quem está começando a desenvolver com IA.** O kit faz perguntas antes de agir, explica o plano sem jargão e ensina cada termo novo.
- **Quem já desenvolve, mas não tem tempo de acompanhar cada novidade de IA.** O kit aplica um fluxo com boas práticas (plano, testes, review, um modelo por tipo de tarefa) e fala só o essencial.

## Comece em 2 passos

**1. Instale.** Abra o painel do Claude no VS Code ou no Cursor e cole este texto:

```
Instale o agent-crew para mim. No terminal, rode: claude plugin install agent-crew --marketplace akacaja/agent-crew
Se esse comando não funcionar, rode antes "claude plugin marketplace add akacaja/agent-crew" e depois "claude plugin install agent-crew@agent-crew".
Se o comando claude não for encontrado, me explique como instalar pela tela /plugins, adicionando o marketplace akacaja/agent-crew.
No fim, me diga se deu certo e o que eu preciso fazer para os comandos aparecerem.
```

O painel da pipeline (`crew-panel`) vem junto.

**2. Comece.** Digite `/agent-crew:start`. O kit confere o que falta no seu computador, explica como funciona no seu nível e oferece um projeto de treino.

## Como funciona

Você descreve uma tarefa (um "card") e o kit cuida do resto:

| Etapa | Agente | Modelo | O que faz |
| --- | --- | --- | --- |
| 1 | explorer | Haiku | Lê o código e a pasta `context/` e resume o que importa |
| 2 | planner | Opus | Lista dúvidas e pergunta antes de planejar. Nunca assume |
| 3 | planner | Opus | Monta o plano e explica no seu nível. Você aprova |
| 4 | implementer | Sonnet | Escreve o código seguindo o plano e o sistema de design |
| 5 | tester | Haiku | Roda testes, lint, build e confere a tela |
| 6 | reviewer | Opus | Faz o code review comparando com o plano |
| 7 | documenter | Haiku | Escreve a descrição do PR |
| 8 | mentor | Sonnet | Explica tudo e diz o que fazer agora |

Ao fim de cada etapa, o kit conta o que foi feito, quais arquivos foram criados ou alterados, como e por quê.

## Painel da pipeline

O plugin `crew-panel` mostra, ao lado do chat, em que etapa o card está: o agente e o modelo de cada etapa, quanto tempo cada uma levou, quando o card voltou para correção e quando um modelo reserva foi usado. A linha de status mostra a etapa atual. Quando o kit espera sua resposta (para aprovar o plano, por exemplo), ela muda, aparece um aviso e chega uma notificação.

- No VS Code e no Cursor, o painel fica acima da caixa de texto, numa linha só. **Ver etapas** abre a lista completa numa aba do editor, que se atualiza sozinha; se o editor não deixar, a lista abre ali mesmo.
- `/crew-panel` abre o painel. Onde ele não aparece, o comando mostra o mesmo conteúdo em texto.
- `/crew-feedback` abre a aba **Feedback** do painel: escolha gostei ou não gostei, escreva um comentário e envie:
  - **Enviar feedback:** envia direto do painel, sem conta; só a autora vê.
  - **Publicar pelo GitHub Issues:** abre o GitHub no navegador com tudo já preenchido; é só conferir e publicar. Se você não tiver uma conta, vai precisar criar uma. Não se preocupe, é grátis. O que você escrever lá fica público.

  Vão só a nota, o comentário, a versão do painel e o editor que você usa; nada do seu código ou do seu projeto.

O painel precisa da extensão do Claude Code 2.1.299 ou mais recente.

Cada agente usa o modelo certo para o trabalho: os mais fortes planejam e revisam, os mais rápidos leem e testam. Se um modelo não estiver disponível, o kit usa um reserva e avisa.

## Níveis

| | Iniciante | Intermediário | Avançado |
| --- | --- | --- | --- |
| Perguntas | Todas as dúvidas, com exemplos de resposta | As que mudam o resultado | Só as que bloqueiam |
| Aprovação do plano | Sempre, explicado passo a passo | Sempre, resumido | Só em cards grandes ou arriscados |
| Explicação por etapa | Completa, com analogias da sua área | Curta | Uma ou duas linhas |
| Glossário | Sim | Sim | Só se pedir |

Você escolhe o nível na preparação do projeto e muda quando quiser. Todas as perguntas da preparação podem ser puladas: o kit usa um padrão e você define depois com os comandos `/agent-crew:set-…`.

## Requisitos

- Uma assinatura do Claude (Pro, Max, Team ou Enterprise) ou uma conta do Claude Console.
- O Claude Code, por qualquer um destes caminhos:
  - extensão do Claude Code no **VS Code**;
  - extensão do Claude Code no **Cursor** ou em outro editor derivado do VS Code;
  - plugin do Claude Code nas IDEs da **JetBrains**;
  - **terminal**.

## Instalar

O jeito mais fácil é o texto de "Comece em 2 passos", acima. Outros caminhos:

**VS Code ou Cursor, pela tela:**

1. No painel do Claude, digite `/plugins`.
2. Na aba **Marketplaces**, adicione `akacaja/agent-crew`.
3. Na aba **Plugins**, instale `agent-crew` (o `crew-panel` vem junto). Escolha **Install for you** para usar em todos os projetos.

**Terminal ou JetBrains:**

```
/plugin install agent-crew --marketplace akacaja/agent-crew
```

Em versões mais antigas do Claude Code:

```
/plugin marketplace add akacaja/agent-crew
/plugin install agent-crew@agent-crew
```

O `crew-panel` é um mod: um plugin com código que roda dentro do Claude Code, com as suas permissões. O código dele está em `plugins/crew-panel/` para quem quiser conferir antes de instalar. O `agent-crew` depende dele: se você desativar o painel, desative o kit também.

## Comandos

| Comando | O que faz |
| --- | --- |
| `/agent-crew:start` | Boas-vindas: confere o computador, explica o kit e oferece um projeto de treino |
| `/agent-crew:new-project` | Prepara o projeto com uma conversa curta: seu nível, o projeto, as regras e o sistema de design |
| `/agent-crew:card <tarefa>` | Roda a tarefa pelo pipeline inteiro |
| `/agent-crew:mentor <pergunta>` | Pergunta algo ao mentor a qualquer momento |
| `/agent-crew:profile` | Mostra todas as configurações e o comando para mudar cada uma |
| `/agent-crew:set-language` | Muda o idioma |
| `/agent-crew:set-level` | Muda o nível de explicação |
| `/agent-crew:set-area` | Muda a sua área de atuação (para os exemplos) |
| `/agent-crew:set-project` | Muda o tipo de projeto, onde fica o código e as regras |
| `/agent-crew:set-design` | Muda o sistema de design |
| `/agent-crew:pause` | Pausa o card num ponto seguro |
| `/agent-crew:resume` | Continua um card pausado |

## Primeiros passos

Primeira vez com o kit? Rode `/agent-crew:start`. Para um projeto real:

1. Abra a pasta do projeto no editor (pode ser uma pasta vazia).
2. Rode `/agent-crew:new-project` e responda às perguntas.
3. Coloque em `context/` o que o projeto precisa saber: documentos, regras, exemplos, prints de telas.
4. Rode o primeiro card, por exemplo: `/agent-crew:card Criar o esqueleto do app com a tela inicial`.

## Sistema de design

Na preparação, o kit pergunta de onde vem o visual:

- **Figma:** um link (usado pelas ferramentas do Figma, se estiverem conectadas) ou prints em `context/prototype/`;
- **Biblioteca pronta:** shadcn/ui, MUI, Chakra, Bootstrap e outras;
- **O que já existe no código;**
- **Nenhum:** o kit cria um tema simples a partir de poucas perguntas.

Em todos os casos, os valores visuais ficam num único arquivo de tema, e as telas usam componentes reutilizáveis. Trocar uma cor é mudar uma linha.

## O que o kit cria no seu projeto

- `CLAUDE.md`: as instruções do projeto, lidas pelo Claude sempre que abre a pasta.
- `context/`: seus documentos de referência e `context/design.md`, com as regras de uso do visual.
- `.crew/`: o perfil, os resumos de cada etapa, o arquivo dos cards e o glossário. Fica fora do Git.

## Segurança

- Uma branch por card. Nada de commit na branch principal.
- Sem commit, push, PR ou deploy sem você pedir.
- Senhas e chaves nunca entram no código.
- Confirmação antes de comandos que apagam ou sobrescrevem.
- Regras da sua empresa ou do projeto ficam registradas no perfil e são seguidas por todos os agentes.

## Custo

Opus é o modelo mais caro e roda só no planejamento e no review. O kit passa para cada agente só o que ele precisa, e não a conversa inteira. Mesmo assim, um card usa mais do que um pedido simples. Para mudanças pequenas, você pode pedir direto ao Claude, sem o card.

## Licença

[MIT](LICENSE). Contribuições e sugestões são bem-vindas nas issues.
