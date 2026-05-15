import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'

export default function DisclaimerPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <PageHead
        title="Disclaimer — ResumeCopy"
        description="ResumeCopy disclaimer. AI-generated content may contain errors. ATS scores are estimates. No employment guarantee."
        canonical="https://resumecopy.com/disclaimer"
      />
      <main id="main-content" role="main" className="max-w-4xl mx-auto px-6 py-24 min-h-[60vh]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 font-mono text-xs text-muted">
            <li><Link to="/" className="hover:text-amber transition-colors">Home</Link></li>
            <li className="text-border-bright">/</li>
            <li className="text-text">Disclaimer</li>
          </ol>
        </nav>

        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-text">Disclaimer</h1>
        </div>

        <article className="bg-surface border border-border rounded-2xl p-8 space-y-5 text-muted-light text-sm leading-relaxed">
          <div>
            <h2 className="font-mono text-text font-medium mb-2">AI-Generated Content</h2>
            <p>ResumeCopy uses artificial intelligence to generate resume suggestions and optimizations. While we strive for accuracy, AI-generated content may contain errors, inaccuracies, or may not perfectly align with your specific situation. Always review and verify all content before submitting to employers.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">ATS Score Accuracy</h2>
            <p>The ATS scores provided by ResumeCopy are estimates based on keyword matching, formatting analysis, and common ATS criteria. Different ATS systems use different algorithms, and actual screening results may vary. A high score does not guarantee employment or interviews.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">No Employment Guarantee</h2>
            <p>ResumeCopy is a tool to assist with resume optimization. We do not guarantee job interviews, job offers, or employment outcomes. Your success depends on many factors beyond resume quality.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">Professional Advice</h2>
            <p>ResumeCopy does not provide professional career advice, legal advice, or HR consulting. For personalized career guidance, consider consulting with professional career coaches or HR professionals.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">Contact</h2>
            <p>If you have questions, please <Link to="/contact" className="text-amber hover:underline">contact us</Link>.</p>
          </div>
        </article>
      </main>
    </>
  )
}
