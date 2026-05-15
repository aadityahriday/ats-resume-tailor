import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="text-center py-10 border-t border-border/40 mt-20" role="contentinfo">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber/50" />
          <Link to="/" className="font-serif text-sm text-text/60 hover:text-amber transition-colors">ResumeCopy</Link>
        </div>
        <p className="font-mono text-muted/60 text-[11px] mb-3">
          Free AI Resume Builder &amp; ATS Resume Optimizer
        </p>
        <p className="text-muted/40 text-[11px] mb-4 max-w-lg mx-auto leading-relaxed">
          ResumeCopy helps job seekers build ATS-optimized resumes that pass Applicant Tracking Systems like Taleo, Workday, Greenhouse, and Lever.
          Your resume and job description are processed in-memory and never stored on any server.
        </p>

        {/* Footer links — grid on mobile, inline on desktop */}
        <nav aria-label="Footer navigation" className="mb-8 sm:mb-4">
          {/* Mobile: flex wrap centered */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:hidden text-[11px] font-mono text-muted/60 px-4">
            <Link to="/about" className="hover:text-amber transition-colors">About</Link>
            <Link to="/contact" className="hover:text-amber transition-colors">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-amber transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-amber transition-colors">Terms</Link>
            <Link to="/disclaimer" className="hover:text-amber transition-colors">Disclaimer</Link>
            <a href="/#faq" className="hover:text-amber transition-colors">FAQ</a>
          </div>
          {/* Desktop: inline with dots */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-mono text-muted/40">
            <Link to="/about" className="hover:text-amber transition-colors">About</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-amber transition-colors">Contact</Link>
            <span>·</span>
            <Link to="/privacy-policy" className="hover:text-amber transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms-of-service" className="hover:text-amber transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link to="/disclaimer" className="hover:text-amber transition-colors">Disclaimer</Link>
            <span>·</span>
            <a href="/#what-is-ats" className="hover:text-amber transition-colors">What is ATS?</a>
            <span>·</span>
            <a href="/#how-it-works" className="hover:text-amber transition-colors">How It Works</a>
            <span>·</span>
            <a href="/#faq" className="hover:text-amber transition-colors">FAQ</a>
          </div>
        </nav>

        {/* Author Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="inline-flex items-center gap-2 bg-surface-raised px-4 py-2 rounded-full border border-border/50 shadow-sm whitespace-nowrap overflow-hidden">
            <span className="text-muted/40 text-[11px] font-mono leading-none">Built by</span>
            <img src="/author.jpg" alt="Aaditya Hriday" width="20" height="20" className="w-5 h-5 rounded-full object-cover border border-border/50 shrink-0" loading="lazy" />
            <a href="https://instagram.com/aadityahriday" target="_blank" rel="noopener noreferrer" className="text-text/70 text-[11px] font-mono font-medium hover:text-amber transition-colors flex items-center leading-none m-0 p-0">Aaditya Hriday</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/aadityahriday" target="_blank" rel="noopener noreferrer" className="text-muted/40 hover:text-amber transition-colors" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://instagram.com/aadityahriday" target="_blank" rel="noopener noreferrer" className="text-muted/40 hover:text-amber transition-colors" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

        <p className="text-muted/30 text-[10px]">
          © {new Date().getFullYear()} ResumeCopy. Free AI resume builder for job seekers worldwide.
        </p>
      </div>
    </footer>
  )
}
