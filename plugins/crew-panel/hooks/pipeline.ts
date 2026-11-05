// Pure pipeline logic: takes the card and an event, returns the new card.
// Nothing here talks to Claude Code, so it can be tested on its own.

import type { Card, Lang, Stage, StageId, StageStatus, WaitKind } from '../types'

export const STAGES: { id: StageId; agent: string; model: string }[] = [
  { id: 'explore', agent: 'explorer', model: 'haiku' },
  { id: 'understand', agent: 'planner', model: 'opus' },
  { id: 'plan', agent: 'planner', model: 'opus' },
  { id: 'implement', agent: 'implementer', model: 'sonnet' },
  { id: 'test', agent: 'tester', model: 'haiku' },
  { id: 'review', agent: 'reviewer', model: 'opus' },
  { id: 'document', agent: 'documenter', model: 'haiku' },
  { id: 'mentor', agent: 'mentor', model: 'sonnet' }
]

// Everything the panel says, in each language it speaks.
export const TEXT = {
  en: {
    stage: { explore: 'Explore', understand: 'Understand', plan: 'Plan', implement: 'Implement', test: 'Test', review: 'Review', document: 'Document', mentor: 'Mentor' },
    doing: {
      explore: 'Reading the code and the context/ folder',
      understand: 'Listing questions about the request',
      plan: 'Writing the plan',
      implement: 'Writing the code',
      test: 'Running tests, lint and build',
      review: 'Comparing the result with the plan',
      document: 'Writing the PR description',
      mentor: 'Preparing the report'
    },
    wait: {
      'approve-plan': 'Approve the plan in the chat',
      'answer-questions': 'Answer the questions in the chat',
      'reply-to-start': 'Reply in the chat to start the card',
      reply: 'The crew is waiting for your reply in the chat'
    },
    untitled: 'Untitled card',
    waitingFor: 'Waiting for you',
    finished: (name: string, min: number) => `Card done: ${name} · ${min} min · report in the chat`,
    starting: 'starting',
    fixRound: (n: number) => `Fixing: round ${n}`,
    of8: (name: string, n: number) => `${name} (${n} of 8)`,
    noCard: 'No card in progress. Start one with /agent-crew:card.',
    reserve: 'fallback',
    pill: { done: 'Done', waiting: 'Waiting for you', fixing: 'Fixing', running: 'In progress' },
    step: (n: number, name: string) => `Step ${n} of 8: ${name}`,
    cardDone: 'Card done',
    beginning: 'Starting',
    fileNote: 'This file updates on its own at every step. Close the tab whenever you like.',
    between: 'Preparing the next step',
    tookTime: (d: string) => `Took ${d}`,
    sofar: (d: string) => `${d} so far`,
    doneCount: (n: number) => `${n} of 8 done`,
    now: 'now',
    ranOnReserve: ' · ran on the fallback model',
    fixingDetail: (n: number) => `Fixing what came back · round ${n}`,
    rejectedDetail: 'Sent back for fixes',
    waitingDetail: 'Waiting for you in the chat',
    footer: {
      done: ['What to do now', 'The mentor’s report is in the chat, with the next steps: test, commit and the open items.'],
      waiting: ['Waiting for you', (w: string) => `${w}. The crew continues when you reply.`],
      fixing: ['Why it came back', 'Tests or review found things to fix. After the fix, the card goes through tests and review again.'],
      last: ['Last step done', (s: string) => `${s}. The explanation is in the chat.`],
      next: ['Next', 'After exploring, the crew may ask you questions about the request.']
    },
    sendFeedback: 'Send feedback',
    showAll: 'See steps',
    showLess: 'Show less',
    clear: 'Clear panel',
    emptyTitle: 'No card in progress',
    emptyBody: 'Start one with /agent-crew:card and follow the steps here.',
    panelOpened: 'Pipeline panel opened.',
    feedbackOpened: 'Feedback form opened.',
    feedbackNoPane: (url: string) => `To send feedback from here, update the Claude Code extension. Or write at ${url}`,
    paneTitle: 'Pipeline',
    feedbackTitle: 'Feedback',
    thanks: 'Thank you for your feedback!',
    thanksBody: 'It was sent to the author of the kit.',
    close: 'Close',
    backToPipeline: 'Back to the pipeline',
    question: 'What do you think of the crew?',
    like: 'Like',
    dislike: 'Dislike',
    commentLabel: 'Comment, suggestion or problem (optional)',
    commentPlaceholder: 'Write here',
    sending: 'Sending…',
    sendError: (url: string) => `Couldn't send it now. Try again, or write at ${url}`,
    viaGithub: 'Post on GitHub Issues ↗',
    githubNote: 'Opens GitHub in your browser, already filled in. No GitHub account? You’ll need to create one; don’t worry, it’s free. What you write there is public.',
    formNote: 'Private: only the author sees it.',
    waitingToast: (w: string) => `Waiting for you: ${w}`,
    notifyTitle: 'agent-crew: waiting for you'
  },
  pt: {
    stage: { explore: 'Explorar', understand: 'Entender', plan: 'Planejar', implement: 'Implementar', test: 'Testar', review: 'Revisar', document: 'Documentar', mentor: 'Mentor' },
    doing: {
      explore: 'Lendo o código e a pasta context/',
      understand: 'Levantando dúvidas sobre o pedido',
      plan: 'Montando o plano',
      implement: 'Escrevendo o código',
      test: 'Rodando testes, lint e build',
      review: 'Comparando o resultado com o plano',
      document: 'Escrevendo a descrição do PR',
      mentor: 'Preparando o relatório'
    },
    wait: {
      'approve-plan': 'Aprove o plano no chat',
      'answer-questions': 'Responda às perguntas no chat',
      'reply-to-start': 'Responda no chat para o card começar',
      reply: 'A equipe está esperando sua resposta no chat'
    },
    untitled: 'Card sem nome',
    waitingFor: 'Aguardando você',
    finished: (name: string, min: number) => `Card concluído: ${name} · ${min} min · relatório no chat`,
    starting: 'começando',
    fixRound: (n: number) => `Correção: volta ${n}`,
    of8: (name: string, n: number) => `${name} (${n} de 8)`,
    noCard: 'Nenhum card em andamento. Comece um com /agent-crew:card.',
    reserve: 'reserva',
    pill: { done: 'Concluído', waiting: 'Aguardando você', fixing: 'Em correção', running: 'Em andamento' },
    step: (n: number, name: string) => `Etapa ${n} de 8: ${name}`,
    cardDone: 'Card concluído',
    beginning: 'Começando',
    fileNote: 'Este arquivo se atualiza sozinho a cada etapa. Pode fechar a aba quando quiser.',
    between: 'Preparando a próxima etapa',
    tookTime: (d: string) => `Levou ${d}`,
    sofar: (d: string) => `${d} até agora`,
    doneCount: (n: number) => `${n} de 8 concluídas`,
    now: 'agora',
    ranOnReserve: ' · rodou no reserva',
    fixingDetail: (n: number) => `Corrigindo o que voltou · volta ${n}`,
    rejectedDetail: 'Voltou para correção',
    waitingDetail: 'Aguardando você no chat',
    footer: {
      done: ['O que fazer agora', 'O relatório do mentor está no chat, com os próximos passos: testar, fazer o commit e as pendências.'],
      waiting: ['Aguardando você', (w: string) => `${w}. A equipe continua quando você responder.`],
      fixing: ['Por que voltou', 'Testes ou review encontraram pontos a corrigir. Depois da correção, o card passa de novo por testes e review.'],
      last: ['Última etapa concluída', (s: string) => `${s}. A explicação está no chat.`],
      next: ['Próximo', 'Depois da exploração, a equipe pode te fazer perguntas sobre o pedido.']
    },
    sendFeedback: 'Enviar feedback',
    showAll: 'Ver etapas',
    showLess: 'Mostrar menos',
    clear: 'Limpar painel',
    emptyTitle: 'Nenhum card em andamento',
    emptyBody: 'Comece um com /agent-crew:card e acompanhe as etapas aqui.',
    panelOpened: 'Painel da pipeline aberto.',
    feedbackOpened: 'Formulário de feedback aberto.',
    feedbackNoPane: (url: string) => `Para enviar feedback por aqui, atualize a extensão do Claude Code. Ou escreva em ${url}`,
    paneTitle: 'Pipeline',
    feedbackTitle: 'Feedback',
    thanks: 'Obrigada pelo feedback!',
    thanksBody: 'Ele foi enviado para a autora do kit.',
    close: 'Fechar',
    backToPipeline: 'Voltar para a pipeline',
    question: 'O que você achou da equipe?',
    like: 'Gostei',
    dislike: 'Não gostei',
    commentLabel: 'Comentário, sugestão ou problema (opcional)',
    commentPlaceholder: 'Escreva aqui',
    sending: 'Enviando…',
    sendError: (url: string) => `Não deu para enviar agora. Tente de novo, ou escreva em ${url}`,
    viaGithub: 'Publicar pelo GitHub Issues ↗',
    githubNote: 'Abre o GitHub no navegador, já preenchido. Se você não tiver uma conta, vai precisar criar uma; não se preocupe, é grátis. O que você escrever lá fica público.',
    formNote: 'Privado: só a autora vê.',
    waitingToast: (w: string) => `Aguardando você: ${w}`,
    notifyTitle: 'agent-crew: aguardando você'
  }
} as const

