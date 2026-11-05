export type StageId = 'explore' | 'understand' | 'plan' | 'implement' | 'test' | 'review' | 'document' | 'mentor'

export type StageStatus = 'pending' | 'running' | 'done' | 'waiting' | 'fixing' | 'rejected'

export type WaitKind = 'approve-plan' | 'answer-questions' | 'reply-to-start' | 'reply'

export type Lang = 'en' | 'pt'

export type Stage = {
  id: StageId
  status: StageStatus
  model?: string
  isReserve?: boolean
  startedAt?: number
  ms?: number
}

export type Card = {
  name: string
  branch?: string
  startedAt: number
  endedAt?: number
  stages: Stage[]
  waiting?: WaitKind
  round: number
  isFinished: boolean
  agents: Record<string, StageId>
  lastDone?: StageId
}

export type Feedback = {
  rating?: 'like' | 'dislike'
  draft?: string
  isSending?: boolean
  result?: 'ok' | 'error'
  errorDetail?: string
}

declare module 'claude-code' {
  interface PluginState {
    'crew-panel': {
      card: Shaped<Card | null>
      feedback: Shaped<Feedback>
      lang: Shaped<Lang>
      expanded: Shaped<boolean>
      view: Shaped<'pipeline' | 'feedback'>
    }
  }
}
