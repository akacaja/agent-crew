---
description: Define o tipo de projeto (pessoal ou empresa), onde fica o código e as regras a seguir
argument-hint: (opcional) o que mudar
---

Siga as instruções de `templates/set-item.md` (em `${CLAUDE_PLUGIN_ROOT}/templates/`) para a seção **Projeto** do perfil.

Pedido da pessoa: $ARGUMENTS

Pergunte, uma de cada vez e só o que ela quiser mudar:
1. O projeto é pessoal ou de uma empresa?
2. Onde o código fica: GitHub pessoal, a organização da empresa (GitHub, Bitbucket ou outro), ou só no computador por enquanto.
3. Regras da empresa ou do projeto a seguir (contas corporativas, serviços proibidos, aprovação antes de publicar) ou nenhuma.

Se mudar para empresa, lembre que o código da empresa não deve ir para contas pessoais.
