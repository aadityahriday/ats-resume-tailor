export default function ResultCard({ result, onShowHistory }) {
  if (!result) return null

  const handleDownload = () => {
    if (!result.pdfBase64) return

    const byteCharacters = atob(result.pdfBase64)
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
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-8 animate-slide-in-up" id="result-card">
      <div className="bg-surface border border-success/20 rounded-2xl p-8 text-center"
           style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(18,21,28,1) 100%)' }}>
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-text mb-2">Your ATS-optimized resume is ready.</h3>
        <p className="text-muted text-sm mb-8">
          {result.status === 'partial'
            ? 'Resume was generated but PDF compilation had issues. You can debug in Overleaf.'
            : 'Compiled to PDF via Overleaf with professional LaTeX formatting.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Download PDF */}
          {result.pdfBase64 && (
            <button
              id="download-pdf-btn"
              onClick={handleDownload}
              className="px-8 py-3 bg-amber text-bg font-mono font-semibold rounded 
                         hover:bg-amber-hover hover:shadow-lg hover:shadow-amber/20 transition-all cursor-pointer"
            >
              ⬇ Download PDF
            </button>
          )}

          {/* Open in Overleaf */}
          {result.projectUrl && (
            <a
              href={result.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-amber/40 text-amber font-mono rounded 
                         hover:bg-amber/10 transition-all"
            >
              Open in Overleaf →
            </a>
          )}
        </div>

        {/* View History */}
        <button
          onClick={onShowHistory}
          className="mt-6 text-muted text-sm hover:text-text transition-colors cursor-pointer font-mono"
        >
          View Generation History ↓
        </button>
      </div>
    </section>
  )
}
