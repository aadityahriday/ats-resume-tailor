import { useState, useEffect } from 'react'

const PROVIDER_ICONS = {
  anthropic: '🟠 Claude',
  openai: '🟢 ChatGPT',
  gemini: '🔵 Gemini',
}

export default function HistoryPanel({ refreshTrigger, onRerun, onShowDiff }) {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ats_resume_history') || '[]')
    setHistory(stored)
  }, [refreshTrigger])

  const handleDownloadPdf = (entry) => {
    if (!entry.pdfBase64) return
    try {
      const byteCharacters = atob(entry.pdfBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tailored_resume.pdf'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 5000)
    } catch (err) {
      console.error('PDF download failed:', err)
      alert('Failed to download PDF. Please try again.')
    }
  }

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all generation history? This cannot be undone.')) {
      localStorage.removeItem('ats_resume_history')
      setHistory([])
    }
  }

  const formatDate = (ts) => {
    const d = new Date(ts)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (history.length === 0) return null

  return (
    <section className="max-w-4xl mx-auto px-6 py-8" id="history-panel">
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-6 bg-surface border border-border rounded-2xl 
                   hover:border-amber/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📜</span>
          <span className="font-mono text-text font-medium text-sm">Generation History</span>
          <span className="px-2 py-0.5 bg-amber/10 text-amber text-xs font-mono rounded">
            {history.length}
          </span>
        </div>
        <span className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="mt-3 bg-surface border border-border rounded-2xl overflow-hidden animate-slide-in-up">
          {/* Clear all */}
          <div className="px-6 py-3 border-b border-border flex justify-end">
            <button
              onClick={handleClearHistory}
              className="text-xs text-muted hover:text-error font-mono transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Entries */}
          <div className="divide-y divide-border">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="px-6 py-4 hover:bg-bg/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  {/* Date + Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-muted text-xs shrink-0">
                        📅 {formatDate(entry.timestamp)}
                      </span>
                      {entry.aiProvider && (
                        <span className="font-mono text-xs px-1.5 py-0.5 bg-border/50 text-muted-light rounded">
                          {PROVIDER_ICONS[entry.aiProvider] || entry.aiProvider}
                        </span>
                      )}
                    </div>
                    <p className="text-text text-sm truncate">{entry.jdPreview}</p>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-muted text-sm">
                      Score: <span className="text-muted-light">{entry.beforeScore}</span>
                      <span className="text-muted mx-1">→</span>
                      <span className="text-amber">{entry.afterScore}</span>
                    </span>
                    <span className="font-mono text-success text-xs">
                      (+{entry.scoreDelta})
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onRerun(entry)}
                      className="px-3 py-1.5 border border-border text-muted text-xs font-mono rounded 
                                 hover:border-amber/50 hover:text-amber transition-all cursor-pointer"
                      title="Re-run with same inputs"
                    >
                      ↺ Re-run
                    </button>
                    <button
                      onClick={() => onShowDiff(entry)}
                      className="px-3 py-1.5 border border-border text-muted text-xs font-mono rounded 
                                 hover:border-amber/50 hover:text-amber transition-all cursor-pointer"
                      title="View side-by-side diff"
                    >
                      ⇄ Diff
                    </button>
                    {entry.pdfBase64 && (
                      <button
                        onClick={() => handleDownloadPdf(entry)}
                        className="px-3 py-1.5 border border-border text-muted text-xs font-mono rounded 
                                   hover:border-amber/50 hover:text-amber transition-all cursor-pointer"
                        title="Download PDF"
                      >
                        ⬇ PDF
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
