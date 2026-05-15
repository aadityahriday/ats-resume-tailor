import { useState, useEffect } from 'react'
import useTheme from '../hooks/useTheme'

export default function Navbar({ onGenerate, canGenerate, isGenerating }) {
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      id="navbar"
      aria-label="Main navigation"
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
          <span className="font-serif text-xl text-text tracking-tight" role="img" aria-label="ResumeCopy logo">
            ResumeCopy
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[9px] font-mono text-amber/80 bg-amber/8 border border-amber/15 uppercase tracking-wider">
            Pro
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-surface-raised transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F1F3F8" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* CTA Button */}
        <button
          id="nav-generate-btn"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className={`px-3 sm:px-5 py-2 font-mono text-xs sm:text-sm font-medium transition-all duration-300 rounded-lg ${
            canGenerate && !isGenerating
              ? 'bg-amber text-bg hover:bg-amber-hover hover:-translate-y-0.5 cursor-pointer shadow-[0_2px_16px_rgba(255,159,67,0.2)]'
              : 'bg-border text-muted cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-bg border-t-transparent animate-spin" />
              <span className="hidden sm:inline">Generating…</span>
              <span className="sm:hidden">Gen…</span>
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
