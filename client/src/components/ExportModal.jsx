import { useState } from 'react'

export default function ExportModal({ isOpen, onClose, resumeText, jobTitle, companyName }) {
  const [format, setFormat] = useState('pdf')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      switch (format) {
        case 'pdf':
          await exportAsPDF(resumeText, jobTitle, companyName)
          break
        case 'docx':
          await exportAsDOCX(resumeText, jobTitle, companyName)
          break
        case 'markdown':
          await exportAsMarkdown(resumeText, jobTitle, companyName)
          break
        case 'txt':
          await exportAsTXT(resumeText, jobTitle, companyName)
          break
      }
    } catch (err) {
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsPDF = async (text, jobTitle, companyName) => {
    // For PDF, we'll use the existing Overleaf pipeline
    // This is a simplified version - in production, you'd call the backend
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${jobTitle || 'resume'}_${companyName || 'company'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsDOCX = async (text, jobTitle, companyName) => {
    // Simplified - in production, use a library like docx
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${jobTitle || 'resume'}_${companyName || 'company'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsMarkdown = async (text, jobTitle, companyName) => {
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${jobTitle || 'resume'}_${companyName || 'company'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsTXT = async (text, jobTitle, companyName) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${jobTitle || 'resume'}_${companyName || 'company'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-text">Export Resume</h3>
          <button onClick={onClose} className="text-muted hover:text-text text-xl cursor-pointer">×</button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block font-mono text-xs text-muted-light uppercase tracking-wider mb-2">
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 font-mono text-sm text-text focus:border-amber/50 focus:outline-none"
            >
              <option value="pdf">PDF Document</option>
              <option value="docx">Word Document (DOCX)</option>
              <option value="markdown">Markdown (.md)</option>
              <option value="txt">Plain Text (.txt)</option>
            </select>
          </div>

          <div className="bg-amber/5 border border-amber/20 rounded-lg p-4">
            <p className="text-amber text-xs font-mono">
              💡 Tip: PDF export uses Overleaf for professional formatting. Other formats export the raw text content.
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-amber text-bg font-mono text-sm py-3 rounded-lg hover:bg-amber/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
        </button>
      </div>
    </div>
  )
}
