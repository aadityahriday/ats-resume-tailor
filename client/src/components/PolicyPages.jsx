// ═══ SEO Policy Pages — Required for AdSense/Ezoic Approval ═══
// These render as permanent, crawlable sections (not modals) for maximum SEO value

export default function PolicyPages() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

      {/* ═══ About Us ═══ */}
      <section id="about" aria-labelledby="about-heading">
        <div className="text-center mb-8">
          <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">About</span>
          <h2 id="about-heading" className="font-serif text-2xl md:text-3xl text-text">About ResumeCopy</h2>
        </div>
        <article className="bg-surface border border-border rounded-2xl p-8 space-y-4 text-muted-light text-sm leading-relaxed">
          <p>
            <strong className="text-text">ResumeCopy</strong> is the #1 free AI-powered resume builder and ATS optimizer designed to help job seekers beat Applicant Tracking Systems and land more interviews.
            Trusted by <strong className="text-text">2,400+ job seekers worldwide</strong>, ResumeCopy uses cutting-edge AI from Claude, ChatGPT, and Gemini to rewrite your resume with job-specific keywords, quantified achievements, and strong action verbs — targeting a 90+ ATS score.
          </p>
          <div className="flex items-center gap-4 py-4 border-t border-b border-border/30">
            <img src="/author.png" alt="Aaditya Hriday — Creator of ResumeCopy" width="56" height="56" className="w-14 h-14 rounded-full object-cover border-2 border-amber/30" loading="lazy" />
            <div>
              <p className="text-text font-mono font-semibold text-sm">Aaditya Hriday</p>
              <p className="text-muted text-xs">Creator & Developer</p>
              <div className="flex items-center gap-3 mt-1">
                <a href="https://instagram.com/aadityahriday" target="_blank" rel="noopener noreferrer" className="text-amber text-xs hover:underline">@aadityahriday</a>
                <a href="https://github.com/aadityahriday" target="_blank" rel="noopener noreferrer" className="text-amber text-xs hover:underline">GitHub</a>
              </div>
            </div>
          </div>
          <h3 className="font-mono text-text font-medium">Our Mission</h3>
          <p>We believe every job seeker deserves access to professional resume optimization tools. ResumeCopy leverages cutting-edge AI to rewrite your resume with job-specific keywords, quantified achievements, and strong action verbs — targeting a 90+ ATS score.</p>
          <h3 className="font-mono text-text font-medium">Open Source</h3>
          <p>ResumeCopy is open source and available on <a href="https://github.com/aadityahriday/ats-resume-tailor" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">GitHub</a>. Contributions are welcome!</p>
        </article>
      </section>

      {/* ═══ Contact ═══ */}
      <section id="contact" aria-labelledby="contact-heading">
        <div className="text-center mb-8">
          <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">Contact</span>
          <h2 id="contact-heading" className="font-serif text-2xl md:text-3xl text-text">Contact Us</h2>
        </div>
        <article className="bg-surface border border-border rounded-2xl p-8 space-y-4 text-muted-light text-sm leading-relaxed">
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
        </article>
      </section>

      {/* ═══ Privacy Policy ═══ */}
      <section id="privacy-policy" aria-labelledby="privacy-heading">
        <div className="text-center mb-8">
          <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">Legal</span>
          <h2 id="privacy-heading" className="font-serif text-2xl md:text-3xl text-text">Privacy Policy</h2>
        </div>
        <article className="bg-surface border border-border rounded-2xl p-8 space-y-5 text-muted-light text-sm leading-relaxed">
          <p className="text-muted text-xs font-mono">Last Updated: May 2026</p>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">1. Data Collection</h3>
            <p>ResumeCopy does not collect, store, or transmit any personal data to our servers. All processing happens in your browser's memory. We do not have access to your resume, job descriptions, or any other content you input.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">2. API Keys</h3>
            <p>Your AI API keys (Anthropic, OpenAI, Gemini) and Overleaf session cookie are stored exclusively in your browser's localStorage. They are never transmitted to ResumeCopy servers. These keys are sent directly to their respective services for processing.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">3. Third-Party Services</h3>
            <p>ResumeCopy integrates with third-party AI providers and Overleaf for PDF compilation. Your use of these services is subject to their respective privacy policies:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Anthropic Privacy Policy</a></li>
              <li><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">OpenAI Privacy Policy</a></li>
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Google Privacy Policy</a></li>
              <li><a href="https://www.overleaf.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Overleaf Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">4. Analytics</h3>
            <p>We use Google Analytics to collect anonymous usage statistics (page views, session duration, device type). This data is used solely to improve the service. No personally identifiable information is collected through analytics.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">5. Cookies</h3>
            <p>ResumeCopy does not use first-party tracking cookies. Google Analytics may set cookies as described in Google's privacy policy. The only local storage used is for your API keys and preferences.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">6. Data Retention</h3>
            <p>Since ResumeCopy does not store any data on our servers, there is no data retention period. All data is cleared from browser memory when you close the tab.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">7. Children's Privacy</h3>
            <p>ResumeCopy is not intended for use by children under 13. We do not knowingly collect information from children.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">8. Changes to This Policy</h3>
            <p>We may update this privacy policy from time to time. Changes will be reflected in the "Last Updated" date above.</p>
          </div>
        </article>
      </section>

      {/* ═══ Terms of Service ═══ */}
      <section id="terms-of-service" aria-labelledby="terms-heading">
        <div className="text-center mb-8">
          <h2 id="terms-heading" className="font-serif text-2xl md:text-3xl text-text">Terms of Service</h2>
        </div>
        <article className="bg-surface border border-border rounded-2xl p-8 space-y-5 text-muted-light text-sm leading-relaxed">
          <p className="text-muted text-xs font-mono">Last Updated: May 2026</p>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">1. Acceptance of Terms</h3>
            <p>By accessing and using ResumeCopy ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">2. Description of Service</h3>
            <p>ResumeCopy is a free, AI-powered resume optimization tool that helps users create ATS-friendly resumes. The Service uses third-party AI providers (Anthropic, OpenAI, Google) and Overleaf for PDF compilation.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">3. User Responsibilities</h3>
            <p>You are responsible for providing your own API keys and ensuring the accuracy of all information in your resumes. You agree not to use the Service for any unlawful purpose or to misrepresent your qualifications.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">4. Intellectual Property</h3>
            <p>You retain full ownership of your resume content. ResumeCopy does not claim any rights to content you create using the Service. The ResumeCopy brand, design, and source code are protected under applicable laws.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">5. Limitation of Liability</h3>
            <p>ResumeCopy is provided "as is" without warranties of any kind, express or implied. We are not liable for any damages arising from the use or inability to use the Service, including but not limited to lost employment opportunities.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">6. Third-Party Services</h3>
            <p>The Service relies on third-party providers. We are not responsible for their availability, accuracy, or performance. Service outages by third parties may affect ResumeCopy functionality.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">7. Modifications</h3>
            <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the revised terms.</p>
          </div>
        </article>
      </section>

      {/* ═══ Disclaimer ═══ */}
      <section id="disclaimer" aria-labelledby="disclaimer-heading">
        <div className="text-center mb-8">
          <h2 id="disclaimer-heading" className="font-serif text-2xl md:text-3xl text-text">Disclaimer</h2>
        </div>
        <article className="bg-surface border border-border rounded-2xl p-8 space-y-5 text-muted-light text-sm leading-relaxed">
          <div>
            <h3 className="font-mono text-text font-medium mb-2">AI-Generated Content</h3>
            <p>ResumeCopy uses artificial intelligence to generate resume suggestions and optimizations. While we strive for accuracy, AI-generated content may contain errors, inaccuracies, or may not perfectly align with your specific situation. Always review and verify all content before submitting to employers.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">ATS Score Accuracy</h3>
            <p>The ATS scores provided by ResumeCopy are estimates based on keyword matching, formatting analysis, and common ATS criteria. Different ATS systems use different algorithms, and actual screening results may vary. A high score does not guarantee employment or interviews.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">No Employment Guarantee</h3>
            <p>ResumeCopy is a tool to assist with resume optimization. We do not guarantee job interviews, job offers, or employment outcomes. Your success depends on many factors beyond resume quality.</p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Professional Advice</h3>
            <p>ResumeCopy does not provide professional career advice, legal advice, or HR consulting. For personalized career guidance, consider consulting with professional career coaches or HR professionals.</p>
          </div>
        </article>
      </section>
    </div>
  )
}
