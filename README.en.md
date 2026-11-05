# agent-crew

[Português](README.md)

A kit for building software with AI in Claude Code. Every task goes through a team of specialist agents, and a mentor explains what was done at your level and in your language.

Made for two kinds of people:

- **People starting to build with AI.** The kit asks before acting, explains the plan without jargon, and teaches every new term.
- **Developers who don't have time to keep up with every new AI practice.** The kit applies a workflow with good practices (plan, tests, review, one model per kind of task) and only tells you what matters.

The kit always replies in the language you write in.

## Start in 2 steps

**1. Install.** Open the Claude panel in VS Code or Cursor and paste this:

```
Install agent-crew for me. In the terminal, run: claude plugin install agent-crew --marketplace akacaja/agent-crew
If that command doesn't work, first run "claude plugin marketplace add akacaja/agent-crew" and then "claude plugin install agent-crew@agent-crew".
If the claude command isn't found, explain how to install it from the /plugins screen by adding the akacaja/agent-crew marketplace.
At the end, tell me whether it worked and what I need to do for the commands to show up.
```

The pipeline panel (`crew-panel`) comes with it.

**2. Start.** Type `/agent-crew:start`. The kit checks what your computer is missing, explains how it works at your level and offers a practice project.

## How it works

You describe a task (a "card") and the kit does the rest:

| Step | Agent | Model | What it does |
| --- | --- | --- | --- |
| 1 | explorer | Haiku | Reads the code and the `context/` folder and summarizes what matters |
| 2 | planner | Opus | Lists open questions and asks you before planning. Never assumes |
| 3 | planner | Opus | Writes the plan and explains it at your level. You approve it |
| 4 | implementer | Sonnet | Writes the code following the plan and the design system |
| 5 | tester | Haiku | Runs tests, lint, build and checks the screen |
| 6 | reviewer | Opus | Reviews the code against the plan |
| 7 | documenter | Haiku | Writes the PR description |
| 8 | mentor | Sonnet | Explains everything and tells you what to do next |

After each step, the kit tells you what was done, which files were created or changed, how and why.

## Pipeline panel

The `crew-panel` plugin shows, next to the chat, which step the card is in: each step's agent and model, how long each took, when the card went back for fixes and when a fallback model was used. The status line shows the current step. When the kit is waiting for you (to approve the plan, for example), it changes, a toast appears and you get a notification.

- In VS Code and Cursor the panel sits above the prompt, on a single line. **See steps** opens the full list in an editor tab that updates on its own; if the editor doesn't allow it, the list opens right there.
- `/crew-panel` opens the panel. Where it can't be drawn, the command prints the same content as text.
- `/crew-feedback` opens the panel's **Feedback** tab: pick like or dislike, write a comment and send it:
  - **Send feedback:** sends straight from the panel, no account needed; only the author sees it.
  - **Post on GitHub Issues:** opens GitHub in your browser, already filled in; just check it and post. No GitHub account? You'll need to create one. Don't worry, it's free. What you write there is public.

  Only the rating, the comment, the panel version and your editor are sent; nothing from your code or project.

The panel needs the Claude Code extension 2.1.299 or later.

Each agent uses the right model for the job: the strongest ones plan and review, the fastest ones read and test. If a model isn't available, the kit uses a fallback and tells you.

## Levels

| | Beginner | Intermediate | Advanced |
| --- | --- | --- | --- |
| Questions | Every open question, with example answers | The ones that change the result | Only blockers |
| Plan approval | Always, explained step by step | Always, summarized | Only for large or risky cards |
| Per-step explanation | Full, with analogies from your field | Short | One or two lines |
| Glossary | Yes | Yes | Only on request |

You pick a level when you set up the project and can change it any time. Every setup question can be skipped: the kit uses a default and you set it later with the `/agent-crew:set-…` commands.

## Requirements

- A Claude subscription (Pro, Max, Team or Enterprise) or a Claude Console account.
- Claude Code, through any of these:
  - the Claude Code extension in **VS Code**;
  - the Claude Code extension in **Cursor** or another VS Code-based editor;
  - the Claude Code plugin in **JetBrains** IDEs;
  - the **terminal**.

## Install

The easiest way is the text in "Start in 2 steps", above. Other ways:

**VS Code or Cursor, from the screen:**

1. In the Claude panel, type `/plugins`.
2. On the **Marketplaces** tab, add `akacaja/agent-crew`.
3. On the **Plugins** tab, install `agent-crew` (`crew-panel` comes with it). Choose **Install for you** to use it in every project.

**Terminal or JetBrains:**

```
/plugin install agent-crew --marketplace akacaja/agent-crew
```

On older Claude Code versions:

```
/plugin marketplace add akacaja/agent-crew
/plugin install agent-crew@agent-crew
```

`crew-panel` is a mod: a plugin with code that runs inside Claude Code, with your permissions. Its code is in `plugins/crew-panel/` if you want to review it before installing. `agent-crew` depends on it: if you disable the panel, disable the kit too.

## Commands

| Command | What it does |
| --- | --- |
| `/agent-crew:start` | Welcome: checks your computer, explains the kit and offers a practice project |
| `/agent-crew:new-project` | Sets up the project through a short conversation: your level, the project, its rules and the design system |
| `/agent-crew:card <task>` | Runs the task through the whole pipeline |
| `/agent-crew:mentor <question>` | Ask the mentor anything, any time |
| `/agent-crew:profile` | Shows every setting and the command to change each one |
| `/agent-crew:set-language` | Changes the language |
| `/agent-crew:set-level` | Changes the explanation level |
| `/agent-crew:set-area` | Changes your field (for the examples) |
| `/agent-crew:set-project` | Changes the project type, where the code lives and the rules |
| `/agent-crew:set-design` | Changes the design system |
| `/agent-crew:pause` | Pauses the current card at a safe point |
| `/agent-crew:resume` | Resumes a paused card |

## Getting started

First time with the kit? Run `/agent-crew:start`. For a real project:

1. Open the project folder in your editor (an empty folder works).
2. Run `/agent-crew:new-project` and answer the questions.
3. Put what the project needs to know in `context/`: documents, rules, examples, screenshots.
4. Run your first card, for example: `/agent-crew:card Create the app skeleton with the home screen`.

## Design system

During setup, the kit asks where the visual design comes from:

- **Figma:** a link (used through the Figma tools, if connected) or screenshots in `context/prototype/`;
- **An existing library:** shadcn/ui, MUI, Chakra, Bootstrap and others;
- **What already exists in the code;**
- **None:** the kit creates a simple theme from a few questions.

In every case, visual values live in a single theme file and screens use reusable components. Changing a color means changing one line.

## What the kit adds to your project

- `CLAUDE.md`: project instructions, read by Claude whenever it opens the folder.
- `context/`: your reference documents and `context/design.md`, with the design usage rules.
- `.crew/`: the profile, each step's summary, the card archive and the glossary. Kept out of Git.

## Safety

- One branch per card. No commits on the main branch.
- No commit, push, PR or deploy unless you ask.
- Passwords and keys never go into the code.
- Confirmation before commands that delete or overwrite.
- Your company's or project's rules are recorded in the profile and followed by every agent.

## Cost

Opus is the most expensive model and only runs for planning and review. The kit gives each agent only what it needs, not the whole conversation. Still, a card uses more than a simple request. For small changes, just ask Claude directly, without a card.

## License

[MIT](LICENSE). Contributions and suggestions are welcome in the issues.
