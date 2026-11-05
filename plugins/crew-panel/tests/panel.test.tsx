import { expect, test } from 'claude-code/testing'

import {
  githubIssueUrl,
  googleFormBody,
  langFromProfile,
  onAgentDone,
  onMainTurnEnd,
  onSpawn,
  onUserReply,
  startCard,
  statusLine,
  textReport
} from '../hooks/pipeline'

const status = (card: ReturnType<typeof startCard>, id: string) => card.stages.find(s => s.id === id)?.status

test('the pipeline moves step by step, waits for the person and records the fix', async () => {
  let card = startCard('Login screen', 0)
  card = onSpawn(card, 'explorer', 'a1', 'claude-haiku-5-5', undefined, 1000)
  expect(status(card, 'explore')).toBe('running')
  card = onAgentDone(card, 'a1', 2000)
  expect(status(card, 'explore')).toBe('done')
  // Between two agents the line says so, instead of going back to "starting".
  expect(statusLine(card)).toBe('Login screen · Preparing the next step')

  // First planner = understand; the main turn ends: the crew waits for the person.
  card = onSpawn(card, 'planner', 'a2', 'claude-opus-5-5', undefined, 3000)
  expect(status(card, 'understand')).toBe('running')
  card = onAgentDone(card, 'a2', 4000)
  const waiting = onMainTurnEnd(card)
  expect(waiting.isNewWait).toBe(true)
  expect(waiting.card.waiting).toBe('answer-questions')
  expect(statusLine(waiting.card)).toBe('Waiting for you: Answer the questions in the chat · Login screen')
  expect(statusLine(waiting.card, 'pt')).toBe('Aguardando você: Responda às perguntas no chat · Login screen')
  card = onUserReply(waiting.card)
  expect(card.waiting).toBe(undefined)

  // Second planner = plan, on the fallback model.
  card = onSpawn(card, 'planner', 'a3', 'claude-sonnet-5-5', 'sonnet', 5000)
  expect(status(card, 'plan')).toBe('running')
  expect(card.stages.find(s => s.id === 'plan')?.isReserve).toBe(true)
  card = onAgentDone(card, 'a3', 6000)

  card = onSpawn(card, 'implementer', 'a4', 'claude-sonnet-5-5', undefined, 7000)
  card = onAgentDone(card, 'a4', 8000)
  card = onSpawn(card, 'tester', 'a5', 'claude-haiku-5-5', undefined, 9000)
  card = onAgentDone(card, 'a5', 10000)
  card = onSpawn(card, 'reviewer', 'a6', 'claude-opus-5-5', undefined, 11000)
  card = onAgentDone(card, 'a6', 12000)

  // The implementer comes back after review: a fix, round 1.
  card = onSpawn(card, 'implementer', 'a7', 'claude-sonnet-5-5', undefined, 13000)
  expect(card.round).toBe(1)
  expect(status(card, 'review')).toBe('rejected')
  expect(status(card, 'implement')).toBe('fixing')
  expect(statusLine(card)).toBe('Login screen · Fixing: round 1 · implementer · Sonnet')
  card = onAgentDone(card, 'a7', 14000)

  // While an agent runs, the end of the main turn is not a wait.
  card = onSpawn(card, 'tester', 'a8', 'claude-haiku-5-5', undefined, 15000)
  expect(onMainTurnEnd(card).isNewWait).toBe(false)
  card = onAgentDone(card, 'a8', 16000)
  card = onSpawn(card, 'reviewer', 'a9', 'claude-opus-5-5', undefined, 17000)
  card = onAgentDone(card, 'a9', 18000)
  card = onSpawn(card, 'documenter', 'a10', 'claude-haiku-5-5', undefined, 19000)
  card = onAgentDone(card, 'a10', 20000)
  card = onSpawn(card, 'mentor', 'a11', 'claude-sonnet-5-5', undefined, 21000)
  card = onAgentDone(card, 'a11', 22000)

  expect(card.isFinished).toBe(true)
  expect(card.stages.every(s => s.status === 'done')).toBe(true)
  expect(onMainTurnEnd(card).isNewWait).toBe(false)
  expect(textReport(card, 30000)).toContain('✓ 8. Mentor · mentor · Sonnet')
})

test('the language comes from the profile', async () => {
  expect(langFromProfile('- **Idioma:** português')).toBe('pt')
  expect(langFromProfile('- **Language:** pt-BR')).toBe('pt')
  expect(langFromProfile('- **Language:** English')).toBe('en')
  expect(langFromProfile('nothing here')).toBe('en')
})

const PANE = {
  plugin: 'crew-panel',
  component: 'Pane',
  requestId: 'crew-pipeline',
  props: {
    title: 'Pipeline',
    isFocused: false,
    bodyColumns: 44,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {}
  }
} as const

