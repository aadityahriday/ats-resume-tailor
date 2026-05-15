import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, ArrowUpRight, Minus, ArrowDownRight } from 'lucide-react'

/**
 * One row in the breakdown table.
 *  - bar visualizes before+after as stacked horizontal bars
 *  - hovering a row reveals a "why this score?" tooltip
 */
export default function ScoreBreakdownRow({
  label,
  maxPts,
  before,
  after,
  delay = 0,
  hint,
}) {
  const [showHint, setShowHint] = useState(false)
  const delta = after - before
  const beforeRatio = (before / maxPts) * 100
  const afterRatio = (after / maxPts) * 100

  const deltaColor =
    delta > 0 ? 'text-success' : delta < 0 ? 'text-error' : 'text-muted'
  const DeltaIcon = delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setShowHint(true)}
      onHoverEnd={() => setShowHint(false)}
      className="relative grid grid-cols-12 gap-3 py-2.5 px-4 rounded-lg hover:bg-bg-200/60 transition-colors group"
    >
      {/* Label */}
      <div className="col-span-4 flex items-center gap-1.5 min-w-0">
        <span className="text-text/90 font-sans text-sm truncate">{label}</span>
        <span className="text-muted/50 text-[10px] font-mono tabular-nums shrink-0">
          /{maxPts}
        </span>
        {hint && (
          <button
            type="button"
            aria-label={`Why ${label}?`}
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
            className="text-muted/40 hover:text-amber transition-colors shrink-0 ml-auto opacity-0 group-hover:opacity-100"
          >
            <Info className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Stacked bar */}
      <div className="col-span-5 flex flex-col gap-1 justify-center">
        <div className="relative h-1.5 rounded-full bg-border/40 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${beforeRatio}%` }}
            transition={{ duration: 0.8, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 left-0 bg-muted/40 rounded-full"
          />
        </div>
        <div className="relative h-1.5 rounded-full bg-border/40 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${afterRatio}%` }}
            transition={{
              duration: 0.9,
              delay: (delay + 200) / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,159,67,0.7), rgba(255,159,67,1))',
              boxShadow: '0 0 12px rgba(255,159,67,0.35)',
            }}
          />
        </div>
      </div>

      {/* Numbers */}
      <div className="col-span-2 flex items-center justify-center gap-1.5 font-mono text-xs">
        <span className="text-muted/70 tabular-nums">{before}</span>
        <span className="text-muted/40">→</span>
        <span className="text-amber tabular-nums">{after}</span>
      </div>

      {/* Delta */}
      <div className={`col-span-1 flex items-center justify-end gap-1 font-mono text-xs ${deltaColor}`}>
        <DeltaIcon className="w-3 h-3" />
        <span className="tabular-nums">{delta > 0 ? `+${delta}` : delta}</span>
      </div>

      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && hint && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20 left-4 top-full mt-1 bg-bg-200/96 backdrop-blur-md border border-border/60 rounded-lg px-3 py-2 max-w-xs shadow-lg"
          >
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber mb-1">
              Why this score?
            </div>
            <p className="text-muted-light text-xs leading-relaxed">{hint}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