export type Texts = (typeof TEXT)[Lang]

/** Reads the language from .crew/profile.md ("Idioma:" or "Language:"). English unless it says Portuguese. */
export function langFromProfile(profile: string): Lang {
  const match = /\*\*(?:Idioma|Language):\*\*\s*(.+)/i.exec(profile)
  const value = (match?.[1] ?? '').trim().toLowerCase()
  return value.startsWith('pt') || value.includes('portugu') ? 'pt' : 'en'
}

export const indexOf = (id: StageId): number => STAGES.findIndex(s => s.id === id)
export function stageInfo(id: StageId): (typeof STAGES)[number] {
  const found = STAGES.find(s => s.id === id)
  if (!found) throw new Error(`Unknown stage: ${id}`)
  return found
}

export const getStage = (card: Card, id: StageId): Stage => card.stages.find(s => s.id === id) ?? { id, status: 'pending' }

export function prettyModel(model: string | undefined): string {
  const m = (model ?? '').toLowerCase()
  if (m.includes('opus')) return 'Opus'
  if (m.includes('sonnet')) return 'Sonnet'
  if (m.includes('haiku')) return 'Haiku'
  return model ?? ''
}

/** The crew agent from the subagent type ("agent-crew:tester" → "tester"). */
export function crewAgent(subagentType: string): string | undefined {
  const [plugin, name] = subagentType.split(':')
  if (plugin !== 'agent-crew' || !name) return undefined
  return STAGES.some(s => s.agent === name) ? name : undefined
}

