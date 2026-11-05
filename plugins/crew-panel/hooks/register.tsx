import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderInput } from 'claude-code'

import type { Card, Feedback, Lang, Stage } from '../types'
import {
  STAGES,
  TEXT,
  crewAgent,
  currentStage,
  formatDuration,
  indexOf,
  langFromProfile,
  onAgentDone,
  onMainTurnEnd,
  onSpawn,
  onUserReply,
  prettyModel,
  progressDots,
  githubIssueUrl,
  googleFormBody,
  googleFormUrl,
  stageInfo,
  startCard,
  statusLine,
  pipelineFile,
  textReport
} from './pipeline'

const PANE = 'crew-pipeline'
const SAVE_PATH = '.crew/current-card/panel.json'
// The full list, for an editor tab (see openInEditor).
const FILE_PATH = '.crew/current-card/pipeline.md'
// The project folder, from session.start: the editor wants a full path.
let projectDir = ''
const PROFILE_PATH = '.crew/profile.md'
// Feedback, option 2: a Google Form. Fill these in from the form's prefilled link
// (docs.google.com/forms/d/e/<id>/viewform?entry.111=...): the form id and the entry
// number of each question. While the id is empty, option 2 stays hidden.
const GOOGLE_FORM = {
  id: '1FAIpQLSe32a2P_8J6G69I-Mv_e4wtvd844JVMo14rW4sSXrcDRhU_BA',
  rating: '2108114468',
  comment: '563074739',
  version: '1289978746',
  editor: '1342443962'
}
const ISSUES_URL = 'https://github.com/akacaja/agent-crew/issues'

// Change the tag when a value's shape changes: values an earlier version stored are dropped.
const cardAtom = atom({ plugin: 'crew-panel', key: 'card' } as const, null, { shape: 'card-2' })
const feedbackAtom = atom({ plugin: 'crew-panel', key: 'feedback' } as const, {}, { shape: 'feedback-2' })
const langAtom = atom({ plugin: 'crew-panel', key: 'lang' } as const, 'en', { shape: 'lang-1' })
// Whether the person opened the full list while the panel sits above the prompt.
const expandedAtom = atom({ plugin: 'crew-panel', key: 'expanded' } as const, false, { shape: 'expanded-1' })
// Which tab of the panel is showing: the pipeline or the feedback form (one pane, so no scroll between panes).
const viewAtom = atom({ plugin: 'crew-panel', key: 'view' } as const, 'pipeline', { shape: 'view-1' })
// How tall the compact panel asks to be above the prompt (the person's own size wins).
const COMPACT_ROWS = 4

type $ = EngineInterface

// The language of this project's profile; with no profile yet, the last one the person chose anywhere.
async function readLang($: $): Promise<Lang> {
  try {
    if (await $.fs.exists(PROFILE_PATH)) {
      const lang = langFromProfile(await $.fs.read(PROFILE_PATH))
      await update($, langAtom, () => lang)
      await $.store.set('lang', lang)
      return lang
    }
    const remembered = await $.store.get('lang')
    if (remembered === 'pt' || remembered === 'en') {
      await update($, langAtom, () => remembered)
      return remembered
    }
  } catch {
    // Nothing readable: keep the language we have.
  }
  return read($, langAtom)
}

async function save($: $, card: Card | null): Promise<void> {
  try {
    if (card && (await $.fs.exists('.crew'))) {
      await $.fs.write(SAVE_PATH, JSON.stringify(card, null, 2))
      await $.fs.write(FILE_PATH, pipelineFile(card, Date.now(), await read($, langAtom)))
    }
  } catch {
    // No .crew folder or no permission: the panel keeps going in the session's memory only.
  }
}

async function setCard($: $, fn: (card: Card | null) => Card | null): Promise<Card | null> {
  let result: Card | null = null
  await update($, cardAtom, current => {
    result = fn(current)
    return result
  })
  $.ui.status(statusLine(result, await read($, langAtom)))
  await save($, result)
  return result
}

async function readBranch($: $): Promise<string | undefined> {
  try {
    const { exitCode, stdout } = await $.process.run(['git', 'branch', '--show-current'])
    const name = stdout.trim()
    return exitCode === 0 && name ? name : undefined
  } catch {
    return undefined
  }
}

