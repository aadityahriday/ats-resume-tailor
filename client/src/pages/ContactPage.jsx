import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <PageHead
        title="Contact — ResumeCopy"
        description="Get in touch with ResumeCopy. Reach out via Instagram, GitHub, or email for questions, feedback, or support."
        canonical="https://resumecopy.com/contact"
      />
      <main id="main-content" role="main" className="max-w-4xl mx-auto px-6 py-24 min-h-[60vh]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 font-mono text-xs text-muted">
            <li><Link to="/" className="hover:text-amber transition-colors">Home</Link></li>
            <li className="text-border-bright">/</li>
            <li className="text-text">Contact</li>
          </ol>
        </nav>

        <div className="text-center mb-8">
          <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">Contact</span>
          <h1 className="font-serif text-3xl md:text-4xl text-text">Contact Us</h1>
        </div>

        <article className="bg-surface border border-border rounded-2xl p-8 space-y-6 text-muted-light text-sm leading-relaxed">
          <p>Have questions, feedback, or need support? We'd love to hear from you.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="https://instagram.com/aadityahriday" target="_blank" rel="noopener noreferrer"
               className="flex flex-col items-center gap-2 p-6 bg-surface-raised border border-border rounded-xl hover:border-amber/40 transition-colors group">
              <span className="text-2xl">📸</span>
              <span className="font-mono text-text text-sm font-semibold group-hover:text-amber transition-colors">Instagram</span>
              <span className="text-muted text-xs">@aadityahriday</span>
            </a>
            <a href="https://github.com/aadityahriday/ats-resume-tailor/issues" target="_blank" rel="noopener noreferrer"
               className="flex flex-col items-center gap-2 p-6 bg-surface-raised border border-border rounded-xl hover:border-amber/40 transition-colors group">
              <span className="text-2xl">🐛</span>
              <span className="font-mono text-text text-sm font-semibold group-hover:text-amber transition-colors">Bug Reports</span>
              <span className="text-muted text-xs">GitHub Issues</span>
            </a>
            <a href="mailto:support@resumecopy.com"
               className="flex flex-col items-center gap-2 p-6 bg-surface-raised border border-border rounded-xl hover:border-amber/40 transition-colors group">
              <span className="text-2xl">✉️</span>
              <span className="font-mono text-text text-sm font-semibold group-hover:text-amber transition-colors">Email</span>
              <span className="text-muted text-xs">support@resumecopy.com</span>
            </a>
          </div>

          <div className="border-t border-border/30 pt-5">
            <h2 className="font-mono text-text font-medium mb-2">Response Time</h2>
            <p>We typically respond within 24-48 hours. For bug reports, please include steps to reproduce the issue, your browser version, and any error messages.</p>
          </div>
        </article>
      </main>
    </>
  )
}
