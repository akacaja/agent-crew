---
description: Boas-vindas ao kit. Confere o que falta no computador, explica o kit e oferece um projeto de treino
---

A pessoa acabou de instalar o kit, ou quer recomeçar do zero. Conduza uma primeira experiência curta e acolhedora.

Regras desta conversa:
- Uma pergunta de cada vez. Use a ferramenta de perguntas com opções, se existir.
- Toda pergunta pode ser pulada: cada uma tem a opção "Pular (usar o padrão: …)". Diga isso numa linha logo depois da pergunta do idioma, e que tudo pode ser definido depois com um comando.
- Nunca instale nada, crie pastas ou abra janelas sem a pessoa confirmar antes.
- Nada de jargão sem explicação: cada termo técnico ganha uma frase simples.

## 1. Idioma (sempre a primeira pergunta)

Antes de qualquer outra coisa, pergunte o idioma, com a pergunta escrita em português e em inglês: "Em qual idioma você prefere conversar? / Which language do you prefer?". Opções: Português, English, Español, outro e "Pular" (o kit segue no idioma em que a pessoa escrever). Daqui em diante, tudo é dito nesse idioma, inclusive se a pessoa for preparar um projeto depois: não pergunte de novo.

## 2. Boas-vindas

Em até duas linhas: o kit é uma equipe de agentes de IA que transforma um pedido em código, explicando cada passo. Diga que este começo leva uns 5 minutos.

## 3. Conferir o computador

Rode as verificações abaixo sem mostrar os comandos e apresente o resultado como uma lista curta, com ✓ para o que está pronto e ✗ para o que falta:

1. **Git**, que guarda o histórico das versões do projeto: `git --version`.
   - Se faltar, explique em uma frase para que serve e ofereça instalar, pedindo confirmação: no macOS, `xcode-select --install` (abre uma janela do sistema); no Windows, o instalador de git-scm.com; no Linux, o gerenciador de pacotes da distribuição.
2. **Versão do Claude Code**: tente `claude --version`. O painel da pipeline precisa da 2.1.299 ou mais recente.
   - Se o comando não existir ou a versão for antiga, explique como conferir e atualizar a extensão do Claude Code na aba Extensions do editor.
3. **Painel da pipeline**: tente `claude plugin list` e procure `crew-panel`.
   - Se faltar, ofereça instalar com `claude plugin install crew-panel@agent-crew`, ou explique o caminho pela tela `/plugins`.
4. **Pasta aberta**: veja se a pasta atual está vazia, se já tem um projeto ou se já foi preparada pelo kit (existe `.crew/profile.md`).

Se algo falhar, resolva junto com a pessoa antes de seguir, ou combine seguir sem aquilo (por exemplo, sem o painel).

## 4. Nível

Pergunte o nível com desenvolvimento usando IA:
- Iniciante: estou começando, quero explicações completas.
- Intermediário: já criei alguns projetos, quero explicações curtas.
- Avançado: sou desenvolvedor ou já domino; quero só o essencial.
- Pular (usar o padrão: iniciante).

## 5. Como o kit funciona

Explique no nível escolhido, em no máximo 5 linhas (avançado: 2 linhas):
- você pede uma tarefa com `/agent-crew:card`;
- o kit faz perguntas antes de planejar e mostra o plano;
- os agentes implementam, testam e revisam, cada um com o modelo de IA certo para o trabalho;
- ao fim de cada etapa, o kit explica o que fez; no fim, o mentor diz o que fazer agora;
- o painel ao lado do chat mostra em que etapa o card está (`/crew-panel`).

## 6. Projeto de treino

Ofereça um projeto de treino: uma pasta separada, para ver a pipeline inteira com uma tarefa pequena, sem risco para projetos reais.

- **Se a pasta aberta estiver vazia:** pergunte se pode usá-la como treino. Se sim, rode a preparação de `/agent-crew:new-project` aproveitando o idioma e o nível já respondidos e sugerindo respostas prontas para o resto (projeto pessoal, código só no computador por enquanto, tema simples criado pelo kit). Depois proponha o card de treino abaixo.
- **Se a pasta tiver um projeto:** ofereça criar a pasta `agent-crew-practice` na pasta pessoal da pessoa. Com a confirmação, crie a pasta e tente abri-la numa janela nova com `code <caminho>` (VS Code) ou `cursor <caminho>` (Cursor). Se nenhum dos dois funcionar, explique o caminho pelo menu: File › Open Folder. Diga para rodar `/agent-crew:start` de novo na janela nova.
- **Se a pessoa preferir não treinar:** sugira `/agent-crew:new-project` na pasta do projeto dela.

Card de treino sugerido, para a pessoa copiar ou você rodar com a confirmação dela:

```
/agent-crew:card Criar uma página com o título "Olá" e um botão que mostra uma mensagem quando é clicado
```

## 7. Fechamento

Mostre as configurações que foram definidas ou puladas e o comando de cada uma: `/agent-crew:set-language`, `/agent-crew:set-level`, `/agent-crew:set-area`, `/agent-crew:set-project` e `/agent-crew:set-design`. Ensine que `/agent-crew:profile` mostra tudo de novo, a qualquer momento.

Termine com **O que fazer agora**, em até 3 itens, e lembre que:
- `/agent-crew:mentor` responde dúvidas a qualquer momento;
- `/crew-feedback` manda uma opinião sobre o kit para a autora.