/**
 * Opens the full list in an editor tab, through the editor's own connection to Claude
 * (the "ide" server of the VS Code and Cursor extension). False when the editor can't,
 * so the panel opens the list in place, as before.
 */
async function openInEditor($: $): Promise<boolean> {
  const card = await read($, cardAtom)
  if (!card || !projectDir) return false
  try {
    if (!(await $.fs.exists('.crew'))) return false
    await $.fs.write(FILE_PATH, pipelineFile(card, Date.now(), await read($, langAtom)))
    const result = await $.mcp.call('ide', 'openFile', {
      filePath: `${projectDir.replace(/\/$/, '')}/${FILE_PATH}`,
      preview: false,
      makeFrontmost: true
    })
    return !result.isError
  } catch {
    return false
  }
}

async function openPane($: $): Promise<boolean> {
  const opened = await $.ui.open({ id: PANE, title: 'agent-crew', rows: COMPACT_ROWS })
  return opened.isPlaced
}

async function openFeedback($: $): Promise<boolean> {
  await update($, viewAtom, () => 'feedback' as const)
  return openPane($)
}

// Thumbs icons for the feedback rating (outline; filled while chosen).
const thumb = (dir: 'up' | 'down', isOn: boolean): string => {
  const color = isOn ? '#5b9bff' : '#9aa0a6'
  const fill = isOn ? color : 'none'
  const d =
    dir === 'up'
      ? 'M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z'
      : 'M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${fill}" fill-opacity="0.25" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    projectDir = e.cwd
    await $.command.register({ name: 'crew-panel', description: 'agent-crew: show the card pipeline panel' })
    await $.command.register({ name: 'crew-feedback', description: 'agent-crew: send feedback to the author' })
    const lang = await readLang($)
    // Pick up the card saved in the project, if any.
    const current = await read($, cardAtom)
    if (!current) {
      try {
        if (await $.fs.exists(SAVE_PATH)) {
          const saved = JSON.parse(await $.fs.read(SAVE_PATH)) as Card
          if (saved && Array.isArray(saved.stages) && saved.stages.length === STAGES.length && typeof saved.round === 'number') {
            await update($, cardAtom, () => saved)
            $.ui.status(statusLine(saved, lang))
          }
        }
      } catch {
        // Unreadable file: start without a card.
      }
    } else {
      $.ui.status(statusLine(current, lang))
    }
    // Refresh the panel's times every 30 seconds.
    $.clock.every(30000, () => $.ui.invalidate('ui.render'))
    return next(e)
  })

  on('command.run', { command: 'crew-panel' }, async $ => {
    const lang = await read($, langAtom)
    if (await openPane($)) return { text: TEXT[lang].panelOpened }
    return { text: textReport(await read($, cardAtom), Date.now(), lang) }
  })

  on('command.run', { command: 'crew-feedback' }, async $ => {
    const t = TEXT[await read($, langAtom)]
    if (await openFeedback($)) return { text: t.feedbackOpened }
    return { text: t.feedbackNoPane(ISSUES_URL) }
  })

  // A card starts, or the person replies.
  on('prompt.submit', async ($, e, next) => {
    const command = e.command?.name ?? ''
    if (command === 'agent-crew:card') {
      const lang = await readLang($)
      const card = startCard(e.command?.args ?? '', Date.now(), TEXT[lang].untitled)
      card.branch = await readBranch($)
      await setCard($, () => card)
      void openPane($)
    } else if (command !== 'crew-panel' && command !== 'crew-feedback') {
      const card = await read($, cardAtom)
      if (card?.waiting) await setCard($, c => (c ? onUserReply(c) : c))
    }
    return next(e)
  })

  // A crew agent started.
  on('agent.spawn', async ($, e, next) => {
    const result = await next(e)
    const agent = crewAgent(e.subagentType)
    if (!agent || result.deny !== undefined) return result
    const branch = await readBranch($)
    const untitled = TEXT[await read($, langAtom)].untitled
    await setCard($, card => {
      const base = card && !card.isFinished ? card : startCard(untitled, Date.now(), untitled)
      const updated = onSpawn(base, agent, result.agentId, result.model, e.model, Date.now())
      return branch ? { ...updated, branch } : updated
    })
    return result
  })

  // A turn ended: a crew agent's, or the main conversation's.
  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    const card = await read($, cardAtom)
    if (!card) return result
    if (e.agentId) {
      if (card.agents[e.agentId]) await setCard($, c => (c ? onAgentDone(c, e.agentId as string, Date.now()) : c))
      return result
    }
    const { card: waitingCard, isNewWait } = onMainTurnEnd(card)
    if (isNewWait && waitingCard.waiting) {
      await setCard($, () => waitingCard)
      const t = TEXT[await read($, langAtom)]
      const text = `${t.wait[waitingCard.waiting]} · ${waitingCard.name}`
      $.ui.toast(t.waitingToast(text), { timeoutMs: 8000 })
      try {
        await $.ui.notify(text, { title: t.notifyTitle })
      } catch {
        // Notifications off: the heads-up stays in the status line and the panel.
      }
    }
    return result
  })

  // The panel: our own tabs on top, then the pipeline or the feedback form.
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button } = $.ui.resolve(e)
    const t = TEXT[await read($, langAtom)]
    const view = await read($, viewAtom)
    const { Text } = $.ui.resolve(e)
    // Compact above the prompt: no blank line between the tabs and the progress line.
    const isCompact = e.props.placement === 'inline' && view === 'pipeline' && !(await read($, expandedAtom))
    // Tabs: the one showing is plain underlined text; the other is a button to switch.
    // (The editor draws every button with its own fill, so a button can't look "off".)
    const tab = (id: 'pipeline' | 'feedback', label: string) =>
      view === id ? (
        <Box key={`chip-${id}`} paddingX={1}>
          <Text bold underline>
            {label}
          </Text>
        </Box>
      ) : (
        <Button key={`tab-${id}`} onPress={() => update($, viewAtom, () => id)}>
          {label}
        </Button>
      )
    return (
      <Box flexDirection="column" gap={isCompact ? 0 : 1}>
        <Box flexDirection="row" gap={1} paddingX={1} alignItems="center">
          {tab('pipeline', t.paneTitle)}
          {tab('feedback', t.feedbackTitle)}
        </Box>
        {view === 'feedback' ? await feedbackBody($, e) : await pipelineBody($, e)}
      </Box>
    )
  })
}