export function startCard(name: string, now: number, untitled: string = TEXT.en.untitled): Card {
  return {
    name: name.trim().slice(0, 80) || untitled,
    startedAt: now,
    stages: STAGES.map(s => ({ id: s.id, status: 'pending' })),
    round: 0,
    isFinished: false,
    agents: {}
  }
}

const setStage = (card: Card, id: StageId, patch: Partial<Stage>): Stage[] =>
  card.stages.map(s => (s.id === id ? { ...s, ...patch } : s))

const isActive = (status: StageStatus) => status === 'running' || status === 'fixing'

/** Which stage a crew agent is starting now. */
export function stageForAgent(card: Card, agent: string): StageId | undefined {
  if (agent === 'planner') return getStage(card, 'understand').status === 'pending' ? 'understand' : 'plan'
  return STAGES.find(s => s.agent === agent)?.id
}

export function onSpawn(
  card: Card,
  agent: string,
  agentId: string | undefined,
  model: string | undefined,
  requestedModel: string | undefined,
  now: number
): Card {
  const id = stageForAgent(card, agent)
  if (!id) return card
  const info = stageInfo(id)
  // An agent still shown as running (for example, in the background) finished before this one started.
  const stillRunning = card.stages.filter(s => isActive(s.status)).map(s => s.id)
  const lastDone = stillRunning.length > 0 ? stillRunning[stillRunning.length - 1] : card.lastDone
  let stages = card.stages.map(s =>
    isActive(s.status) || s.status === 'waiting'
      ? { ...s, status: 'done' as const, ms: s.ms ?? (s.startedAt ? now - s.startedAt : undefined) }
      : s
  )
  let round = card.round
  let status: StageStatus = 'running'
  // The implementer coming back after tests or review: it's a fix.
  if (id === 'implement' && lastDone && indexOf(lastDone) > indexOf('implement')) {
    round += 1
    status = 'fixing'
    const back = lastDone
    stages = stages.map(s => (s.id === back ? { ...s, status: 'rejected' as const } : s))
  }
  const isReserve = requestedModel !== undefined && requestedModel.toLowerCase() !== info.model
  stages = stages.map(s =>
    s.id === id ? { ...s, status, model: model ?? requestedModel ?? info.model, isReserve, startedAt: now, ms: undefined } : s
  )
  return {
    ...card,
    stages,
    round,
    lastDone,
    waiting: undefined,
    agents: agentId ? { ...card.agents, [agentId]: id } : card.agents
  }
}

