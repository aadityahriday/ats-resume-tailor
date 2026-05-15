import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Code2, Globe2, Check, X, Loader2 } from 'lucide-react'
import { STATUS } from '../../lib/workflowSteps'

const ICON_MAP = {
  ai: Brain,
  code: Code2,
  http: Globe2,
}

const COLOR_BY_TYPE = {
  ai:   { bg: 'rgba(255,159,67,0.12)',  bgActive: 'rgba(255,159,67,0.22)',  stroke: '#FF9F43', glow: 'rgba(255,159,67,0.35)' },
  http: { bg: 'rgba(139,92,246,0.12)',  bgActive: 'rgba(139,92,246,0.22)',  stroke: '#8B5CF6', glow: 'rgba(139,92,246,0.35)' },
  code: { bg: 'rgba(6,182,212,0.12)',   bgActive: 'rgba(6,182,212,0.22)',   stroke: '#06B6D4', glow: 'rgba(6,182,212,0.30)' },
}

function formatMs(ms) {
  if (!ms) return ''
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function StatusDot({ status }) {
  if (status === STATUS.RUNNING) {
    return <Loader2 className="w-3.5 h-3.5 text-amber animate-spin" strokeWidth={2.5} />
  }
  if (status === STATUS.DONE) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="w-4 h-4 rounded-full bg-success/15 flex items-center justify-center"
      >
        <Check className="w-3 h-3 text-success" strokeWidth={3} />
      </motion.div>
    )
  }
  if (status === STATUS.ERROR) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="w-4 h-4 rounded-full bg-error/15 flex items-center justify-center"
      >
        <X className="w-3 h-3 text-error" strokeWidth={3} />
      </motion.div>
    )
  }
  return <div className="w-3.5 h-3.5 rounded-full border border-border/60" />
}

function WorkflowNodeImpl({ data }) {
  const { name, desc, icon, status, elapsed } = data
  const colors = COLOR_BY_TYPE[icon] || COLOR_BY_TYPE.code
  const Icon = ICON_MAP[icon] || Code2
  const isActive = status === STATUS.RUNNING || status === STATUS.DONE
  const isRunning = status === STATUS.RUNNING

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      whileHover={{ y: -2, transition: { duration: 0.12 } }}
      className="relative"
      style={{ width: 240 }}
    >
      {/* Animated gradient border for running state */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            key="border-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-[1.5px] rounded-[14px] pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${colors.stroke}, transparent 40%, ${colors.stroke})`,
              backgroundSize: '200% 200%',
              animation: 'gradient-x 2.4s ease infinite',
            }}
          />
        )}
      </AnimatePresence>

      <div
        className={`relative rounded-[13px] border px-3 py-2.5 transition-colors backdrop-blur-sm ${
          status === STATUS.IDLE   ? 'border-border/40 bg-surface/85' :
          status === STATUS.RUNNING ? 'border-amber/40 bg-bg-200/95' :
          status === STATUS.DONE   ? 'border-success/30 bg-bg-200/95' :
                                     'border-error/40 bg-bg-200/95'
        }`}
        style={{
          boxShadow: isActive ? `0 4px 24px ${colors.glow}` : '0 1px 3px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-center gap-2.5">
          {/* Icon tile */}
          <div
            className="relative w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            style={{ background: isActive ? colors.bgActive : colors.bg }}
          >
            <Icon className="w-4 h-4" style={{ color: colors.stroke }} strokeWidth={2.2} />
            {isRunning && (
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
                style={{ background: colors.stroke, boxShadow: `0 0 8px ${colors.stroke}` }}
              />
            )}
          </div>

          {/* Name + desc */}
          <div className="flex-1 min-w-0">
            <div className={`font-mono text-[11.5px] font-semibold leading-tight ${
              status === STATUS.RUNNING ? 'text-amber' :
              status === STATUS.DONE   ? 'text-text' :
              status === STATUS.ERROR  ? 'text-error' :
                                         'text-muted-light/80'
            }`}>
              {name}
            </div>
            <div className="text-[9.5px] text-muted/70 truncate leading-tight mt-0.5 font-mono">
              {desc}
            </div>
          </div>

          {/* Status + elapsed */}
          <div className="flex items-center gap-1.5 shrink-0">
            {(status === STATUS.RUNNING || status === STATUS.DONE) && elapsed > 0 && (
              <span className={`font-mono text-[10px] tabular-nums ${
                status === STATUS.RUNNING ? 'text-amber/85' : 'text-muted/80'
              }`}>
                {formatMs(elapsed)}
              </span>
            )}
            <StatusDot status={status} />
          </div>
        </div>

        {/* Bottom shimmer for running */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              key="shimmer"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2 h-[2px] rounded-full overflow-hidden bg-border/30 origin-left"
            >
              <div
                className="h-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${colors.stroke}, transparent)`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.6s ease-in-out infinite',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Handles — invisible but functional */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: colors.stroke,
          borderColor: 'var(--color-bg)',
          opacity: isActive ? 1 : 0.5,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: colors.stroke,
          borderColor: 'var(--color-bg)',
          opacity: isActive ? 1 : 0.5,
        }}
      />
    </motion.div>
  )
}

export const WorkflowNode = memo(WorkflowNodeImpl)
