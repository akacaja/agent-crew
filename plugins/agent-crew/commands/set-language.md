---
description: Define o idioma em que o kit conversa / Sets the language the crew speaks
argument-hint: (opcional) o idioma, por exemplo "English"
---

Siga as instruções de `templates/set-item.md` (em `${CLAUDE_PLUGIN_ROOT}/templates/`) para o item **Idioma** do perfil.

Valor pedido: $ARGUMENTS

- Se não houver valor, pergunte em português e em inglês: "Em qual idioma você prefere conversar? / Which language do you prefer?". Opções: Português, English, Español, outro e "Manter como está".
- Grave o nome do idioma como a pessoa escolheu (por exemplo "Português" ou "English"): o painel da pipeline lê esse campo.
- Responda já no idioma novo.
