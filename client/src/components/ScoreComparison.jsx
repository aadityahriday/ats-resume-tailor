import { useState, useEffect, useRef } from 'react'

function AnimatedNumber({ value, duration = 800, delay = 0, color = 'text-text' }) {
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOut
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [started, value, duration])

  return (
    <span className={`font-mono text-5xl font-bold ${color}`}>
      {display}
    </span>
  )
}

function ProgressBar({ value, max, delay = 0, color = 'bg-muted' }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth((value / max) * 100)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, max, delay])

  return (
    <div className="h-2 bg-border rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

function BreakdownRow({ label, maxPts, before, after, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const delta = after - before

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!visible) return null

  return (
    <div className="grid grid-cols-4 gap-4 py-2 px-4 rounded hover:bg-bg/30 transition-colors animate-slide-in-left text-sm">
      <div className="font-sans text-muted-light">
        {label} <span className="text-muted text-xs">({maxPts}pts)</span>
      </div>
      <div className="font-mono text-muted text-center">{before}</div>
      <div className="font-mono text-amber text-center">{after}</div>
      <div className={`font-mono text-center ${delta > 0 ? 'text-success' : delta < 0 ? 'text-error' : 'text-muted'}`}>
        {delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : '—'}
      </div>
    </div>
  )
}

export default function ScoreComparison({ beforeScore, afterScore }) {
  if (!beforeScore || !afterScore) return null

  const improvement = afterScore.total - beforeScore.total
  const keywordsAdded = afterScore.matchedKeywords
    ?.filter(k => !beforeScore.matchedKeywords?.includes(k))
    ?.slice(0, 5) || []
  const stillMissing = afterScore.topMissingKeywords?.slice(0, 5) || []

  return (
    <section className="max-w-4xl mx-auto px-6 py-8 animate-fade-in" id="score-comparison">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between" style={{ background: 'linear-gradient(180deg, rgba(24,28,38,0.5) 0%, transparent 100%)' }}>
          <div className="flex items-center gap-3">
            <span className="text-lg">📊</span>
            <h3 className="font-mono text-text/90 font-semibold text-xs tracking-[0.1em] uppercase">ATS Score Analysis</h3>
          </div>
          <span className="font-mono text-muted/60 text-[10px]">Deterministic Algorithm</span>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-3 gap-6 p-8">
          {/* Before */}
          <div className="text-center">
            <p className="font-mono text-muted text-xs uppercase tracking-wider mb-3">Before</p>
            <div className="bg-bg rounded p-6">
              <AnimatedNumber value={beforeScore.total} duration={800} color="text-muted-light" />
              <p className="font-mono text-muted text-sm mt-1">/100</p>
            </div>
            <div className="mt-3">
              <ProgressBar value={beforeScore.total} max={100} delay={200} color="bg-muted" />
            </div>
          </div>

          {/* After */}
          <div className="text-center">
            <p className="font-mono text-muted text-xs uppercase tracking-wider mb-3">After</p>
            <div className="bg-bg rounded p-6 border border-amber/20">
              <AnimatedNumber value={afterScore.total} duration={800} delay={900} color="text-amber" />
              <p className="font-mono text-amber/60 text-sm mt-1">/100</p>
            </div>
            <div className="mt-3">
              <ProgressBar value={afterScore.total} max={100} delay={1200} color="bg-amber" />
            </div>
          </div>

          {/* Improvement */}
          <div className="text-center">
            <p className="font-mono text-muted text-xs uppercase tracking-wider mb-3">Improvement</p>
            <div className="bg-bg rounded p-6">
              <AnimatedNumber
                value={improvement}
                duration={600}
                delay={1800}
                color={improvement > 0 ? 'text-success' : 'text-error'}
              />
              <p className="font-mono text-success/60 text-sm mt-1">pts</p>
            </div>
          </div>
        </div>

        {/* Arrow between before and after */}
        <div className="flex justify-center -mt-4 mb-4">
          <span className="text-amber text-2xl">→</span>
        </div>

        {/* Breakdown Table */}
        <div className="px-6 pb-6">
          <div className="bg-bg/50 rounded border border-border">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-border">
              <div className="font-mono text-muted text-xs uppercase">Dimension</div>
              <div className="font-mono text-muted text-xs uppercase text-center">Before</div>
              <div className="font-mono text-muted text-xs uppercase text-center">After</div>
              <div className="font-mono text-muted text-xs uppercase text-center">Delta</div>
            </div>

            {/* Rows */}
            <BreakdownRow
              label="Keyword Match"
              maxPts={40}
              before={beforeScore.breakdown.keywordMatch.score}
              after={afterScore.breakdown.keywordMatch.score}
              delay={1800}
            />
            <BreakdownRow
              label="Section Headers"
              maxPts={15}
              before={beforeScore.breakdown.sectionHeaders.score}
              after={afterScore.breakdown.sectionHeaders.score}
              delay={1860}
            />
            <BreakdownRow
              label="Quantified Achievements"
              maxPts={15}
              before={beforeScore.breakdown.quantifiedAchievements.score}
              after={afterScore.breakdown.quantifiedAchievements.score}
              delay={1920}
            />
            <BreakdownRow
              label="Action Verbs"
              maxPts={10}
              before={beforeScore.breakdown.actionVerbs.score}
              after={afterScore.breakdown.actionVerbs.score}
              delay={1980}
            />
            <BreakdownRow
              label="Contact Completeness"
              maxPts={10}
              before={beforeScore.breakdown.contactInfo.score}
              after={afterScore.breakdown.contactInfo.score}
              delay={2040}
            />
            <BreakdownRow
              label="Formatting Signals"
              maxPts={10}
              before={beforeScore.breakdown.formatting.score}
              after={afterScore.breakdown.formatting.score}
              delay={2100}
            />
          </div>
        </div>

        {/* Keywords */}
        <div className="px-6 pb-6 space-y-3">
          {keywordsAdded.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-success shrink-0">✅</span>
              <div>
                <span className="text-muted">Keywords Added:</span>{' '}
                <span className="font-mono text-success text-xs">
                  {keywordsAdded.join(' · ')}
                </span>
              </div>
            </div>
          )}
          {stillMissing.length > 0 ? (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber shrink-0">⚠️</span>
              <div>
                <span className="text-muted">Still Missing:</span>{' '}
                <span className="font-mono text-amber text-xs">
                  {stillMissing.join(' · ')}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-success shrink-0">✅</span>
              <span className="text-muted">Still Missing: <span className="text-success">none</span></span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
