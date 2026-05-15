import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'

export default function TermsPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <PageHead
        title="Terms of Service — ResumeCopy"
        description="ResumeCopy terms of service. Read the terms and conditions for using our free AI resume builder and ATS optimizer."
        canonical="https://resumecopy.com/terms-of-service"
      />
      <main id="main-content" role="main" className="max-w-4xl mx-auto px-6 py-24 min-h-[60vh]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 font-mono text-xs text-muted">
            <li><Link to="/" className="hover:text-amber transition-colors">Home</Link></li>
            <li className="text-border-bright">/</li>
            <li className="text-text">Terms of Service</li>
          </ol>
        </nav>

        <div className="text-center mb-8">
          <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">Legal</span>
          <h1 className="font-serif text-3xl md:text-4xl text-text">Terms of Service</h1>
        </div>

        <article className="bg-surface border border-border rounded-2xl p-8 space-y-5 text-muted-light text-sm leading-relaxed">
          <p className="text-muted text-xs font-mono">Last Updated: May 2026</p>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using ResumeCopy ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">2. Description of Service</h2>
            <p>ResumeCopy is a free, AI-powered resume optimization tool that helps users create ATS-friendly resumes. The Service uses third-party AI providers (Anthropic, OpenAI, Google) and Overleaf for PDF compilation.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">3. User Responsibilities</h2>
            <p>You are responsible for providing your own API keys and ensuring the accuracy of all information in your resumes. You agree not to use the Service for any unlawful purpose or to misrepresent your qualifications.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">4. Intellectual Property</h2>
            <p>You retain full ownership of your resume content. ResumeCopy does not claim any rights to content you create using the Service. The ResumeCopy brand, design, and source code are protected under applicable laws.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">5. Limitation of Liability</h2>
            <p>ResumeCopy is provided "as is" without warranties of any kind, express or implied. We are not liable for any damages arising from the use or inability to use the Service, including but not limited to lost employment opportunities.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">6. Third-Party Services</h2>
            <p>The Service relies on third-party providers. We are not responsible for their availability, accuracy, or performance. Service outages by third parties may affect ResumeCopy functionality.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">7. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the revised terms.</p>
          </div>
          <div>
            <h2 className="font-mono text-text font-medium mb-2">8. Contact</h2>
            <p>For questions about these terms, please <Link to="/contact" className="text-amber hover:underline">contact us</Link>.</p>
          </div>
        </article>
      </main>
    </>
  )
}
