---
description: Define o sistema de design do projeto (Figma, biblioteca pronta, código existente ou tema simples)
argument-hint: (opcional) a origem, por exemplo um link do Figma ou "shadcn/ui"
---

Siga as instruções de `templates/set-item.md` (em `${CLAUDE_PLUGIN_ROOT}/templates/`) para a seção **Sistema de design** do perfil.

Pedido da pessoa: $ARGUMENTS

Opções:
- Figma: peça o link. Se houver ferramentas do Figma conectadas, use-as para ler variáveis e componentes; se não, peça prints das telas principais em `context/prototype/`.
- Biblioteca pronta (shadcn/ui, MUI, Chakra, Bootstrap, Tailwind UI ou outra): pergunte qual.
- Já existe no código: peça para confirmar onde.
- Tema simples: até 4 perguntas (estilo, uma cor de destaque, fonte preferida ou "tanto faz", cantos retos ou arredondados), cada uma com a opção de pular.

Atualize também `context/design.md` (a partir de `templates/design.md`, se não existir), sem escrever valores de cor ou fonte nele. Avise que telas já prontas não mudam sozinhas: aplicar o sistema novo nelas é um card.
