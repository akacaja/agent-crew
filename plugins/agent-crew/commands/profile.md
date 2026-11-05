---
description: Mostra todas as configurações do projeto e como mudar cada uma
argument-hint: (opcional) o que mudar, por exemplo "nível avançado"
---

Abra `.crew/profile.md`. Se ele não existir, diga que o projeto ainda não tem configurações e ofereça `/agent-crew:new-project` (preparação completa, com cada pergunta podendo ser pulada) ou um dos comandos abaixo para definir só um item.

Pedido da pessoa: $ARGUMENTS

- **Sem pedido:** mostre, no idioma do perfil, uma tabela com cada configuração, o valor atual, se é o padrão (item pulado) e o comando para mudar:

| Configuração | Valor | Mudar com |
| --- | --- | --- |
| Idioma | … | `/agent-crew:set-language` |
| Nível | … | `/agent-crew:set-level` |
| Área de atuação | … | `/agent-crew:set-area` |
| Projeto (tipo, onde fica o código, regras) | … | `/agent-crew:set-project` |
| Sistema de design | … | `/agent-crew:set-design` |

  Depois, numa linha: "Para rever tudo de novo, use `/agent-crew:profile`."
- **Com pedido:** faça a mudança como o comando `set-…` correspondente faria (instruções em `templates/set-item.md`, em `${CLAUDE_PLUGIN_ROOT}/templates/`).
