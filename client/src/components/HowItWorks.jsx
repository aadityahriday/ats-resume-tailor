export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Paste JD + Resume',
      desc: 'Drop in the full job description and your current resume. The more detail, the better the optimization.',
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
      title: 'AI Rewrites & Scores',
      desc: 'Your chosen AI model deeply analyzes the JD, rewrites every bullet with matched keywords and quantified impact.',
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
      title: 'Download PDF',
      desc: 'Your optimized resume is compiled to professional LaTeX on Overleaf and delivered as a stunning, ATS-ready PDF.',
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
        <h2 className="font-serif text-3xl md:text-4xl text-text">Three steps to a perfect resume</h2>
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
    </section>
  )
}
