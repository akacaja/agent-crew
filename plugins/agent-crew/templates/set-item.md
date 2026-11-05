# Como um comando /agent-crew:set-… trabalha

Instruções comuns aos comandos set-language, set-level, set-area, set-project e set-design.

1. Abra `.crew/profile.md`. Se ele não existir, crie-o a partir de `templates/profile.md` (em `${CLAUDE_PLUGIN_ROOT}/templates/`, ou em `agent-crew/templates/` dentro de `~/.claude/plugins/`), com todos os itens no valor padrão marcado "(padrão)", e acrescente `.crew/` ao `.gitignore`. Diga numa frase que o projeto ainda não foi preparado e que `/agent-crew:new-project` faz o resto quando a pessoa quiser.
2. Fale no idioma do perfil (no `set-language`, no idioma novo assim que ele for escolhido).
3. Se a pessoa já disse o valor junto com o comando, use-o. Se não, mostre o valor atual (e se é o padrão) e pergunte o novo, com opções e uma opção "Manter como está". Use a ferramenta de perguntas com opções, se existir.
4. Atualize só a linha desse item no perfil, sem a marca "(padrão)". Não mexa em nenhum outro arquivo, a não ser o que o comando disser.
5. Confirme em uma frase o que mudou e o que isso muda no comportamento do kit.
6. Se houver um card em andamento, diga que a mudança vale a partir da próxima etapa.
7. Termine lembrando, numa linha, que `/agent-crew:profile` mostra todas as configurações e os comandos para mudar cada uma.
