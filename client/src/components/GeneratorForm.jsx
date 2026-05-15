const PROVIDER_LABELS = {
  gemini: 'Gemini 2.5 Flash',
  openai: 'GPT-4o',
  anthropic: 'Claude 3.7 Sonnet',
}

export default function GeneratorForm({
  jobDescription,
  currentResume,
  onJDChange,
  onResumeChange,
  onGenerate,
  canGenerate,
  isGenerating,
  hasKeys,
  activeProvider = 'gemini',
}) {
  // Word count calculations
  const jdWordCount = jobDescription.trim().split(/\s+/).filter(w => w.length > 0).length
  const resumeWordCount = currentResume.trim().split(/\s+/).filter(w => w.length > 0).length
  const jdCharCount = jobDescription.length
  const resumeCharCount = currentResume.length

  // Recommended ranges
  const jdRecommendedMin = 200
  const jdRecommendedMax = 2000
  const resumeRecommendedMin = 300
  const resumeRecommendedMax = 1000

  // Progress percentages
  const jdProgress = Math.min((jdCharCount / jdRecommendedMax) * 100, 100)
  const resumeProgress = Math.min((resumeCharCount / resumeRecommendedMax) * 100, 100)
  const getDisabledReason = () => {
    if (!hasKeys) return 'Connect your API key and Overleaf cookies in Setup above'
    if (!jobDescription.trim()) return 'Paste a job description first'
    if (!currentResume.trim()) return 'Paste your current resume first'
    return ''
  }

  const providerLabel = PROVIDER_LABELS[activeProvider] || 'AI'

  return (
    <section className="max-w-5xl mx-auto px-6 py-12" id="generator-form">
      <div className="text-center mb-10">
        <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">Generate</span>
        <h2 className="font-serif text-2xl md:text-3xl text-text">Paste & Generate</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Job Description */}
        <div className="relative group">
          <div className="flex items-center justify-between mb-2.5">
            <label htmlFor="jd-textarea" className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-violet/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="9" y1="9" x2="15" y2="9"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="12" y2="17"/>
                </svg>
              </span>
              <span className="font-mono text-xs text-muted-light uppercase tracking-wider">Job Description</span>
            </label>
          </div>
          
          <textarea
            id="jd-textarea"
            value={jobDescription}
            onChange={(e) => onJDChange(e.target.value)}
            placeholder="Paste the full job description here — include requirements, responsibilities, and preferred qualifications for best results…"
            className="w-full min-h-[360px] bg-surface border border-border rounded-xl p-4 font-mono text-sm text-text
                       placeholder-muted/30 resize-y transition-all duration-300
                       hover:border-border-bright"
            disabled={isGenerating}
          ></textarea>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-border/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      jdCharCount < jdRecommendedMin 
                        ? 'bg-error' 
                        : jdCharCount > jdRecommendedMax 
                          ? 'bg-amber' 
                          : 'bg-success'
                    }`}
                    style={{ width: `${jdProgress}%` }}
                  />
                </div>
                <span className={`font-mono text-[10px] tabular-nums ${
                  jdCharCount < jdRecommendedMin 
                    ? 'text-error' 
                    : jdCharCount > jdRecommendedMax 
                      ? 'text-amber' 
                      : 'text-success'
                }`}>
                  {jdWordCount} words · {jdCharCount.toLocaleString()} chars
                </span>
              </div>
            </div>
        </div>

        {/* Current Resume */}
        <div className="relative group">
          <div className="flex items-center justify-between mb-2.5">
            <label htmlFor="resume-textarea" className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </span>
              <span className="font-mono text-xs text-muted-light uppercase tracking-wider">Your Current Resume</span>
            </label>
          </div>
          
          <textarea
            id="resume-textarea"
            value={currentResume}
            onChange={(e) => onResumeChange(e.target.value)}
            placeholder="Paste your current resume as plain text here…"
            className="w-full min-h-[360px] bg-surface border border-border rounded-xl p-4 font-mono text-sm text-text
                       placeholder-muted/30 resize-y transition-all duration-300
                       hover:border-border-bright"
            disabled={isGenerating}
          ></textarea>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-border/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      resumeCharCount < resumeRecommendedMin 
                        ? 'bg-error' 
                        : resumeCharCount > resumeRecommendedMax 
                          ? 'bg-amber' 
                          : 'bg-success'
                    }`}
                    style={{ width: `${resumeProgress}%` }}
                  />
                </div>
                <span className={`font-mono text-[10px] tabular-nums ${
                  resumeCharCount < resumeRecommendedMin 
                    ? 'text-error' 
                    : resumeCharCount > resumeRecommendedMax 
                      ? 'text-amber' 
                      : 'text-success'
                }`}>
                  {resumeWordCount} words · {resumeCharCount.toLocaleString()} chars
                </span>
              </div>
            </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="relative group">
        <button
          id="generate-btn"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className={`w-full py-4 font-mono text-base uppercase tracking-wider font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
            canGenerate && !isGenerating
              ? 'bg-amber text-bg hover:bg-amber-hover shadow-[0_4px_32px_rgba(255,159,67,0.2)] hover:shadow-[0_8px_48px_rgba(255,159,67,0.3)] hover:-translate-y-0.5'
              : 'bg-border text-muted cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 rounded-full border-2 border-bg border-t-transparent animate-spin" />
              Processing with {providerLabel}…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Generate ATS Resume
              <span className="text-sm opacity-70 font-normal normal-case">via {providerLabel}</span>
            </span>
          )}
        </button>

        {/* Tooltip on disabled */}
        {!canGenerate && !isGenerating && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2
                          glass rounded-lg px-4 py-2 text-xs font-mono text-muted-light whitespace-nowrap z-10">
            {getDisabledReason()}
          </div>
        )}
      </div>
    </section>
  )
}
