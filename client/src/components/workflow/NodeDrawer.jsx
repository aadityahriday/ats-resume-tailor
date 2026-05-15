import { motion, AnimatePresence } from 'framer-motion'
import { X, Brain, Code2, Globe2, Clock, Activity, FileText } from 'lucide-react'
import { WORKFLOW_STEPS, STATUS } from '../../lib/workflowSteps'

const ICON_MAP = { ai: Brain, code: Code2, http: Globe2 }

const STATUS_LABEL = {
  [STATUS.IDLE]: { label: 'Idle', color: 'text-muted', bg: 'bg-muted/10', border: 'border-muted/30' },
  [STATUS.RUNNING]: { label: 'Running', color: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/30' },
  [STATUS.DONE]: { label: 'Complete', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
  [STATUS.ERROR]: { label: 'Failed', color: 'text-error', bg: 'bg-error/10', border: 'border-error/30' },
}

function formatMs(ms) {
  if (!ms) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export default function NodeDrawer({ stepId, stepState, onClose, providerLabel, requestId }) {
  const step = WORKFLOW_STEPS.find((s) => s.id === stepId)
  const state = stepState[stepId]
  const open = Boolean(stepId && step)

  const Icon = step ? ICON_MAP[step.icon] || Code2 : Brain
  const statusInfo = state ? STATUS_LABEL[state.status] : STATUS_LABEL[STATUS.IDLE]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-bg-200/95 backdrop-blur-xl border-l border-border/60 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-amber" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-mono text-text font-semibold text-sm leading-tight truncate">
                    {step?.name}
                  </h3>
                  <p className="text-muted text-xs mt-0.5 leading-tight">
                    {step?.desc}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-text hover:bg-border/40 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status pill */}
            <div className="px-6 py-4 border-b border-border/30">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border ${statusInfo.bg} ${statusInfo.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.color.replace('text-', 'bg-')} ${state?.status === STATUS.RUNNING ? 'animate-pulse' : ''}`} />
                <span className={`font-mono text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Timing card */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted mb-3 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Timing
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Elapsed" value={formatMs(state?.elapsed)} />
                  <Stat label="Estimate" value={formatMs(step?.estMs)} />
                </div>
              </div>

              {/* Phase card */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted mb-3 flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  Phase
                </h4>
                <div className="text-text font-mono text-sm capitalize">
                  {step?.phase === 'ai' ? 'AI Analysis' : 'PDF Pipeline'}
                </div>
                <div className="text-muted text-xs mt-1 font-mono uppercase tracking-wider">
                  {step?.icon === 'ai' ? 'Inference' : step?.icon === 'http' ? 'HTTP I/O' : 'Compute'}
                </div>
              </div>

              {/* Provider / Request */}
              {(providerLabel || requestId) && (
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted mb-3 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    Context
                  </h4>
                  <div className="space-y-2 font-mono text-xs">
                    {providerLabel && (
                      <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                        <span className="text-muted">Provider</span>
                        <span className="text-text">{providerLabel}</span>
                      </div>
                    )}
                    {requestId && (
                      <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                        <span className="text-muted">Request ID</span>
                        <span className="text-text">{requestId}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-muted">Step ID</span>
                      <span className="text-text">{stepId}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payload (if any) */}
              {state?.payload && (
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted mb-3">
                    Payload
                  </h4>
                  <pre className="bg-bg-300 border border-border/40 rounded-lg p-3 font-mono text-[10.5px] text-muted-light overflow-x-auto whitespace-pre-wrap break-words max-h-48">
                    {JSON.stringify(state.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-bg-300 border border-border/40 rounded-lg px-3 py-2.5">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
        {label}
      </div>
      <div className="text-text font-mono text-sm tabular-nums">{value}</div>
    </div>
  )
}
