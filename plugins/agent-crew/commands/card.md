---
description: Executa uma tarefa pelo pipeline de agentes, explicando cada etapa no nível da pessoa
argument-hint: o que precisa ser feito
---

Execute este card pelo pipeline do kit. Você é o orquestrador: delega cada etapa ao agente certo, guarda o resumo de cada uma em `.crew/current-card/` e conversa com a pessoa.

**Card:** $ARGUMENTS

## Antes de começar

1. Leia `.crew/profile.md`. Se ele não existir, pare e sugira `/agent-crew:new-project`.
2. Use o nível, o idioma e a área de atuação do perfil em tudo o que disser à pessoa. Responda sempre no idioma dela.
3. Se `.crew/current-card/` tiver arquivos de outro card, pergunte se é para retomar aquele card (`/agent-crew:resume`) ou arquivá-lo e começar este.
4. Confira com `git status` se há mudanças não salvas de um card anterior. Se houver, pergunte se ela quer fazer o commit antes.
5. Crie uma branch para o card a partir da branch principal (ou da branch do card anterior, se ele ainda não foi integrado), com um nome curto como `card-3-previa`. Diga o nome à pessoa.

## Etapas

Em cada etapa, passe ao agente só o que ele precisa: o card, `.crew/profile.md`, o plano e os resumos anteriores. Nunca a conversa inteira.

Chame os agentes do kit um de cada vez e em primeiro plano (`run_in_background: false`): cada etapa depende do resultado da anterior, e o painel do kit (plugin `crew-panel`) acompanha a pipeline por essas chamadas. Chame o planner duas vezes, mesmo que não haja dúvidas: a primeira para o entendimento, a segunda para o plano.

1. **Explorer** → resumo do código e de `context/` relevante para o card. Salve em `.crew/current-card/1-exploration.md`.

2. **Entender o pedido.** Peça ao **planner** só a lista de dúvidas sobre o card (sem plano ainda), com base no card e na exploração. Se houver dúvidas:
   - faça as perguntas à pessoa, uma de cada vez, no estilo do nível dela (iniciante: com exemplos de resposta; avançado: direto);
   - nunca preencha uma lacuna com suposição. "Tanto faz" da pessoa é uma resposta válida: registre a escolha feita;
   - salve perguntas e respostas em `.crew/current-card/2-understanding.md`.

3. **Planner** → plano completo com as respostas. Salve em `.crew/current-card/3-plan.md`. Mostre o plano à pessoa como o planner explicou, no nível dela, e peça aprovação:
   - iniciante e intermediário: sempre;
   - avançado: só se o card criar mais de 5 arquivos, mexer em dados, login, pagamentos, segurança ou deploy, ou tiver decisão difícil de desfazer. Nos outros casos, mostre o resumo e siga.
   Se ela pedir mudanças, volte ao planner.

4. **Implementer** → executa o plano aprovado. Salve em `.crew/current-card/4-implementation.md`.

5. **Tester** → testes, lint, build e, se o card mexe em telas, verificação no navegador. Salve em `.crew/current-card/5-tests.md`. Se falhar, devolva ao implementer com o relatório. Máximo de 2 voltas; depois disso, pare e explique o bloqueio.

6. **Reviewer** → salve em `.crew/current-card/6-review.md`. Se reprovar, devolva ao implementer e repita testes e review. Máximo de 2 voltas.

7. **Documenter** → descrição do PR em `.crew/current-card/7-pr.md`. Não abra o PR.

8. **Mentor** → relatório final. Ele lê `.crew/profile.md`, `.crew/current-card/`, `.crew/new-files.md` e `.crew/glossary.md`. Mostre o relatório completo à pessoa, sem resumir.

## Explicação ao fim de cada etapa

Ao terminar as etapas 1, 4, 5, 6 e 7, escreva você mesmo, a partir do handoff da etapa, um bloco **Etapa concluída** no nível da pessoa (sem chamar o mentor):

- **O que foi feito.**
- **Arquivos criados ou alterados:** para cada um, o que mudou, como e por quê. Iniciante: com uma analogia ligada à área de atuação dela e a definição de cada termo novo. Intermediário: uma linha por arquivo. Avançado: só a lista com uma palavra de motivo.
- **O que vem agora** (a próxima etapa).

Nas voltas de correção (teste ou review reprovado), diga o que deu errado em uma frase, no nível dela.

## Ao fim do card

1. Termine com **O que fazer agora**, em até 4 itens, por exemplo: revisar o resultado no navegador (com o comando para ligar o servidor), fazer o commit na branch do card, o que entrou como pendência, sugestão do próximo card.
2. Não faça commit sem a pessoa pedir. Quando ela pedir, faça na branch do card.
3. Arquive os handoffs: mova `.crew/current-card/*` e uma cópia de `.crew/new-files.md` para `.crew/archive/<nome-da-branch>/`. Esvazie `.crew/new-files.md`. Nunca apague handoffs: arquive.
4. Se ligou um servidor de desenvolvimento, pergunte se pode desligar.

## Modelo reserva

| Agente | Principal | Reserva |
| --- | --- | --- |
| planner | opus | sonnet |
| reviewer | opus | sonnet |
| implementer | sonnet | opus |
| mentor | sonnet | haiku |
| explorer | haiku | sonnet |
| tester | haiku | sonnet |
| documenter | haiku | sonnet |

Se um agente falhar porque o modelo não está disponível, não foi liberado pela organização ou exige créditos extras, chame o mesmo agente de novo com o modelo reserva no parâmetro `model`. Tente o reserva uma única vez. Se também falhar, pare e explique qual modelo faltou. Registre a troca no handoff da etapa, para o mentor contar.

Nunca escolha por conta própria um modelo que exija créditos pagos à parte.

## Regras

- Nunca assuma: pergunte.
- Não faça commit, push, PR ou deploy sem a pessoa pedir.
- Peça confirmação antes de qualquer comando que apague ou sobrescreva coisas.
- Siga as regras extras de `.crew/profile.md`.
- Não chame o mentor no meio do card, a não ser que a pessoa peça.
