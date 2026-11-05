#!/bin/sh
# Roda no início de cada sessão. O texto impresso aqui entra no contexto do Claude.

projeto="${CLAUDE_PROJECT_DIR:-$(pwd)}"

if [ -f "$projeto/.crew/profile.md" ]; then
  cat <<'TEXTO'
[agent-crew] Este projeto usa o pipeline do kit.
- Leia .crew/profile.md antes de responder: nível, idioma, área de atuação, regras do projeto e sistema de design.
- Responda sempre no idioma da pessoa e no nível de explicação do perfil.
- Para tarefas de código, use /agent-crew:card. Nunca assuma: pergunte.
- Sem commit, push, PR ou deploy sem pedido. Confirme antes de comandos que apagam ou sobrescrevem.
- Card pausado? Veja .crew/current-card/status.md e sugira /agent-crew:resume.
TEXTO
elif [ -d "$projeto/.crew" ]; then
  echo "[agent-crew] Este projeto foi preparado numa versão antiga do kit e não tem .crew/profile.md. Sugira rodar /agent-crew:new-project para criar o perfil (ele não apaga nada)."
else
  echo "[agent-crew] Este projeto ainda não foi preparado. Se a pessoa for trabalhar nele com o kit, sugira /agent-crew:new-project. Se for a primeira vez dela com o kit, sugira antes /agent-crew:start."
fi

exit 0
