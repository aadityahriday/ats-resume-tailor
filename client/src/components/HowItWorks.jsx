export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Paste JD + Resume',
      desc: 'Drop in the full job description and your current resume. Our AI resume builder analyzes every keyword, requirement, and qualification from the job posting.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        </svg>
      ),
      gradient: 'from-amber/10 to-amber/5',
      borderColor: 'border-amber/20 hover:border-amber/40',
    },
    {
      num: '02',
      title: 'AI Rewrites & Optimizes',
      desc: 'Claude, ChatGPT, or Gemini deeply rewrites every bullet point with matched ATS keywords, quantified achievements, and strong action verbs for a 90+ ATS score.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      gradient: 'from-violet/10 to-violet/5',
      borderColor: 'border-violet/20 hover:border-violet/40',
    },
    {
      num: '03',
      title: 'Download ATS-Ready PDF',
      desc: 'Your optimized resume is compiled to professional LaTeX on Overleaf and delivered as a stunning, ATS-parseable PDF ready for any Applicant Tracking System.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <polyline points="9 15 12 18 15 15"/>
        </svg>
      ),
      gradient: 'from-success/10 to-success/5',
      borderColor: 'border-success/20 hover:border-success/40',
    }
  ]

  return (
    <section className="max-w-5xl mx-auto px-6 py-24" id="how-it-works">
      <div className="text-center mb-16">
        <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">How It Works</span>
        <h2 className="font-serif text-3xl md:text-4xl text-text">Three steps to an ATS-optimized resume</h2>
        <p className="text-muted-light text-sm mt-3 max-w-xl mx-auto">
          Our AI resume builder uses advanced NLP to match your resume against the job description, rewrite every section, and deliver a professional PDF — all in under 90 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-16 left-[18%] right-[18%] h-px">
          <div className="w-full h-full border-t border-dashed border-border-bright/60" />
        </div>

        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`relative flex flex-col items-center text-center group hover-lift`}
          >
            {/* Card */}
            <div className={`w-full rounded-2xl bg-gradient-to-b ${step.gradient} border ${step.borderColor} p-8 transition-all duration-300`}>
              {/* Step number */}
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-surface-raised border border-border-bright rounded-xl mb-5 relative z-10">
                {step.icon}
              </div>

              {/* Number badge */}
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface border border-border font-mono text-xs text-muted-light mb-4">
                {step.num}
              </span>

              {/* Title */}
              <h3 className="font-mono text-text font-semibold text-sm mb-3">{step.title}</h3>

              {/* Description */}
              <p className="text-muted-light text-sm leading-relaxed">{step.desc}</p>
            </div>

            {/* Arrow between steps (mobile) */}
            {i < steps.length - 1 && (
              <div className="md:hidden flex items-center justify-center py-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19 12 12 19 5 12"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ═══ SEO-Rich Content Sections ═══ */}
      
      {/* What is ATS */}
      <div className="mt-24 max-w-3xl mx-auto" id="what-is-ats">
        <h2 className="font-serif text-2xl md:text-3xl text-text text-center mb-6">What is an ATS Resume?</h2>
        <div className="bg-surface border border-border rounded-2xl p-8">
          <p className="text-muted-light text-sm leading-relaxed mb-4">
            An <strong className="text-text">ATS (Applicant Tracking System)</strong> is software used by <strong className="text-text">99% of Fortune 500 companies</strong> and most mid-size employers to automatically screen, filter, and rank job applications before a human recruiter ever reviews them. Systems like <strong className="text-text">Taleo, Workday, Greenhouse, Lever, and iCIMS</strong> scan your resume for keyword matches, proper formatting, and standard section headers.
          </p>
          <p className="text-muted-light text-sm leading-relaxed mb-4">
            If your resume doesn't pass the ATS, it gets automatically rejected — even if you're the most qualified candidate. Studies show that <strong className="text-text">75% of resumes are rejected by ATS before a human ever sees them</strong>.
          </p>
          <p className="text-muted-light text-sm leading-relaxed">
            An <strong className="text-text">ATS-optimized resume</strong> is specifically written with the right keywords, section headers, formatting, and structure to score high on these automated systems. ResumeCopy's AI does this automatically by analyzing the exact job description and rewriting your resume to match it perfectly.
          </p>
        </div>
      </div>

      {/* Why ResumeCopy */}
      <div className="mt-16 max-w-3xl mx-auto" id="why-resumecopy">
        <h2 className="font-serif text-2xl md:text-3xl text-text text-center mb-6">Why ResumeCopy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'AI-Powered Keyword Matching',
              desc: 'Our AI extracts every keyword, phrase, and requirement from the job description and intelligently weaves them into your resume bullets.',
              icon: '🎯'
            },
            {
              title: 'Deterministic ATS Scoring',
              desc: '100% algorithmic scoring engine — no AI randomness. Same inputs always produce the same score, so you know exactly where you stand.',
              icon: '📊'
            },
            {
              title: 'Professional LaTeX PDF',
              desc: 'Your resume is compiled to professional-grade LaTeX via Overleaf — the same typesetting used in academic papers and Fortune 500 companies.',
              icon: '📄'
            },
            {
              title: 'Multi-Model AI Support',
              desc: 'Start free with Gemini 2.5 Flash (no credit card), or upgrade to GPT-4o or Claude 3.7 Sonnet for premium quality.',
              icon: '🧠'
            },
            {
              title: 'Before & After Score Comparison',
              desc: 'See your ATS score before and after optimization with a detailed breakdown across 6 dimensions including keyword match and formatting.',
              icon: '📈'
            },
            {
              title: '100% Private & Secure',
              desc: 'No sign-up required. Your API keys stay in your browser. Your resume data is processed in-memory and never stored on any server.',
              icon: '🔒'
            }
          ].map(feature => (
            <div key={feature.title} className="bg-surface/50 border border-border rounded-xl p-6 hover:border-amber/30 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{feature.icon}</span>
                <div>
                  <h3 className="font-mono text-text text-sm font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-light text-xs leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Score Breakdown */}
      <div className="mt-16 max-w-3xl mx-auto" id="ats-scoring">
        <h2 className="font-serif text-2xl md:text-3xl text-text text-center mb-6">How the ATS Score Works</h2>
        <div className="bg-surface border border-border rounded-2xl p-8">
          <p className="text-muted-light text-sm leading-relaxed mb-6">
            ResumeCopy uses a <strong className="text-text">100% deterministic, algorithmic ATS scoring engine</strong>. No AI, no randomness — the same resume and job description always produce the same score. Here's how your resume is scored out of 100:
          </p>
          <div className="space-y-3">
            {[
              { dim: 'Keyword Match', pts: '40', how: 'JD keywords & multi-word phrases found in resume' },
              { dim: 'Section Headers', pts: '15', how: 'Presence of standard ATS sections (Summary, Experience, Education, Skills)' },
              { dim: 'Quantified Impact', pts: '15', how: 'Lines with numbers, metrics, and impact words (%, increased, reduced)' },
              { dim: 'Action Verbs', pts: '10', how: 'Match against 35+ strong action verbs (Led, Architected, Engineered, Optimized)' },
              { dim: 'Contact Data', pts: '10', how: 'Email, phone, LinkedIn, GitHub, location presence' },
              { dim: 'Formatting', pts: '10', how: 'Bullet count, word count, date format consistency' },
            ].map(item => (
              <div key={item.dim} className="flex items-center gap-4 py-2 border-b border-border/30 last:border-b-0">
                <span className="w-10 text-center font-mono text-amber text-sm font-bold">{item.pts}</span>
                <div className="flex-1">
                  <span className="font-mono text-text text-xs font-semibold">{item.dim}</span>
                  <span className="text-muted text-xs ml-2">— {item.how}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto" id="faq">
        <h2 className="font-serif text-2xl md:text-3xl text-text text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            {
              q: 'Is ResumeCopy really free?',
              a: 'Yes! ResumeCopy is completely free to use. You bring your own AI API key (Claude, ChatGPT, or Gemini all offer free tiers) and an Overleaf account for PDF compilation. We don\'t charge anything.'
            },
            {
              q: 'Do I need to create an account?',
              a: 'No sign-up or account is required. Your API keys are stored only in your browser\'s localStorage and are never sent to our servers.'
            },
            {
              q: 'What AI models are supported?',
              a: 'Three options: Gemini 2.5 Flash by Google (FREE, no credit card needed — recommended), GPT-4o by OpenAI (paid, popular), and Claude 3.7 Sonnet by Anthropic (paid, premium quality with extended thinking). You can switch between them at any time.'
            },
            {
              q: 'How long does it take to generate a resume?',
              a: 'The entire process — AI rewriting, ATS scoring, LaTeX conversion, and PDF compilation — takes approximately 60-90 seconds depending on resume length and AI model.'
            },
            {
              q: 'Is my data secure?',
              a: 'Absolutely. ResumeCopy processes everything in-memory. Your resume and job description are sent directly to your chosen AI provider and are never stored, logged, or shared by us.'
            },
            {
              q: 'What ATS systems does this work with?',
              a: 'Resumes optimized by ResumeCopy are designed to pass all major ATS platforms including Taleo, Workday, Greenhouse, Lever, iCIMS, BambooHR, JazzHR, and more.'
            },
            {
              q: 'Can I use this for any job or industry?',
              a: 'Yes! ResumeCopy works for any industry and any position — from software engineering and data science to marketing, finance, healthcare, and more. The AI adapts to whatever job description you provide.'
            },
          ].map(({q, a}, i) => (
            <details key={i} className="bg-surface border border-border rounded-xl group">
              <summary className="cursor-pointer px-6 py-4 font-mono text-text text-sm font-medium flex items-center justify-between list-none">
                {q}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted transition-transform group-open:rotate-180 shrink-0 ml-4">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-muted-light text-sm leading-relaxed">{a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

    </section>
  )
}
