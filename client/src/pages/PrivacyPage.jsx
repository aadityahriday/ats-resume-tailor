import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'

export default function PrivacyPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <PageHead
        title="Privacy Policy — ResumeCopy"
        description="ResumeCopy privacy policy. We don't collect or store your personal data. All processing happens in your browser's memory."
        canonical="https://resumecopy.com/privacy-policy"
      />
      <main id="main-content" role="main" className="max-w-4xl mx-auto px-6 py-24 min-h-[60vh]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 font-mono text-xs text-muted">
            <li><Link to="/" className="hover:text-amber transition-colors">Home</Link></li>
            <li className="text-border-bright">/</li>
            <li className="text-text">Privacy Policy</li>
          </ol>
        </nav>

        <div className="text-center mb-8">
          <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">Legal</span>
          <h1 className="font-serif text-3xl md:text-4xl text-text">Privacy Policy</h1>
        </div>

        <article className="bg-surface border border-border rounded-2xl p-8 space-y-5 text-muted-light text-sm leading-relaxed">
          <p className="text-muted text-xs font-mono">Last Updated: May 2026</p>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">1. Data Collection</h2>
            <p>ResumeCopy does not collect, store, or transmit any personal data to our servers. All processing happens in your browser's memory. We do not have access to your resume, job descriptions, or any other content you input.</p>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">2. API Keys</h2>
            <p>Your AI API keys (Anthropic, OpenAI, Gemini) and Overleaf session cookie are stored exclusively in your browser's localStorage. They are never transmitted to ResumeCopy servers. These keys are sent directly to their respective services for processing.</p>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">3. Third-Party Services</h2>
            <p>ResumeCopy integrates with third-party AI providers and Overleaf for PDF compilation. Your use of these services is subject to their respective privacy policies:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Anthropic Privacy Policy</a></li>
              <li><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">OpenAI Privacy Policy</a></li>
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Google Privacy Policy</a></li>
              <li><a href="https://www.overleaf.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Overleaf Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">4. Analytics</h2>
            <p>We use Google Analytics to collect anonymous usage statistics (page views, session duration, device type). This data is used solely to improve the service. No personally identifiable information is collected through analytics. You can decline analytics cookies via our cookie consent banner.</p>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">5. Cookies</h2>
            <p>ResumeCopy does not use first-party tracking cookies. Google Analytics may set cookies as described in Google's privacy policy. We ask for your consent before enabling analytics cookies. The only local storage used is for your API keys and preferences.</p>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">6. Data Retention</h2>
            <p>Since ResumeCopy does not store any data on our servers, there is no data retention period. All data is cleared from browser memory when you close the tab.</p>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">7. Children's Privacy</h2>
            <p>ResumeCopy is not intended for use by children under 13. We do not knowingly collect information from children.</p>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Changes will be reflected in the "Last Updated" date above.</p>
          </div>

          <div>
            <h2 className="font-mono text-text font-medium mb-2">9. Contact</h2>
            <p>If you have questions about this privacy policy, please <Link to="/contact" className="text-amber hover:underline">contact us</Link>.</p>
          </div>
        </article>
      </main>
    </>
  )
}
