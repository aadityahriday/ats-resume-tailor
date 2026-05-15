import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
    // If already accepted, enable analytics
    if (consent === 'accepted') {
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setShow(false)
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setShow(false)
    window['ga-disable-G-XTQB72VC4H'] = true
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-in-up">
      <div className="max-w-xl mx-auto bg-surface border border-border rounded-2xl p-5 shadow-[0_-4px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-text text-sm font-medium mb-1">🍪 Cookie Consent</p>
            <p className="text-muted text-xs leading-relaxed">
              We use Google Analytics cookies to understand how you use our site.
              <Link to="/privacy-policy" className="text-amber hover:underline ml-1">Learn more</Link>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-xs font-mono text-muted hover:text-text border border-border rounded-lg hover:border-border-bright transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-xs font-mono text-bg bg-amber hover:bg-amber-hover rounded-lg transition-colors font-medium cursor-pointer"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
