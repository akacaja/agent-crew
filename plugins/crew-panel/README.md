# crew-panel

Painel visual da pipeline do agent-crew, dentro da própria IDE. Mostra em que etapa o card está (Explorar, Entender, Planejar, Implementar, Testar, Revisar, Documentar, Mentor), qual agente e modelo estão trabalhando, quanto tempo cada etapa levou, quando o card voltou para correção e quando um modelo reserva foi usado. Quando o kit espera sua resposta, a linha de status muda e chega uma notificação. Também tem um formulário para enviar feedback à autora do kit.

Comandos: `/crew-panel` abre o painel (ou mostra o mesmo conteúdo em texto, onde o painel não aparece) e `/crew-feedback` abre o formulário de feedback.

Requer a extensão do Claude Code 2.1.299 ou mais recente no VS Code ou no Cursor, ou o Claude Code no terminal. Instale junto com o plugin `agent-crew`. Documentação completa: https://github.com/akacaja/agent-crew
