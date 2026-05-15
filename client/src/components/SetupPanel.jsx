import { useState, useEffect } from 'react'

const AI_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Gemini',
    company: 'Google',
    icon: '�',
    color: 'blue',
    keyPrefix: '',
    placeholder: 'AIzaSy...',
    storageKey: 'ats_gemini_key',
    helpUrl: 'https://aistudio.google.com/apikey',
    helpText: 'aistudio.google.com',
    steps: 'Sign in with Google → Click "Get API key" → "Create API key" → Copy it. No credit card needed.',
    model: 'Gemini 2.5 Flash',
    badge: 'FREE — Recommended',
    badgeColor: 'bg-success/15 text-success border-success/30',
    tier: 'free',
    tierNote: 'No billing required. 250 generations/day free.',
  },
  {
    id: 'openai',
    name: 'ChatGPT',
    company: 'OpenAI',
    icon: '🟢',
    color: 'emerald',
    keyPrefix: 'sk-',
    placeholder: 'sk-proj-...',
    storageKey: 'ats_openai_key',
    helpUrl: 'https://platform.openai.com/api-keys',
    helpText: 'platform.openai.com',
    steps: 'Sign up → Add billing (min 5) → Click "API Keys" → "Create new secret key" → Copy it',
    model: 'GPT-4o',
    badge: 'Paid — Pay-as-you-go',
    badgeColor: 'bg-amber/15 text-amber border-amber/30',
    tier: 'paid',
    tierNote: 'Requires OpenAI billing. ~$0.05 per resume.',
  },
  {
    id: 'anthropic',
    name: 'Claude',
    company: 'Anthropic',
    icon: '�',
    color: 'purple',
    keyPrefix: 'sk-ant-',
    placeholder: 'sk-ant-api03-...',
    storageKey: 'ats_anthropic_key',
    helpUrl: 'https://console.anthropic.com',
    helpText: 'console.anthropic.com',
    steps: 'Sign up → Add billing (min 5) → Click "API Keys" → "Create Key" → Copy it',
    model: 'Claude 3.7 Sonnet',
    badge: 'Premium — Best Quality',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    tier: 'premium',
    tierNote: 'Requires Anthropic billing. Highest reasoning quality.',
  },
]

