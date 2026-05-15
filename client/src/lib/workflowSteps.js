/**
 * Workflow step catalog — single source of truth for both
 * the UI canvas and the backend SSE event mapper.
 *
 * Layout coordinates are tuned for 1100×500 React Flow canvas with
 * two horizontal swimlanes:
 *   - Top lane (AI Analysis):     y = 60
 *   - Bottom lane (PDF Pipeline): y = 280
 */

export const PHASE = {
  AI: 'ai',
  PIPELINE: 'pipeline',
}

export const STEP_ICON = {
  AI: 'ai',
  HTTP: 'http',
  CODE: 'code',
}

/**
 * Each step:
 *  - id: stable key, also used as backend event id
 *  - name: display name
 *  - desc: one-line description
 *  - icon: NodeIcon type
 *  - phase: which lane
 *  - timingKey: where to read elapsed ms from server response.timings
 *  - position: x/y on canvas
 *  - estMs: pessimistic estimate for visual progress when no live data
 */
export const WORKFLOW_STEPS = [
  // ─── AI Analysis lane (top) ────────────────────────────────
  {
    id: 'analyze',
    name: 'Resume Analyzer',
    desc: 'Computing baseline ATS score against JD',
    icon: STEP_ICON.AI,
    phase: PHASE.AI,
    timingKey: 'beforeScore',
    position: { x: 40, y: 60 },
    estMs: 1800,
  },
  {
    id: 'rewrite',
    name: 'AI Rewrite Engine',
    desc: 'Deep rewrite with extended thinking',
    icon: STEP_ICON.AI,
    phase: PHASE.AI,
    timingKey: 'rewrite',
    position: { x: 360, y: 60 },
    estMs: 25000,
  },
  {
    id: 'verify',
    name: 'Score Verifier',
    desc: 'Re-scoring rewritten resume',
    icon: STEP_ICON.AI,
    phase: PHASE.AI,
    timingKey: 'afterScore',
    position: { x: 680, y: 60 },
    estMs: 2200,
  },
  {
    id: 'latex',
    name: 'LaTeX Converter',
    desc: 'Converting to ATS-parseable LaTeX',
    icon: STEP_ICON.CODE,
    phase: PHASE.AI,
    timingKey: 'latex',
    position: { x: 1000, y: 60 },
    estMs: 18000,
  },

  // ─── PDF Pipeline lane (bottom) ────────────────────────────
  {
    id: 'decode',
    name: 'Decode Cookies',
    desc: 'Decoding Overleaf auth tokens',
    icon: STEP_ICON.CODE,
    phase: PHASE.PIPELINE,
    timingKey: null,
    position: { x: 40, y: 280 },
    estMs: 800,
  },
  {
    id: 'connect',
    name: 'Connect Overleaf',
    desc: 'GET overleaf.com — establishing session',
    icon: STEP_ICON.HTTP,
    phase: PHASE.PIPELINE,
    timingKey: null,
    position: { x: 296, y: 280 },
    estMs: 2400,
  },
  {
    id: 'csrf',
    name: 'Extract CSRF',
    desc: 'Parsing CSRF token from response',
    icon: STEP_ICON.CODE,
    phase: PHASE.PIPELINE,
    timingKey: null,
    position: { x: 552, y: 280 },
    estMs: 600,
  },
  {
    id: 'create',
    name: 'Create Project',
    desc: 'POST /docs — uploading LaTeX source',
    icon: STEP_ICON.HTTP,
    phase: PHASE.PIPELINE,
    timingKey: null,
    position: { x: 808, y: 280 },
    estMs: 3500,
  },
  {
    id: 'compile',
    name: 'Compile PDF',
    desc: 'pdflatex on Overleaf servers',
    icon: STEP_ICON.HTTP,
    phase: PHASE.PIPELINE,
    timingKey: null,
    position: { x: 552, y: 440 },
    estMs: 7000,
  },
  {
    id: 'download',
    name: 'Download PDF',
    desc: 'Streaming compiled PDF binary',
    icon: STEP_ICON.HTTP,
    phase: PHASE.PIPELINE,
    timingKey: null,
    position: { x: 808, y: 440 },
    estMs: 1800,
  },
]

export const WORKFLOW_EDGES = [
  // AI lane horizontal flow
  { id: 'analyze→rewrite', source: 'analyze', target: 'rewrite' },
  { id: 'rewrite→verify', source: 'rewrite', target: 'verify' },
  { id: 'verify→latex', source: 'verify', target: 'latex' },

  // bridge AI → Pipeline
  { id: 'latex→decode', source: 'latex', target: 'decode' },

  // Pipeline lane flow
  { id: 'decode→connect', source: 'decode', target: 'connect' },
  { id: 'connect→csrf', source: 'connect', target: 'csrf' },
  { id: 'csrf→create', source: 'csrf', target: 'create' },
  { id: 'create→compile', source: 'create', target: 'compile' },
  { id: 'compile→download', source: 'compile', target: 'download' },
]

export const STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  DONE: 'done',
  ERROR: 'error',
}

/** Build the initial state map (id → {status: 'idle', elapsed: 0}). */
export function buildInitialState() {
  const state = {}
  for (const step of WORKFLOW_STEPS) {
    state[step.id] = { status: STATUS.IDLE, elapsed: 0, payload: null }
  }
  return state
}

export function getStepIndex(id) {
  return WORKFLOW_STEPS.findIndex(s => s.id === id)
}