export function onAgentDone(card: Card, agentId: string, now: number): Card {
  const id = card.agents[agentId]
  if (!id) return card
  const stage = getStage(card, id)
  if (!isActive(stage.status)) return card
  const ms = stage.startedAt ? now - stage.startedAt : undefined
  const next: Card = { ...card, stages: setStage(card, id, { status: 'done', ms }), lastDone: id }
  return id === 'mentor' ? { ...next, isFinished: true, endedAt: now, waiting: undefined } : next
}

/** End of a main-conversation turn: if nothing is running, the crew is waiting for the person. */
export function onMainTurnEnd(card: Card): { card: Card; isNewWait: boolean } {
  if (card.isFinished || card.stages.some(s => isActive(s.status)) || card.waiting) return { card, isNewWait: false }
  const last = card.lastDone
  const kind: WaitKind =
    last === 'plan' ? 'approve-plan' : last === 'understand' ? 'answer-questions' : last === undefined ? 'reply-to-start' : 'reply'
  const target: StageId = last ?? 'explore'
  return { card: { ...card, waiting: kind, stages: setStage(card, target, { status: 'waiting' }) }, isNewWait: true }
}

/** The person replied: what was waiting goes back to done (or pending, if it never ran). */
export function onUserReply(card: Card): Card {
  if (!card.waiting) return card
  return {
    ...card,
    waiting: undefined,
    stages: card.stages.map(s =>
      s.status === 'waiting' ? { ...s, status: s.startedAt ? ('done' as const) : ('pending' as const) } : s
    )
  }
}

/** A progress bar that draws the same in any font: ● done, ○ still to do. */
export const progressDots = (done: number): string => '●'.repeat(done) + '○'.repeat(Math.max(0, 8 - done))