export default function SetupPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [userClosed, setUserClosed] = useState(false)
  const [activeProvider, setActiveProvider] = useState('gemini')
  const [apiKeys, setApiKeys] = useState({
    anthropic: '',
    openai: '',
    gemini: '',
  })
  const [overleafSession, setOverleafSession] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [showCookieGuide, setShowCookieGuide] = useState(false)

  useEffect(() => {
    if (!userClosed) {
      const storedProvider = localStorage.getItem('ats_ai_provider') || 'gemini'
      const storedKeys = {
        anthropic: localStorage.getItem('ats_anthropic_key') || '',
        openai: localStorage.getItem('ats_openai_key') || '',
        gemini: localStorage.getItem('ats_gemini_key') || '',
      }
      const storedSession = localStorage.getItem('ats_overleaf_session') || ''

      setActiveProvider(storedProvider)
      setApiKeys(storedKeys)
      setOverleafSession(storedSession)

      // Auto-open if no key configured for any provider or no session
      const hasAnyKey = Object.values(storedKeys).some(k => k.length > 5)
      if (!hasAnyKey || !storedSession) {
        setIsOpen(true)
      }
    }
  }, [userClosed])

  const handleProviderChange = (providerId) => {
    setActiveProvider(providerId)
    localStorage.setItem('ats_ai_provider', providerId)
    setShowKey(false)
  }

  const handleSaveKey = (key, value, setter) => {
    if (typeof setter === 'function') {
      setter(value)
    }
    localStorage.setItem(key, value)
  }

  const handleApiKeyChange = (providerId, value) => {
    setApiKeys(prev => ({ ...prev, [providerId]: value }))
    const provider = AI_PROVIDERS.find(p => p.id === providerId)
    if (provider) {
      localStorage.setItem(provider.storageKey, value)
    }
  }

  const activeProviderConfig = AI_PROVIDERS.find(p => p.id === activeProvider)
  const activeKey = apiKeys[activeProvider] || ''
  const isKeyValid = activeProvider === 'gemini'
    ? activeKey.length > 10
    : activeProvider === 'openai'
      ? activeKey.startsWith('sk-')
      : activeKey.startsWith('sk-ant-')
  const isSessionSet = overleafSession.length > 10

  // Count how many providers have valid keys
  const validKeyCount = AI_PROVIDERS.filter(p => {
    const key = apiKeys[p.id] || ''
    if (p.id === 'gemini') return key.length > 10
    if (p.id === 'openai') return key.startsWith('sk-')
    return key.startsWith('sk-ant-')
  }).length

  return (
    <section className="max-w-4xl mx-auto px-6 py-8" id="setup-panel">
      {/* Toggle header */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (isOpen) setUserClosed(false) }}
        className="w-full flex items-center justify-between py-4 px-6 bg-surface border border-border rounded-2xl hover:border-amber/30 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-amber text-lg">⚙</span>
          <span className="font-mono text-text font-medium">
            Setup (one time)
          </span>
          {isKeyValid && isSessionSet && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success text-xs font-mono rounded">
              ✓ Connected
            </span>
          )}
          {validKeyCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber/10 text-amber text-xs font-mono rounded">
              {validKeyCount} key{validKeyCount > 1 ? 's' : ''} set
            </span>
          )}
        </div>
        <span className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="mt-3 bg-surface border border-border rounded-2xl p-8 animate-slide-in-up">
          <h3 className="font-serif text-2xl text-text mb-2">Connect Your AI — Takes 30 Seconds</h3>
          <p className="text-muted text-sm mb-8">
            Start with <span className="text-success font-semibold">Gemini (free, no credit card)</span> —
            it's the easiest. Upgrade to ChatGPT or Claude later for more advanced options.
          </p>

          {/* ═══ Step 1: AI Provider Selector ═══ */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 flex items-center justify-center bg-amber/10 text-amber font-mono text-xs rounded font-bold">1</span>
              <h4 className="font-mono text-text font-medium text-sm">Choose AI Provider</h4>
            </div>

            {/* Provider Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {AI_PROVIDERS.map((provider) => {
                const key = apiKeys[provider.id] || ''
                const hasValidKey = provider.id === 'gemini'
                  ? key.length > 10
                  : provider.id === 'openai'
                    ? key.startsWith('sk-')
                    : key.startsWith('sk-ant-')
                const isActive = activeProvider === provider.id

                return (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderChange(provider.id)}
                    className={`relative flex flex-col items-center p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                      isActive
                        ? 'border-amber bg-amber/5 shadow-lg shadow-amber/10'
                        : 'border-border bg-bg/50 hover:border-border hover:bg-bg/80'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -top-px -right-px">
                        <div className="w-3 h-3 bg-amber rounded-bl rounded-tr animate-pulse-amber" />
                      </div>
                    )}

                    {/* Provider Icon */}
                    <span className="text-2xl mb-2">{provider.icon}</span>

                    {/* Name & Company */}
                    <span className={`font-mono text-sm font-semibold mb-0.5 ${isActive ? 'text-text' : 'text-muted-light'}`}>
                      {provider.name}
                    </span>
                    <span className="text-muted text-xs mb-2">{provider.company}</span>

                    {/* Model Name */}
                    <span className="font-mono text-xs text-muted mb-2">{provider.model}</span>

                    {/* Badge */}
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded border ${provider.badgeColor}`}>
                      {provider.badge}
                    </span>

                    {/* Tier note */}
                    {provider.tierNote && (
                      <span className="mt-2 text-[10px] text-muted text-center leading-tight">
                        {provider.tierNote}
                      </span>
                    )}

                    {/* Key Status */}
                    {hasValidKey && (
                      <span className="mt-2 text-success text-xs">✓ Key Set</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ═══ Step 2: API Key Input for Selected Provider ═══ */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 flex items-center justify-center bg-amber/10 text-amber font-mono text-xs rounded font-bold">2</span>
              <h4 className="font-mono text-text font-medium text-sm">
                {activeProviderConfig.name} API Key
              </h4>
              {isKeyValid && <span className="text-success text-sm">✓ Valid</span>}
            </div>

            <div className="bg-bg/50 border border-border rounded p-4 mb-3">
              <p className="text-muted text-xs leading-relaxed mb-3">
                <strong className="text-text">How to get it:</strong> Go to{' '}
                <a href={activeProviderConfig.helpUrl} target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">
                  {activeProviderConfig.helpText}
                </a>{' '}
                → {activeProviderConfig.steps}
              </p>
            </div>

            <div className="relative">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={activeKey}
                onChange={(e) => handleApiKeyChange(activeProvider, e.target.value)}
                placeholder={activeProviderConfig.placeholder}
                className="w-full bg-bg border border-border rounded px-4 py-3 font-mono text-sm text-text 
                           placeholder-muted/50 focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors cursor-pointer"
              >
                {showKey ? '🙈' : '👁'}
              </button>
            </div>
            <p className="text-muted text-xs mt-2 flex items-center gap-1">
              🔒 Stored only in your browser's localStorage. Transmitted securely to backend server for AI processing.
            </p>
          </div>

          {/* ═══ Step 3: Overleaf Session Cookie ═══ */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 flex items-center justify-center bg-amber/10 text-amber font-mono text-xs rounded font-bold">3</span>
              <h4 className="font-mono text-text font-medium text-sm">Overleaf Session Cookie</h4>
              {isSessionSet && <span className="text-success text-sm">✓ Set</span>}
            </div>

            <div className="bg-bg/50 border border-border rounded p-4 mb-3">
              <p className="text-muted text-xs leading-relaxed">
                <strong className="text-text">How to get it:</strong> Log into{' '}
                <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">
                  overleaf.com
                </a>{' '}
                → Press <kbd className="px-1 py-0.5 bg-border rounded text-text">F12</kbd> →
                Click <strong className="text-text">Application</strong> tab →
                Expand <strong className="text-text">Cookies</strong> →
                Click <strong className="text-text">https://www.overleaf.com</strong> →
                Find <strong className="text-text">overleaf_session2</strong> → Copy its Value
              </p>
              <button
                onClick={() => setShowCookieGuide(true)}
                className="mt-2 text-amber text-xs hover:underline cursor-pointer"
              >
                📖 See step-by-step guide
              </button>
            </div>

            <input
              id="overleaf-session-input"
              type="password"
              value={overleafSession}
              onChange={(e) => handleSaveKey('ats_overleaf_session', e.target.value, setOverleafSession)}
              placeholder="Paste overleaf_session2 cookie value here…"
              className="w-full bg-bg border border-border rounded px-4 py-3 font-mono text-sm text-text 
                         placeholder-muted/50 focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors"
            />
          </div>

          {/* Status summary */}
          <div className="border-t border-border pt-4 mt-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-muted">
                {isKeyValid && isSessionSet ? (
                  <span className="text-success">✅ All set! You're ready to generate ATS-optimized resumes with {activeProviderConfig.name}.</span>
                ) : (
                  <span className="text-amber">⚠ Complete the setup above to enable resume generation.</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted">Active:</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber/10 text-amber text-xs font-mono rounded border border-amber/20">
                  {activeProviderConfig.icon} {activeProviderConfig.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Guide Modal */}
      {showCookieGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowCookieGuide(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-surface border border-border rounded p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl text-text">How to Get Your Overleaf Cookie</h3>
              <button onClick={() => setShowCookieGuide(false)} className="text-muted hover:text-text text-xl cursor-pointer">×</button>
            </div>

            {/* Why Section */}
            <div className="bg-success/5 border border-success/20 rounded p-4 mb-6">
              <p className="text-success text-xs font-mono font-semibold mb-1">Why do you need this?</p>
              <p className="text-muted-light text-xs leading-relaxed">
                Overleaf is a free LaTeX editor. We use your free account to compile your resume into a beautiful PDF.
                The session cookie just lets us push your resume into your account — we never see your password.
                <br />
                <strong className="text-text">Cost: Free.</strong> No credit card needed for Overleaf either.
              </p>
            </div>

            <div className="space-y-5 text-sm text-muted-light">
              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-amber/10 text-amber font-mono font-bold rounded">1</span>
                <div>
                  <p className="text-text font-medium mb-1">Sign up (or log in) to Overleaf — it's free</p>
                  <p>Go to <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">overleaf.com</a> and create an account using just your email + password. <strong className="text-text">No credit card required.</strong></p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-amber/10 text-amber font-mono font-bold rounded">2</span>
                <div>
                  <p className="text-text font-medium mb-1">Open the developer panel</p>
                  <p>While on overleaf.com, press <kbd className="px-1.5 py-0.5 bg-border rounded text-text">F12</kbd> on your keyboard.
                  <br /><span className="text-muted text-xs">Mac users: <kbd className="px-1.5 py-0.5 bg-border rounded text-text">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-border rounded text-text">⌥</kbd> + <kbd className="px-1.5 py-0.5 bg-border rounded text-text">I</kbd></span>
                  <br />A panel will open at the side or bottom of your browser.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-amber/10 text-amber font-mono font-bold rounded">3</span>
                <div>
                  <p className="text-text font-medium mb-1">Click the &quot;Application&quot; tab</p>
                  <p>At the top of that new panel, click <strong className="text-text">Application</strong>.
                  <br /><span className="text-muted text-xs">Don&apos;t see it? Click the <kbd className="px-1 py-0.5 bg-border rounded text-text">&raquo;</kbd> arrow at the top to find it. On Firefox it&apos;s called <strong className="text-text">Storage</strong>.</span></p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-amber/10 text-amber font-mono font-bold rounded">4</span>
                <div>
                  <p className="text-text font-medium mb-1">Open the Cookies list</p>
                  <p>On the LEFT sidebar of that panel, find <strong className="text-text">Cookies</strong> and click the small <strong className="text-text">▶</strong> arrow next to it. Then click <strong className="text-text">https://www.overleaf.com</strong>.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-amber/10 text-amber font-mono font-bold rounded">5</span>
                <div>
                  <p className="text-text font-medium mb-1">Copy the <code className="px-1 py-0.5 bg-border rounded text-amber text-xs">overleaf_session2</code> value</p>
                  <p>A table appears in the middle. Look down the <strong className="text-text">Name</strong> column for <strong className="text-amber">overleaf_session2</strong>. Click that row.</p>
                  <p className="mt-1">Then look at the <strong className="text-text">Value</strong> column — double-click the long string and press <kbd className="px-1.5 py-0.5 bg-border rounded text-text">Ctrl+C</kbd> (Mac: <kbd className="px-1.5 py-0.5 bg-border rounded text-text">⌘+C</kbd>) to copy it.</p>
                  <p className="mt-1">Paste it back into the <strong className="text-text">Overleaf Session Cookie</strong> field above.</p>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="mt-6 bg-bg/50 border border-border rounded p-4">
              <p className="text-text text-xs font-mono font-semibold mb-2">Common issues</p>
              <ul className="text-muted text-xs leading-relaxed space-y-1.5">
                <li><strong className="text-text">&quot;I see <code className="px-1 bg-border rounded">overleaf.session</code> but no <code className="px-1 bg-border rounded">_session2</code>&quot;</strong> — use whichever cookie name starts with <code className="px-1 bg-border rounded">overleaf_session</code>.</li>
                <li><strong className="text-text">&quot;Session expired&quot; on generate</strong> — cookies last about 30 days. Repeat these 5 steps for a fresh value.</li>
                <li><strong className="text-text">&quot;Is this safe?&quot;</strong> — the cookie only authorizes us to create projects in your free Overleaf account. We can&apos;t access your password. Revoke any time by logging out of overleaf.com.</li>
                <li><strong className="text-text">&quot;The Value field looks short&quot;</strong> — you probably copied the wrong cookie. The real one is a long Base64 string ~100+ characters.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