async function pipelineBody($: $, e: RenderInput<'Pane'>) {
    const { Box, Text, Button } = $.ui.resolve(e)
    const card = await read($, cardAtom)
    const t = TEXT[await read($, langAtom)]
    const now = Date.now()

    if (!card) {
      return (
        <Box flexDirection="column" gap={1} padding={1}>
          <Text bold>{t.emptyTitle}</Text>
          <Text dimColor>{t.emptyBody}</Text>
        </Box>
      )
    }

    const done = card.stages.filter(s => s.status === 'done').length
    const cur = currentStage(card)
    const pill = card.isFinished
      ? { text: t.pill.done, color: 'success' }
      : card.waiting
        ? { text: t.pill.waiting, color: 'warning' }
        : cur?.status === 'fixing'
          ? { text: t.pill.fixing, color: 'error' }
          : { text: t.pill.running, color: 'suggestion' }
    const stepLabel = card.isFinished
      ? t.cardDone
      : cur?.status === 'fixing'
        ? t.fixRound(card.round)
        : cur
          ? t.step(indexOf(cur.id) + 1, t.stage[cur.id])
          : done > 0
            ? t.between
            : t.beginning
    const elapsed = card.isFinished
      ? t.tookTime(formatDuration((card.endedAt ?? now) - card.startedAt))
      : t.sofar(formatDuration(now - card.startedAt))

    const icon = (s: Stage) =>
      ({
        done: { glyph: '✓', color: 'success' },
        running: { glyph: '◐', color: 'suggestion' },
        waiting: { glyph: '‖', color: 'warning' },
        fixing: { glyph: '↻', color: 'error' },
        rejected: { glyph: '↩', color: 'error' },
        pending: { glyph: '○', color: 'inactive' }
      })[s.status]

    const detail = (s: Stage): { text: string; color: string } | undefined => {
      if (s.status === 'running') return { text: t.doing[s.id], color: 'suggestion' }
      if (s.status === 'waiting') return { text: card.waiting ? t.wait[card.waiting] : t.waitingDetail, color: 'warning' }
      if (s.status === 'fixing') return { text: t.fixingDetail(card.round), color: 'error' }
      if (s.status === 'rejected') return { text: t.rejectedDetail, color: 'error' }
      return undefined
    }

    const footer = card.isFinished
      ? { title: t.footer.done[0], text: t.footer.done[1] }
      : card.waiting
        ? { title: t.footer.waiting[0], text: t.footer.waiting[1](t.wait[card.waiting]) }
        : cur?.status === 'fixing'
          ? { title: t.footer.fixing[0], text: t.footer.fixing[1] }
          : card.lastDone
            ? { title: t.footer.last[0], text: t.footer.last[1](t.stage[card.lastDone]) }
            : { title: t.footer.next[0], text: t.footer.next[1] }

    // Above the prompt (the VS Code and Cursor extension), the panel starts compact.
    const isInline = e.props.placement === 'inline'
    const isExpanded = await read($, expandedAtom)
    const toggle = () => update($, expandedAtom, v => !v)

    if (isInline && !isExpanded) {
      // One line, so the panel doesn't take over the chat: dots, where it is, how long; the button opens the rest.
      const where = card.isFinished
        ? t.cardDone
        : card.waiting
          ? t.pill.waiting
          : cur?.status === 'fixing'
            ? t.fixRound(card.round)
            : cur
              ? t.stage[cur.id]
              : stepLabel
      return (
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap={1} paddingX={1}>
          <Text wrap="truncate-end">
            <Text color={pill.color}>{progressDots(done)}</Text>
            <Text color={pill.color} bold>
              {' '}
              {where}
            </Text>
            <Text dimColor>
              {' '}
              · {done}/8 · {formatDuration((card.endedAt ?? now) - card.startedAt)}
            </Text>
          </Text>
          <Button
            key="toggle"
            onPress={async () => {
              // An editor tab if the editor allows it; otherwise the list opens right here.
              if (!(await openInEditor($))) await toggle()
            }}
          >
            {t.showAll}
          </Button>
        </Box>
      )
    }

    return (
      <Box flexDirection="column" gap={1} paddingX={1}>
        <Box flexDirection="column">
          <Box flexDirection="row" justifyContent="space-between" gap={1}>
            <Text bold>{card.name}</Text>
            <Text color={pill.color} bold>
              {pill.text}
            </Text>
          </Box>
          <Text dimColor>
            {card.branch ? `${card.branch} · ` : ''}
            {elapsed}
          </Text>
          <Text>
            {stepLabel} <Text dimColor>· {t.doneCount(done)}</Text>
          </Text>
          <Text color={pill.color}>{progressDots(done)}</Text>
        </Box>

        <Box flexDirection="column" gap={1}>
          {card.stages.map(s => {
            const info = stageInfo(s.id)
            const mark = icon(s)
            const d = detail(s)
            const time = s.ms !== undefined ? formatDuration(s.ms) : s.startedAt ? t.now : ''
            return (
              <Box key={s.id} flexDirection="row" gap={1}>
                <Text color={mark.color}>{mark.glyph}</Text>
                <Box flexDirection="column" flexGrow={1}>
                  <Box flexDirection="row" justifyContent="space-between" gap={1}>
                    <Text bold={s.status !== 'pending' && s.status !== 'done'} dimColor={s.status === 'pending'}>
                      {indexOf(s.id) + 1}. {t.stage[s.id]}
                    </Text>
                    <Text dimColor>{time}</Text>
                  </Box>
                  <Text dimColor>
                    {info.agent} · {prettyModel(s.model ?? info.model)}
                    {s.isReserve ? t.ranOnReserve : ''}
                  </Text>
                  {d ? <Text color={d.color}>{d.text}</Text> : null}
                </Box>
              </Box>
            )
          })}
        </Box>

        <Box flexDirection="column" gap={1}>
          <Text bold dimColor>
            {footer.title}
          </Text>
          <Text>{footer.text}</Text>
          <Box flexDirection="row" gap={1} flexWrap="wrap">
            {isInline ? (
              <Button key="toggle" onPress={toggle}>
                {t.showLess}
              </Button>
            ) : null}
            {card.isFinished ? (
              <Button key="clear" onPress={() => setCard($, () => null)}>
                {t.clear}
              </Button>
            ) : null}
          </Box>
        </Box>
      </Box>
    )
}

