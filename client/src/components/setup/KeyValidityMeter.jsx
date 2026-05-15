import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

/**
 * Live API key validity meter — 3 dots:
 *   1. format    (looks like a key, no whitespace)
 *   2. length    (passes minimum length per provider)
 *   3. prefix    (matches expected prefix)
 *
 * Provider rules:
 *   anthropic  : startsWith('sk-ant-')
 *   openai     : startsWith('sk-')
 *   gemini     : length > 30 (Google API keys are 39 chars)
 */

export function checkKey(provider, key) {
  const trimmed = (key || '').trim()
  const format = trimmed.length > 0 && !/\s/.test(trimmed) && !trimmed.includes('"')

  let length = false
  let prefix = false

  switch (provider) {
    case 'anthropic':
      length = trimmed.length >= 50
      prefix = trimmed.startsWith('sk-ant-')
      break
    case 'openai':
      length = trimmed.length >= 30
      prefix = trimmed.startsWith('sk-')
      break
    case 'gemini':
      length = trimmed.length >= 30
      // Gemini keys generally start with AIza but skip strict prefix
      prefix = /^[A-Za-z0-9\-_]+$/.test(trimmed)
      break
    default:
      break
  }

  const all = format && length && prefix
  return { format, length, prefix, all }
}

function Dot({ on, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.span
        layout
        animate={{
          backgroundColor: on ? 'rgba(16,185,129,0.18)' : 'rgba(42,48,69,0.5)',
          borderColor: on ? 'rgba(16,185,129,0.6)' : 'rgba(42,48,69,0.7)',
        }}
        transition={{ duration: 0.18 }}
        className="w-3.5 h-3.5 rounded-full border flex items-center justify-center"
      >
        {on ? (
          <Check className="w-2 h-2 text-success" strokeWidth={4} />
        ) : (
          <X className="w-2 h-2 text-muted/60" strokeWidth={3} />
        )}
      </motion.span>
      <span
        className={`font-mono text-[10px] uppercase tracking-wider ${
          on ? 'text-success' : 'text-muted/60'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export default function KeyValidityMeter({ provider, value }) {
  const result = checkKey(provider, value)
  const filled = !!value

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-300/60 border border-border/40">
      <Dot on={filled && result.format} label="format" />
      <span className="w-px h-3 bg-border/40" />
      <Dot on={filled && result.length} label="length" />
      <span className="w-px h-3 bg-border/40" />
      <Dot on={filled && result.prefix} label="prefix" />
      <div className="flex-1" />
      <span
        className={`font-mono text-[10px] uppercase tracking-wider ${
          filled ? (result.all ? 'text-success' : 'text-amber') : 'text-muted/50'
        }`}
      >
        {!filled ? 'awaiting key' : result.all ? 'looks valid' : 'incomplete'}
      </span>
    </div>
  )
}
