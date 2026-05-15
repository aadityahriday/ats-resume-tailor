import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Settings2,
  History,
  ArrowDown,
  Cpu,
  Code2,
  ExternalLink,
  Eraser,
} from 'lucide-react'
import { toast } from 'sonner'

const PROVIDERS = [
  { id: 'gemini', label: 'Gemini 2.5 Flash', icon: '�' },
  { id: 'openai', label: 'GPT-4o', icon: '🟢' },
  { id: 'anthropic', label: 'Claude 3.7 Sonnet', icon: '�' },
]

export default function CommandPalette({
  onGenerate,
  onOpenSetup,
  onOpenHistory,
  onScrollToForm,
  canGenerate,
}) {
  const [open, setOpen] = useState(false)
  const [activeProvider, setActiveProvider] = useState(
    () => localStorage.getItem('ats_ai_provider') || 'gemini'
  )

  // Toggle on ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape' && open) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  const switchProvider = (id) => {
    localStorage.setItem('ats_ai_provider', id)
    setActiveProvider(id)
    const label = PROVIDERS.find((p) => p.id === id)?.label || id
    toast.success(`Switched to ${label}`)
    close()
  }

  const clearHistory = () => {
    localStorage.removeItem('ats_resume_history')
    window.dispatchEvent(new CustomEvent('ats:history-cleared'))
    toast.success('History cleared')
    close()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-[12vh] px-4"
        >
          <motion.div
            key="palette"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl"
          >
            <Command label="Command palette" loop>
              <div className="px-5 pt-4 pb-2 flex items-center gap-2 text-muted">
                <Sparkles className="w-4 h-4 text-amber" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  ResumeCopy · Quick Actions
                </span>
              </div>
              <Command.Input placeholder="Type a command or search…" autoFocus />
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>

                <Command.Group heading="Actions">
                  <Command.Item
                    onSelect={() => {
                      close()
                      if (canGenerate) onGenerate?.()
                      else {
                        onScrollToForm?.()
                        toast.info('Fill in JD + resume + Setup keys to generate.')
                      }
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-amber" />
                    <span>Generate ATS Resume</span>
                    <kbd className="ml-auto text-[10px] text-muted font-mono">
                      {canGenerate ? 'Enter' : '—'}
                    </kbd>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => {
                      close()
                      onScrollToForm?.()
                    }}
                  >
                    <ArrowDown className="w-4 h-4" />
                    <span>Scroll to form</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => {
                      close()
                      onOpenSetup?.()
                    }}
                  >
                    <Settings2 className="w-4 h-4" />
                    <span>Open Setup panel</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => {
                      close()
                      onOpenHistory?.()
                    }}
                  >
                    <History className="w-4 h-4" />
                    <span>Open generation history</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="AI Provider">
                  {PROVIDERS.map((p) => (
                    <Command.Item
                      key={p.id}
                      onSelect={() => switchProvider(p.id)}
                      value={`switch ${p.label}`}
                    >
                      <Cpu
                        className={`w-4 h-4 ${activeProvider === p.id ? 'text-amber' : 'text-muted'}`}
                      />
                      <span>Switch to {p.label}</span>
                      {activeProvider === p.id && (
                        <span className="ml-auto text-[10px] text-amber font-mono">active</span>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Danger">
                  <Command.Item onSelect={clearHistory} value="clear history">
                    <Eraser className="w-4 h-4 text-error" />
                    <span className="text-error">Clear generation history</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Links">
                  <Command.Item
                    onSelect={() => {
                      window.open('https://github.com/aadityahriday/ats-resume-tailor', '_blank')
                      close()
                    }}
                    value="github source"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>GitHub repository</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-muted" />
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="px-4 py-2.5 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted/70">
                <span>↑↓ navigate · ↵ run · esc close</span>
                <span className="hidden sm:inline">Press ⌘K anywhere</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