export function formatDuration(ms: number | undefined): string {
  if (ms === undefined || ms < 0) return ''
  const total = Math.round(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}h${String(m).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function currentStage(card: Card): Stage | undefined {
  return card.stages.find(s => s.status === 'waiting') ?? card.stages.find(s => isActive(s.status))
}

export function statusLine(card: Card | null, lang: Lang = 'en'): string | undefined {
  const t = TEXT[lang]
  if (!card) return undefined
  if (card.isFinished) {
    const min = Math.max(1, Math.round(((card.endedAt ?? card.startedAt) - card.startedAt) / 60000))
    return t.finished(card.name, min)
  }
  if (card.waiting) return `${t.waitingFor}: ${t.wait[card.waiting]} · ${card.name}`
  const cur = currentStage(card)
  if (!cur) return `${card.name} · ${card.stages.some(s => s.status === 'done') ? t.between : t.starting}`
  const info = stageInfo(cur.id)
  const label = cur.status === 'fixing' ? t.fixRound(card.round) : t.of8(t.stage[cur.id], indexOf(cur.id) + 1)
  return `${card.name} · ${label} · ${info.agent} · ${prettyModel(cur.model ?? info.model)}`
}

/** The panel's content as text, for where the panel can't be drawn. */
export function textReport(card: Card | null, now: number, lang: Lang = 'en'): string {
  const t = TEXT[lang]
  if (!card) return t.noCard
  const icons: Record<StageStatus, string> = { pending: '○', running: '◐', done: '✓', waiting: '‖', fixing: '↻', rejected: '↩' }
  const lines = [`${card.name}${card.branch ? ` (${card.branch})` : ''} · ${formatDuration((card.endedAt ?? now) - card.startedAt)}`]
  if (card.waiting) lines.push(`${t.waitingFor}: ${t.wait[card.waiting]}`)
  for (const s of card.stages) {
    const info = stageInfo(s.id)
    const extra = s.isReserve ? ` · ${t.reserve}` : ''
    lines.push(`${icons[s.status]} ${indexOf(s.id) + 1}. ${t.stage[s.id]} · ${info.agent} · ${prettyModel(s.model ?? info.model)}${extra}${s.ms ? ' · ' + formatDuration(s.ms) : ''}`)
  }
  return lines.join('\n')
}

/** The full pipeline as a Markdown file, opened in an editor tab so the panel above the prompt can stay small. */
export function pipelineFile(card: Card, now: number, lang: Lang = 'en'): string {
  const t = TEXT[lang]
  const done = card.stages.filter(s => s.status === 'done').length
  const pill = card.isFinished
    ? t.pill.done
    : card.waiting
      ? `${t.pill.waiting}: ${t.wait[card.waiting]}`
      : card.stages.some(s => s.status === 'fixing')
        ? t.pill.fixing
        : t.pill.running
  const icons: Record<StageStatus, string> = { pending: '○', running: '◐', done: '✓', waiting: '‖', fixing: '↻', rejected: '↩' }
  const lines = [
    `# ${card.name}`,
    '',
    `**${pill}** · ${progressDots(done)} ${t.doneCount(done)} · ${formatDuration((card.endedAt ?? now) - card.startedAt)}${card.branch ? ` · ${card.branch}` : ''}`,
    ''
  ]
  for (const s of card.stages) {
    const info = stageInfo(s.id)
    const parts = [`${icons[s.status]} **${indexOf(s.id) + 1}. ${t.stage[s.id]}**`, info.agent, prettyModel(s.model ?? info.model)]
    if (s.isReserve) parts.push(t.reserve)
    if (s.ms) parts.push(formatDuration(s.ms))
    lines.push(`- ${parts.join(' · ')}`)
    if (s.status === 'running') lines.push(`  - ${t.doing[s.id]}`)
  }
  lines.push('', `_${t.fileNote}_`, '')
  return lines.join('\n')
}

// ---- Feedback ----

export const REPO_URL = 'https://github.com/akacaja/agent-crew'

type FeedbackDetails = { rating?: 'like' | 'dislike'; comment: string; version: string; editor: string }

// The option texts of the rating question, the same in the GitHub issue form and the Google Form.
export const RATING_OPTION = { like: 'Gostei / Like', dislike: 'Não gostei / Dislike', none: 'Sem nota / No rating' } as const

const ratingOption = (rating: FeedbackDetails['rating']) => (rating ? RATING_OPTION[rating] : RATING_OPTION.none)

/** The GitHub "new issue" link, filled in from the panel (the issue form .github/ISSUE_TEMPLATE/feedback.yml). */
export function githubIssueUrl(d: FeedbackDetails): string {
  const build = (comment: string) => {
    const params = new URLSearchParams({
      template: 'feedback.yml',
      title: `Feedback: ${d.rating === 'like' ? 'Like' : d.rating === 'dislike' ? 'Dislike' : 'comment'}`,
      rating: ratingOption(d.rating),
      comment,
      version: d.version,
      editor: d.editor
    })
    return `${REPO_URL}/issues/new?${params.toString()}`
  }
  // A link holds at most 2048 characters: cut a long comment so the link still opens (the rest can be typed there).
  let comment = d.comment.trim()
  let url = build(comment)
  while (url.length > 2000 && comment.length > 0) {
    comment = comment.slice(0, Math.max(0, comment.length - 100))
    url = build(comment ? `${comment}…` : '')
  }
  return url
}

export const googleFormUrl = (id: string) => `https://docs.google.com/forms/d/e/${id}/formResponse`

/** The Google Form answer, as the form's own page would send it. */
export function googleFormBody(
  form: { rating: string; comment: string; version: string; editor: string },
  d: FeedbackDetails
): string {
  const params = new URLSearchParams()
  if (form.rating) params.set(`entry.${form.rating}`, ratingOption(d.rating))
  if (form.comment) params.set(`entry.${form.comment}`, d.comment.trim())
  if (form.version) params.set(`entry.${form.version}`, d.version)
  if (form.editor) params.set(`entry.${form.editor}`, d.editor)
  return params.toString()
}