test('the panel shows the running step on every surface', async ($, on) => {
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('agent.spawn', () => ({ model: 'claude-haiku-5-5', agentId: 'a1' }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.agent.spawn({
    subagentType: 'agent-crew:explorer',
    prompt: 'explore',
    description: 'Explore',
    tool_use_id: 't1',
    provider: { plugin: 'agent-crew', tier: 'user' },
    parentModel: 'claude-opus-5-5',
    background: false,
    fork: false
  } as Parameters<typeof $.agent.spawn>[0])

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect((await ui.find({ type: 'Text', text: /Step 1 of 8/ }))?.text).toContain('Explore')
    expect(await ui.find({ type: 'Text', text: /Reading the code/ })).toBeDefined()
    await ui.unmount()
  }
})

test('above the prompt, the panel starts compact and opens the full list on demand', async ($, on) => {
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('agent.spawn', () => ({ model: 'claude-haiku-5-5', agentId: 'a1' }))

  await $.session.start({ cwd: '/', surface: 'vscode', isInteractive: true })
  await $.agent.spawn({
    subagentType: 'agent-crew:explorer',
    prompt: 'explore',
    description: 'Explore',
    tool_use_id: 't1',
    provider: { plugin: 'agent-crew', tier: 'user' },
    parentModel: 'claude-opus-5-5',
    background: false,
    fork: false
  } as Parameters<typeof $.agent.spawn>[0])

  const ui = await $.ui.mount({ ...PANE, props: { ...PANE.props, placement: 'inline' }, surface: 'vscode' })
  expect(await ui.find({ type: 'Text', text: /2\. Understand/ })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: /●○○○○○○○|○○○○○○○○/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Explore/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /0\/8/ })).toBeDefined()
  await ui.press({ key: 'toggle' })
  expect(await ui.find({ type: 'Text', text: /2\. Understand/ })).toBeDefined()
  await ui.unmount()
})

test('"See steps" opens the full list in an editor tab when the editor allows it', async ($, on) => {
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('agent.spawn', () => ({ model: 'claude-haiku-5-5', agentId: 'a1' }))
  on('fs.exists', () => ({ value: true }))
  on('fs.read', () => ({ value: '- **Idioma:** português' }))
  const files: Record<string, string> = {}
  on('fs.write', (_, e) => {
    files[e.path] = e.text
    return { value: undefined }
  })
  let opened = ''
  on('mcp.call', (_, e) => {
    opened = `${e.server}:${e.tool}:${String(e.args.filePath)}`
    return { value: { content: [{ type: 'text', text: 'ok' }], isError: false } }
  })

  await $.session.start({ cwd: '/projeto', surface: 'vscode', isInteractive: true })
  await $.agent.spawn({
    subagentType: 'agent-crew:explorer',
    prompt: 'explore',
    description: 'Explore',
    tool_use_id: 't1',
    provider: { plugin: 'agent-crew', tier: 'user' },
    parentModel: 'claude-opus-5-5',
    background: false,
    fork: false
  } as Parameters<typeof $.agent.spawn>[0])

  const ui = await $.ui.mount({ ...PANE, props: { ...PANE.props, placement: 'inline' }, surface: 'vscode' })
  await ui.press({ key: 'toggle' })
  expect(opened).toBe('ide:openFile:/projeto/.crew/current-card/pipeline.md')
  expect(JSON.stringify(files)).toContain('◐ **1. Explorar**')
  // The panel above the prompt stays small.
  expect(await ui.find({ type: 'Text', text: /2\. Entender/ })).toBeUndefined()
  await ui.unmount()
})

test('without a card, the panel invites you to start one', async $ => {
  const ui = await $.ui.mount({ ...PANE, surface: 'vscode' })
  expect((await ui.find({ type: 'Text', text: /No card/ }))?.text).toBe('No card in progress')
  await ui.unmount()
})

test('feedback: option 1 opens a GitHub issue already filled in, option 2 sends the Google Form', async ($, on) => {
  on('fs.read', () => ({ value: '{"version":"0.6.0"}' }))
  let sentTo = ''
  let sent = ''
  on('http.fetch', (_, e) => {
    sentTo = e.url
    sent = e.init?.body ?? ''
    return { value: { status: 200, ok: true, headers: {}, text: '' } }
  })

  for (const surface of ['vscode', 'terminal'] as const) {
    const tabs = await $.ui.mount({ ...PANE, surface })
    expect(await tabs.find({ type: 'Button', key: 'tab-feedback' })).toBeDefined()
    await tabs.unmount()
  }

  const ui = await $.ui.mount({ ...PANE, surface: 'vscode' })
  await ui.press({ key: 'tab-feedback' })
  expect(await ui.find({ type: 'Svg' })).toBeDefined()
  await ui.press({ key: 'like' })
  await ui.input({ key: 'comment', text: 'Very clear panel', kind: 'change' })
  const link = await ui.find({ type: 'Link' })
  const href = String(link?.props.href)
  expect(href).toContain('https://github.com/akacaja/agent-crew/issues/new?template=feedback.yml')
  expect(href).toContain('comment=Very+clear+panel')
  expect(href).toContain('Like')
  expect(href).toContain('version=0.6.0')
  expect(href).toContain('editor=vscode')
  expect(await ui.find({ type: 'Text', text: /it’s free/ })).toBeDefined()
  await ui.press({ key: 'send-form' })
  expect(sentTo).toContain('docs.google.com/forms/d/e/')
  expect(sentTo).toContain('/formResponse')
  expect(sent).toContain('Like')
  expect(sent).toContain('Very+clear+panel')
  expect((await ui.find({ type: 'Text', text: /Thank you/ }))?.text).toBe('Thank you for your feedback!')
  await ui.unmount()
})

test('feedback helpers: long comments still fit in a link, and the form body uses the entry ids', async () => {
  const url = githubIssueUrl({ rating: 'dislike', comment: 'x'.repeat(5000), version: '0.6.0', editor: 'vscode' })
  expect(url.length <= 2048).toBe(true)
  expect(url).toContain('Dislike')
  const body = googleFormBody(
    { rating: '1', comment: '2', version: '3', editor: '4' },
    { rating: 'like', comment: ' Nice ', version: '0.6.0', editor: 'cursor' }
  )
  expect(body).toBe('entry.1=Gostei+%2F+Like&entry.2=Nice&entry.3=0.6.0&entry.4=cursor')
})
