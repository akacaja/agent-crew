---
description: Pausa o card em andamento num ponto seguro para continuar depois
---

A pessoa quer pausar. Responda no idioma dela e no nível de `.crew/profile.md`.

1. Termine a etapa em andamento, sem começar a próxima.
2. Escreva `.crew/current-card/status.md` com: o card, a branch, a etapa em que parou, o que já foi feito, decisões já tomadas com a pessoa e qual é o próximo passo.
3. Se houver mudanças no código, faça um commit local na branch do card (nunca na principal) com a mensagem "<nome do card> (em andamento)". Não faça push.
4. Se houver um servidor de desenvolvimento ligado, desligue.
5. Confirme o que foi salvo e diga como retomar: `/agent-crew:resume`.
