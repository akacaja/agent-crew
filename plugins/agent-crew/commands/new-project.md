---
description: Prepara o projeto aberto para o kit, com uma conversa curta (cada pergunta pode ser pulada) sobre a pessoa, o projeto e o sistema de design
argument-hint: (opcional) o que é o projeto
---

Prepare este projeto para o pipeline do agent-crew. Não altere nenhum código existente.

O idioma é sempre a primeira escolha. Se ele já foi respondido nesta conversa (por exemplo, no `/agent-crew:start`), use-o e não pergunte de novo. Se não, a primeira pergunta é o idioma, escrita em português e em inglês: "Em qual idioma você prefere conversar? / Which language do you prefer?", com as opções Português, English, Español, outro e "Pular". Daqui em diante, tudo é dito nesse idioma.

Se `.crew/profile.md` já existir (por exemplo, criado por um comando `/agent-crew:set-…`), mantenha os valores que a pessoa já escolheu e pergunte só o que ainda está no padrão.

Contexto dado pela pessoa: $ARGUMENTS

## 1. Conversa de preparação

Faça as perguntas abaixo **uma de cada vez**, esperando cada resposta. Use a ferramenta de perguntas com opções, se existir; senão, pergunte em texto com as opções numeradas. Nunca suponha uma resposta.

**Toda pergunta pode ser pulada.** Cada uma tem a opção "Pular (usar o padrão: …)", dizendo qual é o padrão. Antes da primeira pergunta depois do idioma, diga numa linha que dá para pular qualquer uma e definir depois com um comando. Também ofereça, logo no começo, "Pular tudo e usar os padrões". Item pulado vai para o perfil com o valor padrão e a marca "(padrão)":

| Item | Padrão |
| --- | --- |
| Idioma | o idioma em que a pessoa escreve |
| Nível | iniciante |
| Área de atuação | geral |
| Tipo de projeto | pessoal, só no computador, sem regras extras |
| O que é o projeto | "a definir" |
| Sistema de design | tema simples criado pelo kit, com valores neutros |

0. **Idioma**, se ainda não foi escolhido (veja acima). Ele vai para o campo "Idioma" do perfil, escrito como a pessoa escolheu (por exemplo "Português" ou "English"); o painel da pipeline usa esse campo.
1. **Nível com desenvolvimento usando IA:**
   - Iniciante: estou começando, quero explicações completas.
   - Intermediário: já criei alguns projetos, quero explicações curtas.
   - Avançado: sou desenvolvedor ou já domino; quero só o essencial.
2. **Área de atuação** (para escolher exemplos que façam sentido): design, produto, desenvolvimento, dados ou outra.
3. **O projeto é pessoal ou de uma empresa?**
   - Se for de empresa, pergunte: onde o código deve ficar (por exemplo, a organização da empresa no GitHub ou no Bitbucket) e se há regras da empresa a seguir (contas corporativas, serviços proibidos, aprovação antes de publicar).
   - Se for pessoal, pergunte onde o código vai ficar (GitHub pessoal, outro lugar ou só no computador por enquanto).
4. **O que é o projeto**, em uma ou duas frases, se os argumentos ainda não disserem.
5. **Sistema de design:**
   - Figma: peça o link. Se houver ferramentas do Figma conectadas, use-as para ler variáveis e componentes. Se não houver, peça prints das telas principais em `context/prototype/`.
   - Biblioteca pronta (por exemplo shadcn/ui, MUI, Chakra, Bootstrap, Tailwind UI): pergunte qual.
   - Já existe no código: peça para confirmar onde e confira com o explorer.
   - Nenhum: faça até 4 perguntas para criar um tema simples (estilo desejado, uma cor de destaque, fonte preferida ou "tanto faz", cantos retos ou arredondados), cada uma também com a opção de pular.

Para iniciantes, explique em uma frase por que cada pergunta importa. Para avançados, pergunte direto.

## 2. Leitura do projeto

Peça ao agente `explorer` um resumo do projeto: linguagem, framework, estrutura de pastas e comandos de teste, lint, build e rodar localmente. Se a pasta estiver vazia, registre isso.

## 3. Arquivos

Os modelos ficam em `${CLAUDE_PLUGIN_ROOT}/templates/`. Se não conseguir abrir, procure `agent-crew/templates/` dentro de `~/.claude/plugins/`.

1. `.crew/profile.md` a partir de `templates/profile.md`, preenchido com as respostas e com "(padrão)" nos itens pulados. Mantenha as tabelas "Como mudar" e "Como o kit se comporta em cada nível".
2. `CLAUDE.md`: se não existir, crie a partir de `templates/CLAUDE.md`, preenchendo "Sobre o projeto" com o resumo do explorer. Se já existir, não substitua: acrescente ao fim só as seções "Quem está usando", "Pipeline do kit" e "Regras". Se existir um `AGENTS.md`, mantenha-o e acrescente ao `CLAUDE.md` uma linha pedindo que ele também seja lido.
3. `context/README.md` explicando que ali vão documentos de referência (specs, decisões, exemplos) em markdown, e prints em `context/prototype/`.
4. `context/design.md` a partir de `templates/design.md`, preenchido com a origem do sistema de design. Não escreva valores de cor ou fonte nele.
5. `.crew/current-card/` (vazia), `.crew/archive/` (vazia), `.crew/new-files.md` (vazio) e `.crew/glossary.md` com o título `# Glossário`.
6. Acrescente `.crew/` ao `.gitignore` (crie o arquivo se faltar).

## 4. Fechamento

Peça ao agente `mentor` para explicar, no nível da pessoa, o que cada arquivo e pasta criados é e por que existe.

Depois, mostre **Suas configurações**: uma tabela com cada item, o valor escolhido (ou "padrão", se foi pulado) e o comando para mudar (`/agent-crew:set-language`, `set-level`, `set-area`, `set-project`, `set-design`). Ensine numa linha como rever tudo: `/agent-crew:profile`.

Termine com **O que fazer agora**, em até 3 itens. Normalmente:
- colocar documentos e prints em `context/`;
- rodar o primeiro card com `/agent-crew:card`, que, se o projeto estiver vazio, deve ser o esqueleto com o arquivo de tema e os componentes base;
- se algo foi pulado, o comando para definir quando quiser.
