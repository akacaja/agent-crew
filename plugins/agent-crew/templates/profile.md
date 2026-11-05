# Perfil do projeto

Criado pelo /agent-crew:new-project (ou pelo primeiro comando /agent-crew:set-…). Pode ser editado à mão.
Todos os agentes do kit leem este arquivo antes de trabalhar.
Um item marcado "(padrão)" foi pulado na preparação: o kit usa o valor padrão até a pessoa escolher outro.

## Pessoa

- **Idioma:** [o idioma escolhido; se pulado, o idioma em que a pessoa escreve (padrão)]
- **Nível:** [iniciante | intermediário | avançado; se pulado, iniciante (padrão)]
- **Área de atuação:** [ex.: design, produto, desenvolvimento, dados, outra; se pulado, geral (padrão)]

## Projeto

- **Tipo:** [pessoal | empresa; se pulado, pessoal (padrão)]
- **O que é:** [uma ou duas frases]
- **Onde fica o repositório:** [ex.: GitHub pessoal, organização da empresa, só local por enquanto; se pulado, só no computador (padrão)]
- **Branch principal:** [ex.: main]
- **Regras extras da empresa ou do projeto:** [ex.: contas corporativas para hospedagem; nada de serviços externos sem aprovação; se pulado, nenhuma (padrão)]

## Sistema de design

- **Origem:** [Figma | biblioteca pronta | já existe no código | tema simples; se pulado, tema simples criado pelo kit com valores neutros (padrão)]
- **Referência:** [link do Figma, nome da biblioteca (ex.: shadcn/ui, MUI, Chakra, Bootstrap) ou caminho no código]
- **Detalhes:** em `context/design.md`

## Como mudar

| O quê | Comando |
| --- | --- |
| Ver e revisar tudo | `/agent-crew:profile` |
| Idioma | `/agent-crew:set-language` |
| Nível | `/agent-crew:set-level` |
| Área de atuação | `/agent-crew:set-area` |
| Tipo de projeto, onde fica o código e regras | `/agent-crew:set-project` |
| Sistema de design | `/agent-crew:set-design` |

## Como o kit se comporta em cada nível

| | Iniciante | Intermediário | Avançado |
| --- | --- | --- | --- |
| Perguntas antes de planejar | Todas as dúvidas, uma de cada vez, com exemplos de resposta | As dúvidas que mudam o resultado | Só as que bloqueiam |
| Aprovação do plano | Sempre, com o plano explicado passo a passo | Sempre, com o plano resumido | Só quando o card é grande ou arriscado |
| Explicação ao fim de cada etapa | Completa: o que, como, por quê, com analogias e definição de cada termo novo | Curta: o que mudou e por quê; define só termos novos | Uma ou duas linhas por etapa |
| Relatório final do mentor | Completo, com glossário e pergunta "Para fixar" | Médio, com termos novos | Resumo técnico: decisões, trade-offs, riscos |
| Glossário | Sim | Sim | Só se pedir |
