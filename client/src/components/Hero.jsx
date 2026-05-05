import { useEffect, useRef } from 'react'

export default function Hero({ onScrollToForm }) {
  const containerRef = useRef(null)
  const orbRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      // Move the gradient orb
      if (orbRef.current) {
        orbRef.current.style.left = `${x * 100}%`
        orbRef.current.style.top = `${y * 100}%`
      }
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden"
      id="hero"
    >
      {/* Interactive gradient orb */}
      <div
        ref={orbRef}
        className="absolute w-[600px] h-[600px] pointer-events-none"
        style={{
          left: '50%',
          top: '40%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,159,67,0.06) 0%, rgba(255,159,67,0.02) 40%, transparent 70%)',
          transition: 'left 0.5s ease-out, top 0.5s ease-out',
        }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-amber/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        {/* Tag line */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-surface-raised/80 border border-border-bright/50 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-xs text-muted-light tracking-wider">POWERED BY AI · 11-STEP PIPELINE · OVERLEAF PDF</span>
        </div>

        {/* Main headline */}
        <h1 className="font-serif text-6xl md:text-[5.5rem] leading-[1.02] tracking-tight mb-8">
          <span className="block text-text">Beat the Bots.</span>
          <span className="block mt-3 text-gradient" style={{
            background: 'linear-gradient(135deg, #FF9F43, #FFD700, #FF9F43)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'gradient-x 4s ease infinite',
          }}>
            Land the Interview.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-muted-light text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-sans">
          Paste your resume and a job description. AI rewrites, keyword-optimizes,
          and compiles a recruiter-ready PDF — all in under 90 seconds.
        </p>

        {/* CTA */}
        <button
          id="hero-cta"
          onClick={onScrollToForm}
          className="group relative px-12 py-4 bg-amber text-bg font-mono text-lg font-semibold rounded-xl cursor-pointer
                     hover:bg-amber-hover transition-all duration-300
                     shadow-[0_4px_32px_rgba(255,159,67,0.25)] hover:shadow-[0_8px_48px_rgba(255,159,67,0.35)]
                     hover:-translate-y-0.5"
        >
          <span className="relative z-10 flex items-center gap-2">
            Tailor My Resume
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </button>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-12">
          {[
            { label: 'AI Models', value: '3', icon: '🧠' },
            { label: 'Pipeline Steps', value: '11', icon: '⚡' },
            { label: 'ATS Score Target', value: '90+', icon: '🎯' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-surface/60 border border-border/50 backdrop-blur-sm">
              <span className="text-lg">{stat.icon}</span>
              <div className="text-left">
                <span className="block font-mono text-amber text-sm font-bold">{stat.value}</span>
                <span className="block text-muted text-[10px] font-mono uppercase tracking-wider">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-muted text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-muted/40 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-amber/60 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
