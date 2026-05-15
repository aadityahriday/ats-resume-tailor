import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <PageHead
        title="About — ResumeCopy | Free AI Resume Builder"
        description="Learn about ResumeCopy, the free open-source AI resume builder and ATS optimizer created by Aaditya Hriday. Our mission, features, and team."
        canonical="https://resumecopy.com/about"
      />
      <main id="main-content" role="main" className="max-w-4xl mx-auto px-6 py-24 min-h-[60vh]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 font-mono text-xs text-muted">
            <li><Link to="/" className="hover:text-amber transition-colors">Home</Link></li>
            <li className="text-border-bright">/</li>
            <li className="text-text">About</li>
          </ol>
        </nav>

        <div className="text-center mb-8">
          <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">About</span>
          <h1 className="font-serif text-3xl md:text-4xl text-text">About ResumeCopy</h1>
        </div>

        <article className="bg-surface border border-border rounded-2xl p-8 space-y-6 text-muted-light text-sm leading-relaxed">
          <p>
            <strong className="text-text">ResumeCopy</strong> is the #1 free AI-powered resume builder and ATS optimizer designed to help job seekers beat Applicant Tracking Systems and land more interviews.
            Trusted by <strong className="text-text">2,400+ job seekers worldwide</strong>, ResumeCopy uses cutting-edge AI from Claude, ChatGPT, and Gemini to rewrite your resume with job-specific keywords, quantified achievements, and strong action verbs — targeting a 90+ ATS score.
          </p>

          <div className="flex items-center gap-4 py-4 border-t border-b border-border/30">
            <img src="/author.jpg" alt="Aaditya Hriday — Creator of ResumeCopy" width="56" height="56" className="w-14 h-14 rounded-full object-cover border-2 border-amber/30 shrink-0" loading="lazy" />
            <div>
              <p className="text-text font-mono font-semibold text-sm">Aaditya Hriday</p>
              <p className="text-muted text-xs">Creator & Developer</p>
              <div className="flex items-center gap-3 mt-1">
                <a href="https://instagram.com/aadityahriday" target="_blank" rel="noopener noreferrer" className="text-amber text-xs hover:underline">@aadityahriday</a>
                <a href="https://github.com/aadityahriday" target="_blank" rel="noopener noreferrer" className="text-amber text-xs hover:underline">GitHub</a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">Our Mission</h2>
            <p>We believe every job seeker deserves access to professional resume optimization tools — for free. ResumeCopy leverages cutting-edge AI to rewrite your resume with job-specific keywords, quantified achievements, and strong action verbs — targeting a 90+ ATS score.</p>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Paste your current resume and the target job description</li>
              <li>AI analyzes the JD and rewrites your resume with matched keywords</li>
              <li>Download your ATS-optimized PDF resume in under 90 seconds</li>
            </ol>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">Open Source</h2>
            <p>ResumeCopy is open source and available on <a href="https://github.com/aadityahriday/ats-resume-tailor" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">GitHub</a>. Contributions are welcome!</p>
          </div>
        </article>
      </main>
    </>
  )
}
