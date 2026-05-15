import { useState, useRef, useCallback, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import TemplateGallery from './components/TemplateGallery'
import Testimonials from './components/Testimonials'
import SetupPanel from './components/SetupPanel'
import GeneratorForm from './components/GeneratorForm'
import WorkflowPanel from './components/WorkflowPanel'
import ScoreComparison from './components/ScoreComparison'
import ResultCard from './components/ResultCard'
import HistoryPanel from './components/HistoryPanel'
import DiffModal from './components/DiffModal'
import OnboardingTour from './components/OnboardingTour'
import ErrorPopup from './components/ErrorPopup'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import DisclaimerPage from './pages/DisclaimerPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// ─── Provider Display Names ────────────────────────────────────
const PROVIDER_LABELS = {
  gemini: 'Gemini 2.5 Flash',
  openai: 'GPT-4o',
  anthropic: 'Claude 3.7 Sonnet',
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
  const [runTour, setRunTour] = useState(false)

  // ─── Close Modals on Escape Key ─────────────────────────────────
  useEffect(() => {
    const handleCloseAllModals = () => {
      setShowDiff(false)
    }

    window.addEventListener('closeAllModals', handleCloseAllModals)
    return () => window.removeEventListener('closeAllModals', handleCloseAllModals)
  }, [])

  const formRef = useRef(null)
  const resultRef = useRef(null)

  // Check if user has seen onboarding tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('ats_onboarding_seen')
    if (!hasSeenTour) {
      // Delay tour start to let page load
      setTimeout(() => setRunTour(true), 1500)
    }
  }, [])

  const handleTourClose = () => {
    setRunTour(false)
    localStorage.setItem('ats_onboarding_seen', 'true')
  }

  // ─── API Key helpers ─────────────────────────────────────────
  const getStoredKey = (key) => localStorage.getItem(key) || ''

  const getActiveProvider = () => localStorage.getItem('ats_ai_provider') || 'gemini'

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

  // Initialize workflow steps so they are visible from the start
  useEffect(() => {
    if (workflowSteps.length === 0 && !isGenerating && !result) {
      setWorkflowSteps(STEPS.map(s => ({ ...s, status: 'pending', elapsed: 0, startTime: null })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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

    let apiFinished = false

    for (let i = 0; i < steps.length; i++) {
      // Check if we should abort immediately for error
      if (abortSignal?.aborted) {
        if (abortSignal.reason === 'error') {
          steps[i].status = 'error'
          for (let j = i + 1; j < steps.length; j++) steps[j].status = 'pending'
          setWorkflowSteps([...steps])
          break
        } else {
          apiFinished = true
        }
      }

      steps[i].status = 'running'
      steps[i].startTime = Date.now()
      setWorkflowSteps([...steps])

      // Minimum 2s + 0-1.5s jitter to look realistic and not fixed
      const baseJitter = 2000 + Math.random() * 1500
      const expectedDuration = stepTimingMap[i] || 0

      // Live elapsed counter
      const interval = setInterval(() => {
        steps[i].elapsed = Date.now() - steps[i].startTime
        setWorkflowSteps([...steps])
      }, 100)

      // Wait loop: checks every 100ms if target duration is met.
      // If API finishes mid-step, the target drops to just the minimum baseJitter!
      const wasError = await new Promise(resolve => {
        let timeoutId;
        
        const checkDone = () => {
          const elapsed = Date.now() - steps[i].startTime
          const currentTarget = apiFinished ? baseJitter : Math.max(baseJitter, expectedDuration)
          
          if (elapsed >= currentTarget) {
            resolve(false)
          } else {
            timeoutId = setTimeout(checkDone, 100)
          }
        }
        
        checkDone()

        if (abortSignal && !abortSignal.aborted) {
          abortSignal.addEventListener('abort', () => {
            if (abortSignal.reason === 'error') {
              clearTimeout(timeoutId)
              resolve(true)
            } else {
              apiFinished = true
            }
          }, { once: true })
        }
      })

      clearInterval(interval)

      if (wasError) {
        steps[i].status = 'error'
        for (let j = i + 1; j < steps.length; j++) {
          steps[j].status = 'pending'
        }
        setWorkflowSteps([...steps])
        break
      }

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

    // Scroll to workflow immediately upon clicking Generate
    setTimeout(() => {
      document.getElementById('workflow-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    let animPromise = null
    const abortController = new AbortController()

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
      }

      const timeoutSignal = AbortSignal.timeout(120000)
      const combinedSignal = abortController.signal ? 
        AbortSignal.any([abortController.signal, timeoutSignal]) : 
        timeoutSignal

      // Start both: API call + workflow animation
      const workflowPromise = fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: combinedSignal
      })

      // Start the visual workflow simulation (runs independently)
      animPromise = simulateWorkflow(null, abortController.signal)

      // Wait for API to finish
      const response = await workflowPromise
      const data = await response.json()

      if (data.status === 'error') {
        // Send error interrupt to animation
        abortController.abort('error')
        await animPromise
        setError(data.message)
        return
      }

      // Send success interrupt to safely fast-forward animation
      abortController.abort('success')
      await animPromise

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
      abortController.abort('error')
      // Wait for animation to visually reflect the error state
      if (animPromise) {
        try { await animPromise } catch(e) {}
      }
      setError(err.message || 'Network error — please check your connection and try again.')
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

  // ─── Render Variables ─────────────────────────────────────────────
  const hasKeys = isActiveKeyValid() && getStoredKey('ats_overleaf_session')
  const canGenerate = jobDescription.trim() && currentResume.trim() && hasKeys

  // ─── Keyboard Shortcuts ─────────────────────────────────────────
  useKeyboardShortcuts({
    onGenerate: () => canGenerate && handleGenerate(),
    onScrollToForm: handleScrollToForm,
    canGenerate,
    isGenerating
  })

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
  return (
    <div className="min-h-screen bg-bg">
      <header role="banner">
        <Navbar
          onGenerate={() => canGenerate && handleGenerate()}
          canGenerate={canGenerate}
          isGenerating={isGenerating}
        />
      </header>

      <Routes>
        <Route path="/" element={
          <main id="main-content" role="main">
            <Hero onScrollToForm={handleScrollToForm} />
            <HowItWorks />
            <TemplateGallery />
            <Testimonials />
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
          </main>
        } />

        {/* ═══ Policy & Info Pages (Real Routes for AdSense) ═══ */}
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/terms-of-service" element={<TermsPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      {/* Global Overlays */}
      <ErrorPopup error={error} onClose={() => setError(null)} />

      {showDiff && diffData && (
        <DiffModal
          original={diffData.original}
          tailored={diffData.tailored}
          jdPreview={diffData.jdPreview}
          onClose={() => setShowDiff(false)}
        />
      )}

      <OnboardingTour run={runTour} onClose={handleTourClose} />
      <CookieConsent />
    </div>
  )
}

export default App
