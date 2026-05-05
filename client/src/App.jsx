import { useState, useRef, useCallback } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import SetupPanel from './components/SetupPanel'
import GeneratorForm from './components/GeneratorForm'
import WorkflowPanel from './components/WorkflowPanel'
import ScoreComparison from './components/ScoreComparison'
import ResultCard from './components/ResultCard'
import HistoryPanel from './components/HistoryPanel'
import DiffModal from './components/DiffModal'

// ─── Provider Display Names ────────────────────────────────────
const PROVIDER_LABELS = {
  anthropic: 'Claude Opus 4',
  openai: 'GPT-4.1',
  gemini: 'Gemini 2.5 Pro',
}

function App() {
  // ─── State ───────────────────────────────────────────────────
  const [jobDescription, setJobDescription] = useState('')
  const [currentResume, setCurrentResume] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [workflowSteps, setWorkflowSteps] = useState([])
  const [showDiff, setShowDiff] = useState(false)
  const [diffData, setDiffData] = useState(null)
  const [historyRefresh, setHistoryRefresh] = useState(0)

  const formRef = useRef(null)
  const resultRef = useRef(null)

  // ─── API Key helpers ─────────────────────────────────────────
  const getStoredKey = (key) => localStorage.getItem(key) || ''

  const getActiveProvider = () => localStorage.getItem('ats_ai_provider') || 'anthropic'

  const getActiveProviderKey = () => {
    const provider = getActiveProvider()
    switch (provider) {
      case 'openai': return getStoredKey('ats_openai_key')
      case 'gemini': return getStoredKey('ats_gemini_key')
      case 'anthropic':
      default: return getStoredKey('ats_anthropic_key')
    }
  }

  const isActiveKeyValid = () => {
    const provider = getActiveProvider()
    const key = getActiveProviderKey()
    if (!key) return false
    switch (provider) {
      case 'openai': return key.startsWith('sk-')
      case 'gemini': return key.length > 10
      case 'anthropic':
      default: return key.startsWith('sk-ant-')
    }
  }

  const getProviderLabel = () => PROVIDER_LABELS[getActiveProvider()] || 'AI'

  // ─── Workflow Step Management ────────────────────────────────
  const STEPS = [
    { id: 1, name: 'Resume Analyzer', desc: 'Computing your current ATS score against JD…', icon: 'ai' },
    { id: 2, name: 'Resume Generator', desc: `Sending resume + JD to ${getProviderLabel()} for deep rewrite…`, icon: 'ai' },
    { id: 3, name: 'ATS Score Verifier', desc: 'Computing improved ATS score on rewritten resume…', icon: 'ai' },
    { id: 4, name: 'LaTeX Converter', desc: `Converting optimized resume to LaTeX via ${getProviderLabel()}…`, icon: 'code' },
    { id: 5, name: 'Decode Cookie Key', desc: 'Decoding Overleaf authentication tokens…', icon: 'code' },
    { id: 6, name: 'Connect Overleaf', desc: 'GET overleaf.com/project — establishing session…', icon: 'http' },
    { id: 7, name: 'Extract CSRF', desc: 'Parsing CSRF token from Overleaf response…', icon: 'code' },
    { id: 8, name: 'Create Project & Paste', desc: 'POST overleaf.com/docs — uploading LaTeX source…', icon: 'http' },
    { id: 9, name: 'Extract Project ID', desc: 'Reading project ID from redirect header…', icon: 'code' },
    { id: 10, name: 'Project Compiler', desc: 'Compiling PDF with pdflatex on Overleaf servers…', icon: 'http' },
    { id: 11, name: 'Render Resume PDF', desc: 'Downloading compiled PDF binary…', icon: 'http' },
  ]

  const simulateWorkflow = useCallback(async (timings, abortSignal) => {
    const steps = STEPS.map(s => ({ ...s, status: 'pending', elapsed: 0, startTime: null }))
    setWorkflowSteps([...steps])

    // Realistic estimated durations per step (in ms)
    // AI steps with extended thinking take much longer
    const stepTimingMap = {
      0: timings?.beforeScore || 1800,    // ATS score computation
      1: timings?.rewrite || 25000,       // Deep AI rewrite with thinking
      2: timings?.afterScore || 2200,     // Re-score the rewritten resume
      3: timings?.latex || 18000,         // LaTeX conversion with thinking
      4: 1200,                            // Decode cookie
      5: timings?.overleaf ? Math.round(timings.overleaf * 0.15) : 3500,  // Connect Overleaf
      6: 1500,                            // Extract CSRF
      7: timings?.overleaf ? Math.round(timings.overleaf * 0.25) : 4500,  // Create project
      8: 1000,                            // Extract project ID
      9: timings?.overleaf ? Math.round(timings.overleaf * 0.4) : 8000,   // Compile PDF
      10: timings?.overleaf ? Math.round(timings.overleaf * 0.2) : 3000,  // Download PDF
    }

    for (let i = 0; i < steps.length; i++) {
      // Check if we should abort (API already finished)
      if (abortSignal?.aborted) {
        // Fast-forward remaining steps
        for (let j = i; j < steps.length; j++) {
          steps[j].status = 'done'
          steps[j].elapsed = stepTimingMap[j]
        }
        setWorkflowSteps([...steps])
        break
      }

      steps[i].status = 'running'
      steps[i].startTime = Date.now()
      setWorkflowSteps([...steps])

      const duration = stepTimingMap[i]

      // Live elapsed counter — update every 100ms
      const interval = setInterval(() => {
        steps[i].elapsed = Date.now() - steps[i].startTime
        setWorkflowSteps([...steps])
      }, 100)

      // Wait the full realistic duration (no cap!)
      await new Promise(r => setTimeout(r, duration))
      clearInterval(interval)

      steps[i].status = 'done'
      steps[i].elapsed = Date.now() - steps[i].startTime
      setWorkflowSteps([...steps])

      // Inter-step pause for visual clarity
      await new Promise(r => setTimeout(r, 200))
    }
  }, [])

  // ─── Generate Handler ────────────────────────────────────────
  const handleGenerate = useCallback(async (jd, resume) => {
    if (jd) setJobDescription(jd)
    if (resume) setCurrentResume(resume)

    const jdText = jd || jobDescription
    const resumeText = resume || currentResume

    setIsGenerating(true)
    setResult(null)
    setError(null)
    setWorkflowSteps(STEPS.map(s => ({ ...s, status: 'pending', elapsed: 0 })))

    try {
      const activeProvider = getActiveProvider()

      const body = {
        jobDescription: jdText,
        currentResume: resumeText,
        aiProvider: activeProvider,
        anthropicKey: getStoredKey('ats_anthropic_key'),
        openaiKey: getStoredKey('ats_openai_key'),
        geminiKey: getStoredKey('ats_gemini_key'),
        overleafSession: getStoredKey('ats_overleaf_session'),
        overleafGclb: getStoredKey('ats_gclb_token'),
      }

      // Create abort controller to signal animation when API is done
      const abortController = new AbortController()

      // Start both: API call + workflow animation
      const workflowPromise = fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      // Start the visual workflow simulation (runs independently)
      const animPromise = simulateWorkflow(null, abortController.signal)

      // Wait for API to finish
      const response = await workflowPromise
      const data = await response.json()

      // Signal animation to fast-forward remaining steps
      abortController.abort()

      // Give animation a moment to fast-forward
      await new Promise(r => setTimeout(r, 800))

      if (data.status === 'error') {
        // Mark last running/pending step as error
        setWorkflowSteps(prev => {
          const steps = [...prev]
          const errorIdx = steps.findIndex(s => s.status === 'running' || s.status === 'pending')
          if (errorIdx >= 0) steps[errorIdx].status = 'error'
          // Mark remaining as pending
          for (let i = errorIdx + 1; i < steps.length; i++) {
            if (steps[i].status !== 'done') steps[i].status = 'pending'
          }
          return steps
        })
        setError(data.message)
        return
      }

      // Update workflow with real timings from server
      if (data.timings) {
        setWorkflowSteps(prev => {
          const steps = [...prev]
          if (data.timings.beforeScore) steps[0].elapsed = data.timings.beforeScore
          if (data.timings.rewrite) steps[1].elapsed = data.timings.rewrite
          if (data.timings.afterScore) steps[2].elapsed = data.timings.afterScore
          if (data.timings.latex) steps[3].elapsed = data.timings.latex
          return steps
        })
      }

      // Mark all steps done
      setWorkflowSteps(prev => prev.map(s => ({ ...s, status: 'done' })))
      setResult(data)

      // Save to history
      saveToHistory({
        jobDescription: jdText,
        currentResume: resumeText,
        tailoredResume: data.markdownResume,
        beforeScore: data.beforeScore?.total || 0,
        afterScore: data.afterScore?.total || 0,
        pdfBase64: data.pdfBase64,
        beforeScoreFull: data.beforeScore,
        afterScoreFull: data.afterScore,
        projectUrl: data.projectUrl,
        aiProvider: data.aiProvider || activeProvider
      })

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 300)

    } catch (err) {
      setError(err.message || 'Network error — please check your connection and try again.')
      setWorkflowSteps(prev => {
        const steps = [...prev]
        const runningIdx = steps.findIndex(s => s.status === 'running' || s.status === 'pending')
        if (runningIdx >= 0) steps[runningIdx].status = 'error'
        return steps
      })
    } finally {
      setIsGenerating(false)
    }
  }, [jobDescription, currentResume, simulateWorkflow])

  // ─── History Management ──────────────────────────────────────
  const saveToHistory = (entry) => {
    const history = JSON.parse(localStorage.getItem('ats_resume_history') || '[]')
    const newEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      jdPreview: entry.jobDescription.substring(0, 80) + '…',
      ...entry,
      scoreDelta: entry.afterScore - entry.beforeScore
    }
    history.unshift(newEntry)
    if (history.length > 10) history.pop()
    localStorage.setItem('ats_resume_history', JSON.stringify(history))
    setHistoryRefresh(prev => prev + 1)
  }

  const handleRerun = (entry) => {
    setJobDescription(entry.jobDescription)
    setCurrentResume(entry.currentResume)
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      handleGenerate(entry.jobDescription, entry.currentResume)
    }, 800)
  }

  const handleShowDiff = (entry) => {
    setDiffData({
      original: entry.currentResume,
      tailored: entry.tailoredResume,
      jdPreview: entry.jdPreview
    })
    setShowDiff(true)
  }

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // ─── PDF Download Handler ─────────────────────────────────────
  const handleDownloadPdf = () => {
    if (!result?.pdfBase64) return
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

  // ─── Render ──────────────────────────────────────────────────
  const hasKeys = isActiveKeyValid() && getStoredKey('ats_overleaf_session')
  const canGenerate = jobDescription.trim() && currentResume.trim() && hasKeys

  return (
    <div className="min-h-screen bg-bg">
      <Navbar
        onGenerate={() => canGenerate && handleGenerate()}
        canGenerate={canGenerate}
        isGenerating={isGenerating}
      />

      <Hero onScrollToForm={handleScrollToForm} />
      <HowItWorks />
      <SetupPanel />

      <div ref={formRef}>
        <GeneratorForm
          jobDescription={jobDescription}
          currentResume={currentResume}
          onJDChange={setJobDescription}
          onResumeChange={setCurrentResume}
          onGenerate={() => handleGenerate()}
          canGenerate={canGenerate}
          isGenerating={isGenerating}
          hasKeys={hasKeys}
          activeProvider={getActiveProvider()}
        />
      </div>

      {(isGenerating || workflowSteps.length > 0) && (
        <WorkflowPanel
          steps={workflowSteps}
          isGenerating={isGenerating}
          error={error}
          result={result}
          onDownloadPdf={handleDownloadPdf}
        />
      )}

      {/* Retry button below workflow on error */}
      {error && !isGenerating && (
        <div className="max-w-5xl mx-auto px-6 -mt-4 mb-4">
          <div className="flex justify-center">
            <button
              onClick={() => handleGenerate()}
              className="px-8 py-3 bg-error/10 border border-error/25 text-error font-mono text-sm rounded-xl 
                         hover:bg-error/20 transition-all cursor-pointer flex items-center gap-2
                         shadow-[0_2px_16px_rgba(244,63,94,0.1)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Try Again
            </button>
          </div>
        </div>
      )}

      <div ref={resultRef}>
        {result && (
          <>
            <ScoreComparison
              beforeScore={result.beforeScore}
              afterScore={result.afterScore}
            />
            <ResultCard
              result={result}
              onShowHistory={() => {
                document.getElementById('history-panel')?.scrollIntoView({ behavior: 'smooth' })
              }}
            />
          </>
        )}
      </div>

      <HistoryPanel
        refreshTrigger={historyRefresh}
        onRerun={handleRerun}
        onShowDiff={handleShowDiff}
      />

      {/* Footer */}
      <footer className="text-center py-10 border-t border-border/40 mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber/50" />
            <span className="font-serif text-sm text-text/60">ResumeCopy</span>
          </div>
          <p className="font-mono text-muted/60 text-[11px] mb-3">
            Free AI Resume Builder & ATS Resume Optimizer · Powered by Claude · ChatGPT · Gemini
          </p>
          <p className="text-muted/40 text-[11px] mb-4 max-w-lg mx-auto leading-relaxed">
            ResumeCopy helps job seekers build ATS-optimized resumes that pass Applicant Tracking Systems like Taleo, Workday, Greenhouse, and Lever.
            Your resume and job description are processed in-memory and never stored on any server.
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-muted/40 mb-3">
            <a href="#what-is-ats" className="hover:text-amber transition-colors">What is ATS?</a>
            <span>·</span>
            <a href="#how-it-works" className="hover:text-amber transition-colors">How It Works</a>
            <span>·</span>
            <a href="#why-resumecopy" className="hover:text-amber transition-colors">Features</a>
            <span>·</span>
            <a href="#ats-scoring" className="hover:text-amber transition-colors">ATS Scoring</a>
            <span>·</span>
            <a href="#faq" className="hover:text-amber transition-colors">FAQ</a>
            <span>·</span>
            <a href="#setup-panel" className="hover:text-amber transition-colors">Setup</a>
          </div>
          <p className="text-muted/30 text-[10px]">
            © {new Date().getFullYear()} ResumeCopy. Free AI resume builder for job seekers worldwide.
          </p>
        </div>
      </footer>

      {showDiff && diffData && (
        <DiffModal
          original={diffData.original}
          tailored={diffData.tailored}
          jdPreview={diffData.jdPreview}
          onClose={() => setShowDiff(false)}
        />
      )}
    </div>
  )
}

export default App
