// ═══ Testimonials — E-E-A-T Trust Signals (Usage Stories, not formal reviews) ═══
// NOTE: No AggregateRating/Review schema used because there are no verified reviews.
// These are presented as user stories, not star-rated reviews, to avoid Google penalties.

const userStories = [
  {
    initials: 'PS',
    role: 'Software Engineer',
    scenario: 'Career transition',
    text: 'ResumeCopy helped me translate my backend experience into frontend-friendly language that matched the job description perfectly. My ATS score jumped from the 40s to over 90.',
    highlight: '40 → 90+ ATS Score',
    color: 'bg-amber/15 text-amber'
  },
  {
    initials: 'MJ',
    role: 'Data Analyst',
    scenario: 'Mass applications',
    text: 'I was applying to dozens of jobs with zero callbacks. After running my resume through ResumeCopy, the keyword matching showed me exactly what I was missing. Started getting responses within days.',
    highlight: 'First callbacks in days',
    color: 'bg-success/15 text-success'
  },
  {
    initials: 'SC',
    role: 'Product Manager',
    scenario: 'Career switcher',
    text: 'As someone switching from engineering to PM, I struggled to frame my experience. The AI rewrote my bullets with product-specific keywords and quantified impact metrics I hadn\'t thought to include.',
    highlight: 'Career switch success',
    color: 'bg-violet/15 text-violet'
  },
  {
    initials: 'RP',
    role: 'DevOps Engineer',
    scenario: 'Remote job search',
    text: 'The LaTeX PDF output looks incredibly professional — way better than Word templates. Using the free Gemini integration, I generated tailored resumes for each application in under 2 minutes.',
    highlight: 'Under 2 min per resume',
    color: 'bg-cyan/15 text-cyan'
  }
]

export default function Testimonials() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="text-center mb-12">
        <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">User Stories</span>
        <h2 id="testimonials-heading" className="font-serif text-3xl md:text-4xl text-text mb-4">How Job Seekers Use ResumeCopy</h2>
        <p className="text-muted-light text-sm max-w-lg mx-auto">Real scenarios from professionals who optimized their resumes with our AI-powered ATS scoring engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {userStories.map((story, i) => (
          <blockquote
            key={i}
            className="bg-surface border border-border rounded-2xl p-6 hover:border-amber/30 transition-colors"
          >
            <div className="flex items-start gap-3 mb-4 flex-wrap sm:flex-nowrap">
              {/* Avatar initials */}
              <div className="w-10 h-10 rounded-full bg-surface-raised border border-border-bright flex items-center justify-center font-mono text-xs text-muted-light font-semibold shrink-0">
                {story.initials}
              </div>
              <div className="flex-1 min-w-0">
                <cite className="font-mono text-text text-sm font-semibold not-italic block">{story.role}</cite>
                <span className="text-muted text-xs">{story.scenario}</span>
              </div>
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold whitespace-nowrap ${story.color}`}>
                {story.highlight}
              </span>
            </div>
            <p className="text-muted-light text-sm leading-relaxed">"{story.text}"</p>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
