import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Animated radial gauge — SVG arc + count-up number.
 *
 *  - value: 0..max
 *  - size: outer diameter
 *  - color: stroke color (defaults amber)
 *  - delay: ms to wait before starting animation
 */
export default function RadialGauge({
  value = 0,
  max = 100,
  size = 168,
  strokeWidth = 12,
  color = '#FF9F43',
  trackColor = 'rgba(42,48,69,0.5)',
  delay = 0,
  label,
  sublabel,
  emphasize = false,
}) {
  const [display, setDisplay] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = Math.max(0, Math.min(1, value / max))
  const dashOffset = circumference * (1 - ratio)

  // Number count-up
  const num = useMotionValue(0)
  const rounded = useTransform(num, (latest) => Math.round(latest))

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplay(v))
    return () => unsub()
  }, [rounded])

  useEffect(() => {
    const controls = animate(num, value, {
      duration: 1.0,
      delay: delay / 1000,
      ease: [0.16, 1, 0.3, 1],
    })
    return controls.stop
  }, [num, value, delay])

  // Score band coloring based on value
  let bandColor = color
  if (!emphasize) {
    if (ratio >= 0.85) bandColor = '#10B981'
    else if (ratio >= 0.7) bandColor = '#FF9F43'
    else if (ratio >= 0.5) bandColor = '#FBBF24'
    else bandColor = '#F43F5E'
  }

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={`gauge-${size}-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={bandColor} stopOpacity={0.65} />
              <stop offset="100%" stopColor={bandColor} stopOpacity={1} />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Animated arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gauge-${size}-${color.replace('#', '')})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.0, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
            style={{
              filter: emphasize ? `drop-shadow(0 0 12px ${bandColor}66)` : 'none',
            }}
          />
        </svg>

        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay / 1000 }}
            className="font-mono font-bold tabular-nums leading-none"
            style={{
              fontSize: emphasize ? size * 0.32 : size * 0.28,
              color: emphasize ? bandColor : '#F1F3F8',
            }}
          >
            {display}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: (delay + 200) / 1000 }}
            className="font-mono text-muted text-[10px] mt-1 tracking-widest uppercase"
          >
            / {max}
          </motion.span>
        </div>
      </div>
      {(label || sublabel) && (
        <div className="text-center mt-3">
          {label && (
            <div className={`font-mono text-xs uppercase tracking-[0.15em] ${
              emphasize ? 'text-amber' : 'text-muted'
            }`}>
              {label}
            </div>
          )}
          {sublabel && (
            <div className="text-muted/60 text-[10px] font-mono mt-0.5">{sublabel}</div>
          )}
        </div>
      )}
    </div>
  )
}
