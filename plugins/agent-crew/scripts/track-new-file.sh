#!/bin/sh
# Roda antes de cada gravação de arquivo. Se o arquivo ainda não existe,
# anota o caminho em .crew/new-files.md para o mentor explicar no fim do card.
# Nunca bloqueia a gravação: sai sempre com código 0.

entrada=$(cat)

caminho=$(printf '%s' "$entrada" \
  | tr -d '\n' \
  | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' \
  | head -n 1 \
  | sed 's/.*:[[:space:]]*"\(.*\)"/\1/')

[ -z "$caminho" ] && exit 0
[ -e "$caminho" ] && exit 0

projeto="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Só registra arquivos de projetos preparados com /agent-crew:new-project
[ -d "$projeto/.crew" ] || exit 0

# Não registra os rascunhos do próprio kit
case "$caminho" in
  "$projeto/.crew/"*|.crew/*) exit 0 ;;
esac

relativo=${caminho#"$projeto/"}
lista="$projeto/.crew/new-files.md"

grep -qxF -- "- $relativo" "$lista" 2>/dev/null || printf -- '- %s\n' "$relativo" >> "$lista"

exit 0
