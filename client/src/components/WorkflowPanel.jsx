import { useEffect, useState, useRef } from 'react'

function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

// ─── Node Type Icons (n8n style: colored squares with icons) ────
function NodeIcon({ type, status }) {
  const colors = {
    ai: { bg: 'bg-amber/15', stroke: '#FF9F43', activeBg: 'bg-amber/25' },
    http: { bg: 'bg-violet/15', stroke: '#8B5CF6', activeBg: 'bg-violet/25' },
    code: { bg: 'bg-cyan/15', stroke: '#06B6D4', activeBg: 'bg-cyan/25' },
  }
  const c = colors[type] || colors.code
  const isActive = status === 'running' || status === 'done'

  const icons = {
    ai: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    http: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    code: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  }

  return (
    <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? c.activeBg : c.bg}`}>
      {icons[type]}
      {status === 'running' && (
        <span
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-blink"
          style={{ backgroundColor: c.stroke }}
        />
      )}
    </div>
  )
}

// ─── Vertical Connector ────────────────────────────────────────
function VConnector({ fromStatus, toStatus }) {
  const isActive = fromStatus === 'done'
  const isFlowing = fromStatus === 'done' && toStatus === 'running'

  return (
    <div className="flex justify-center" style={{ height: '20px' }}>
      <div className="relative w-0.5 h-full overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-border/30" />
        {isActive && (
          <div
            className="absolute inset-0 transition-all duration-500 rounded-full"
            style={{
              background: isFlowing
                ? 'linear-gradient(to bottom, #10B981, #FF9F43)'
                : '#10B981',
            }}
          />
        )}
        {isFlowing && (
          <div
            className="absolute inset-0"
            style={{
              background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,159,67,0.9) 3px, rgba(255,159,67,0.9) 5px)',
              animation: 'flow-down 0.6s linear infinite',
            }}
          />
        )}
      </div>
    </div>
  )
}

// ─── Single Workflow Node (n8n card style) ─────────────────────
function WorkflowNode({ step, elapsed, index }) {
  const nodeClasses = {
    pending: 'border-border/40 bg-surface/40',
    running: 'border-amber/40 bg-amber/[0.03] node-running',
    done: 'border-success/25 bg-success/[0.02] node-done',
    error: 'border-error/40 bg-error/[0.03]',
  }

  return (
    <div
      className={`workflow-node rounded-[14px] border px-4 py-3 transition-all duration-300 ${nodeClasses[step.status] || nodeClasses.pending}`}
      style={step.status !== 'pending' ? { animation: `node-appear 0.35s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.05}s both` } : undefined}
    >
      <div className="flex items-center gap-3">
        <NodeIcon type={step.icon} status={step.status} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[13px] font-semibold leading-tight ${
              step.status === 'running' ? 'text-amber' :
              step.status === 'done' ? 'text-success' :
              step.status === 'error' ? 'text-error' :
              'text-muted-light/70'
            }`}>
              {step.name}
            </span>
          </div>
          <p className={`text-[11px] mt-0.5 truncate leading-tight ${
            step.status === 'pending' ? 'text-muted/40' : 'text-muted/70'
          }`}>
            {step.desc}
          </p>
        </div>

        {/* Status + Time */}
        <div className="flex items-center gap-2 shrink-0">
          {(step.status === 'running' || step.status === 'done') && (
            <span className={`font-mono text-[11px] tabular-nums ${
              step.status === 'running' ? 'text-amber/80' : 'text-muted'
            }`}>
              {formatTime(elapsed || step.elapsed || 0)}
            </span>
          )}

          <div className="w-5 h-5 flex items-center justify-center">
            {step.status === 'running' && (
              <div className="w-4 h-4 rounded-full border-2 border-amber/60 border-t-transparent animate-spin" />
            )}
            {step.status === 'done' && (
              <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
            {step.status === 'error' && (
              <div className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </div>
            )}
            {step.status === 'pending' && (
              <div className="w-4 h-4 rounded-full border border-border/50" />
            )}
          </div>
        </div>
      </div>

      {/* Progress shimmer for running */}
      {step.status === 'running' && (
        <div className="mt-2 h-[2px] bg-border/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #FF9F43, transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s ease-in-out infinite',
            }}
          />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  Main Workflow Panel — n8n inspired canvas
// ═══════════════════════════════════════════════════════════════════
export default function WorkflowPanel({ steps, isGenerating, error, result, onDownloadPdf }) {
  const [elapsedCounters, setElapsedCounters] = useState({})
  const panelRef = useRef(null)

  // Live counter for running steps
  useEffect(() => {
    const interval = setInterval(() => {
      const counters = {}
      for (const step of steps) {
        if (step.status === 'running' && step.startTime) {
          counters[step.id] = Date.now() - step.startTime
        }
      }
      if (Object.keys(counters).length > 0) {
        setElapsedCounters(prev => ({ ...prev, ...counters }))
      }
    }, 50)
    return () => clearInterval(interval)
  }, [steps])

  // Auto-scroll to running step
  useEffect(() => {
    const runningStep = steps.find(s => s.status === 'running')
    if (runningStep && panelRef.current) {
      const el = panelRef.current.querySelector(`[data-step-id="${runningStep.id}"]`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [steps])

  const allDone = steps.length > 0 && steps.every(s => s.status === 'done')
  const hasError = steps.some(s => s.status === 'error')
  const completedCount = steps.filter(s => s.status === 'done').length
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0

  const phases = [
    { name: 'AI Analysis', icon: '🧠', steps: steps.slice(0, 4) },
    { name: 'Overleaf Pipeline', icon: '📄', steps: steps.slice(4) },
  ]

  return (
    <section className="max-w-5xl mx-auto px-6 py-8" id="workflow-panel">
      <div
        ref={panelRef}
        className={`workflow-canvas rounded-2xl overflow-hidden transition-all duration-500 ${
          hasError
            ? 'border border-error/30 shadow-[0_0_48px_rgba(244,63,94,0.08)]'
            : allDone
            ? 'border border-success/30 shadow-[0_0_48px_rgba(16,185,129,0.08)]'
            : isGenerating
            ? 'border border-amber/20 shadow-[0_0_64px_rgba(255,159,67,0.06)]'
            : 'border border-border'
        }`}
        style={{ background: 'linear-gradient(180deg, #12151C 0%, #0E1017 100%)' }}
      >
        {/* ─── Header Bar (terminal-style) ──────────────────── */}
        <div className="px-5 py-3.5 border-b border-border/40 flex items-center justify-between"
             style={{ background: 'linear-gradient(180deg, rgba(24,28,38,0.8) 0%, rgba(18,21,28,0.6) 100%)' }}>
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <span className={`w-[10px] h-[10px] rounded-full transition-colors ${
                hasError ? 'bg-error' : allDone ? 'bg-success' : isGenerating ? 'bg-amber animate-pulse-amber' : 'bg-muted/30'
              }`} />
              <span className={`w-[10px] h-[10px] rounded-full ${isGenerating ? 'bg-amber/40' : 'bg-muted/15'}`} />
              <span className={`w-[10px] h-[10px] rounded-full ${isGenerating ? 'bg-amber/20' : 'bg-muted/10'}`} />
            </div>
            <h3 className="font-mono text-text/90 font-semibold text-xs tracking-[0.15em] uppercase">
              Resume Generator Engine
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted tabular-nums">
              {completedCount}/{steps.length}
            </span>

            {isGenerating && !hasError && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono text-amber bg-amber/8 border border-amber/15">
                <span className="w-1.5 h-1.5 rounded-full bg-amber animate-blink" />
                Running
              </span>
            )}
            {allDone && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono text-success bg-success/8 border border-success/15">
                ✓ Complete
              </span>
            )}
            {hasError && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono text-error bg-error/8 border border-error/15">
                ✗ Failed
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[2px] bg-border/20">
          <div
            className={`h-full transition-all duration-700 ease-out ${
              hasError ? 'bg-error' : allDone ? 'bg-success' : 'bg-gradient-to-r from-amber via-amber/80 to-amber/50'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ─── Workflow Canvas ─────────────────────────────── */}
        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {phases.map((phase) => {
              const phaseSteps = phase.steps
              const phaseComplete = phaseSteps.every(s => s.status === 'done')
              const phaseRunning = phaseSteps.some(s => s.status === 'running')
              const phaseError = phaseSteps.some(s => s.status === 'error')

              return (
                <div
                  key={phase.name}
                  className={`rounded-xl border p-4 transition-all duration-300 ${
                    phaseError
                      ? 'border-error/20 bg-error/[0.02]'
                      : phaseComplete
                      ? 'border-success/15 bg-success/[0.01]'
                      : phaseRunning
                      ? 'border-amber/15 bg-amber/[0.01]'
                      : 'border-border/30 bg-bg/20'
                  }`}
                >
                  {/* Phase Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{phase.icon}</span>
                      <span className={`font-mono text-[11px] font-semibold tracking-[0.1em] uppercase ${
                        phaseComplete ? 'text-success' :
                        phaseRunning ? 'text-amber' :
                        phaseError ? 'text-error' :
                        'text-muted/60'
                      }`}>
                        {phase.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted/50 tabular-nums">
                      {phaseSteps.filter(s => s.status === 'done').length}/{phaseSteps.length}
                    </span>
                  </div>

                  {/* Phase Steps */}
                  <div>
                    {phaseSteps.map((step, i) => (
                      <div key={step.id} data-step-id={step.id}>
                        <WorkflowNode
                          step={step}
                          elapsed={elapsedCounters[step.id]}
                          index={i}
                        />
                        {i < phaseSteps.length - 1 && (
                          <VConnector
                            fromStatus={step.status}
                            toStatus={phaseSteps[i + 1].status}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ─── Completion Banner ────────────────────────────── */}
        {allDone && result && (
          <div className="mx-5 mb-5 animate-slide-in-up">
            <div className="rounded-xl p-5 border border-success/20"
                 style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)' }}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-serif text-lg text-text mb-0.5">Your PDF is Ready!</h4>
                  <p className="text-muted text-sm">
                    {result.pdfBase64
                      ? 'ATS-optimized resume compiled successfully.'
                      : result.projectUrl
                      ? 'Resume compiled on Overleaf.'
                      : 'Resume generated successfully.'}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  {result.pdfBase64 && (
                    <button
                      onClick={onDownloadPdf}
                      className="px-5 py-2.5 bg-success text-bg font-mono font-bold text-sm rounded-lg
                                 hover:bg-success/90 transition-all cursor-pointer flex items-center gap-2
                                 shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download PDF
                    </button>
                  )}
                  {result.projectUrl && (
                    <a
                      href={result.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 border border-success/30 text-success font-mono text-sm rounded-lg
                                 hover:bg-success/8 transition-all flex items-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Overleaf
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Error Banner ──────────────────────────────────── */}
        {hasError && error && (
          <div className="mx-5 mb-5 animate-slide-in-up">
            <div className="rounded-xl p-4 border border-error/20"
                 style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.05) 0%, transparent 100%)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-mono text-error font-semibold text-sm mb-1">Pipeline Error</h4>
                  <p className="text-muted-light text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
