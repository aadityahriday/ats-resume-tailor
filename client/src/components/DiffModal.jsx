import { useEffect, useCallback } from 'react'
import { computeWordDiff } from '../utils/wordDiff'

export default function DiffModal({ original, tailored, jdPreview, onClose }) {
  const { leftSegments, rightSegments } = computeWordDiff(original, tailored)

  // Close on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = '' // Always reset
    }
  }, [handleKeyDown])

  const renderSegments = (segments, type) => {
    return segments.map((seg, i) => {
      if (seg.type === 'same') {
        return <span key={i}>{seg.text}</span>
      }
      if (seg.type === 'removed' && type === 'left') {
        return <span key={i} className="diff-removed">{seg.text}</span>
      }
      if (seg.type === 'added' && type === 'right') {
        return <span key={i} className="diff-added">{seg.text}</span>
      }
      return <span key={i}>{seg.text}</span>
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      id="diff-modal"
    >
      <div
        className="bg-surface border border-border/50 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="font-serif text-lg text-text">Original vs ATS-Tailored</h3>
            <p className="text-muted text-xs font-mono mt-1 truncate max-w-lg">{jdPreview}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-text text-xl 
                       hover:bg-bg rounded transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Panels */}
        <div className="flex-1 grid grid-cols-2 divide-x divide-border overflow-hidden">
          {/* Left: Original */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-error/5 shrink-0">
              <span className="font-mono text-xs text-error uppercase">Original Resume</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-muted-light whitespace-pre-wrap">
              {renderSegments(leftSegments, 'left')}
            </div>
          </div>

          {/* Right: Tailored */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-success/5 shrink-0">
              <span className="font-mono text-xs text-success uppercase">ATS-Tailored Resume</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-muted-light whitespace-pre-wrap">
              {renderSegments(rightSegments, 'right')}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 border-t border-border flex items-center gap-6 text-xs shrink-0">
          <span className="flex items-center gap-2">
            <span className="w-4 h-2 diff-removed inline-block" />
            <span className="text-muted">Removed</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-2 diff-added inline-block" />
            <span className="text-muted">Added</span>
          </span>
        </div>
      </div>
    </div>
  )
}
