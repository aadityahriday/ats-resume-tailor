import { useState, useEffect } from 'react'

export default function Navbar({ onGenerate, canGenerate, isGenerating }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-bg/70 backdrop-blur-2xl border-b border-border/50 shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-amber block" />
            <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-amber animate-ping opacity-30" />
          </div>
          <h1 className="font-serif text-xl text-text tracking-tight">
            ResumeCopy
          </h1>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[9px] font-mono text-amber/80 bg-amber/8 border border-amber/15 uppercase tracking-wider">
            Pro
          </span>
        </div>

        {/* CTA Button */}
        <button
          id="nav-generate-btn"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className={`px-5 py-2 font-mono text-sm font-medium transition-all duration-300 rounded-lg ${
            canGenerate && !isGenerating
              ? 'bg-amber text-bg hover:bg-amber-hover hover:-translate-y-0.5 cursor-pointer shadow-[0_2px_16px_rgba(255,159,67,0.2)]'
              : 'bg-border text-muted cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-bg border-t-transparent animate-spin" />
              Generating…
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              Generate
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