async function feedbackBody($: $, e: RenderInput<'Pane'>) {
  const els = $.ui.resolve(e)
  const { Box, Text, Button, Input, Link } = els
  // Svg exists on every surface but the terminal, where the labels stand alone.
  const Svg = 'Svg' in els ? els.Svg : () => null
  const fb: Feedback = await read($, feedbackAtom)
  const lang = await read($, langAtom)
  const t = TEXT[lang]

  if (fb.result === 'ok') {
    return (
      <Box flexDirection="column" gap={1} padding={1}>
        <Text bold color="success">
          {t.thanks}
        </Text>
        <Text dimColor>{t.thanksBody}</Text>
        <Button
          key="back"
          onPress={async () => {
            await update($, feedbackAtom, () => ({}))
            await update($, viewAtom, () => 'pipeline' as const)
          }}
        >
          {t.backToPipeline}
        </Button>
      </Box>
    )
  }

  let version = ''
  try {
    version = (JSON.parse(await $.fs.read(`${$.plugin.root}/.claude-plugin/plugin.json`)) as { version?: string }).version ?? ''
  } catch {
    version = ''
  }
  const details = { rating: fb.rating, comment: fb.draft ?? '', version, editor: e.surface }
  const hasForm = GOOGLE_FORM.id !== ''

  const sendForm = async () => {
    await update($, feedbackAtom, f => ({ ...f, isSending: true, result: undefined }))
    let ok = false
    let errorDetail = ''
    try {
      const response = await $.http.fetch(googleFormUrl(GOOGLE_FORM.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: googleFormBody(GOOGLE_FORM, details)
      })
      ok = response.ok
      if (!ok) errorDetail = `HTTP ${response.status}`
    } catch (error) {
      errorDetail = error instanceof Error ? error.message : String(error)
    }
    if (!ok) $.ui.log(`crew-feedback: ${errorDetail}`)
    await update($, feedbackAtom, f => ({
      ...f,
      isSending: false,
      result: ok ? ('ok' as const) : ('error' as const),
      errorDetail: ok ? undefined : errorDetail
    }))
  }

  const rate = (rating: Feedback['rating']) => update($, feedbackAtom, f => ({ ...f, rating, result: undefined }))

  return (
    <Box flexDirection="column" gap={1} padding={1}>
      <Text bold>{t.question}</Text>
      <Box flexDirection="row" gap={2}>
        {(['like', 'dislike'] as const).map(r => {
          const label = r === 'like' ? t.like : t.dislike
          const isOn = fb.rating === r
          return (
            <Box key={`rate-${r}`} flexDirection="row" gap={1} alignItems="center">
              {e.surface !== 'terminal' ? <Svg source={thumb(r === 'like' ? 'up' : 'down', isOn)} alt={label} width={20} height={20} /> : null}
              {isOn ? (
                <Text bold underline>
                  {label}
                </Text>
              ) : (
                <Button key={r} onPress={() => rate(r)}>
                  {label}
                </Button>
              )}
            </Box>
          )
        })}
      </Box>
      <Input
        key="comment"
        label={t.commentLabel}
        placeholder={t.commentPlaceholder}
        submitLabel="↵"
        rows={4}
        onInput={value => update($, feedbackAtom, f => ({ ...f, draft: value }))}
        onSubmit={value => update($, feedbackAtom, f => ({ ...f, draft: value }))}
      />

      {hasForm ? (
        <Box flexDirection="column" gap={0}>
          <Box alignSelf="flex-start">
            <Button key="send-form" variant="primary" onPress={sendForm}>
              {fb.isSending ? t.sending : t.sendFeedback}
            </Button>
          </Box>
          <Text dimColor>{t.formNote}</Text>
        </Box>
      ) : null}

      <Box flexDirection="column" gap={0}>
        <Link href={githubIssueUrl(details)} label={t.viaGithub} />
        <Text dimColor>{t.githubNote}</Text>
      </Box>

      {fb.result === 'error' ? <Text color="error">{t.sendError(ISSUES_URL)}</Text> : null}
      {fb.result === 'error' && fb.errorDetail ? <Text dimColor>{fb.errorDetail}</Text> : null}
    </Box>
  )
}
