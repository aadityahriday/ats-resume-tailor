export function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-text">About ResumeCopy</h2>
          <button onClick={onClose} className="text-muted hover:text-text text-2xl">×</button>
        </div>
        
        <div className="space-y-6 text-muted">
          <p className="text-text">
            <strong>ResumeCopy</strong> is the #1 free AI-powered resume builder and ATS optimizer designed to help job seekers beat Applicant Tracking Systems and land more interviews.
          </p>
          
          <div>
            <h3 className="font-mono text-text font-medium mb-2">Our Mission</h3>
            <p>
              We believe every job seeker deserves access to professional resume optimization tools. ResumeCopy leverages cutting-edge AI from Claude, ChatGPT, and Gemini to rewrite your resume with job-specific keywords, quantified achievements, and strong action verbs—targeting a 90+ ATS score.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Paste your current resume and the target job description</li>
              <li>AI analyzes the JD and rewrites your resume with matched keywords</li>
              <li>Download your ATS-optimized PDF resume in under 90 seconds</li>
            </ol>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Privacy & Security</h3>
            <p>
              Your data is processed in-memory and never stored on our servers. API keys are stored only in your browser's localStorage. Resume and job descriptions are sent directly to your chosen AI provider for processing.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Open Source</h3>
            <p>
              ResumeCopy is open source and available on <a href="https://github.com/aadityahriday/ats-resume-tailor" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">GitHub</a>. Contributions are welcome!
            </p>
          </div>

          <div className="pt-4 border-t border-border/40">
            <h3 className="font-mono text-text font-medium mb-3">Built By</h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber to-amber/60 flex items-center justify-center text-bg font-serif font-bold text-lg">
                A
              </div>
              <div>
                <p className="text-text font-medium">Aaditya Hriday</p>
                <div className="flex items-center gap-3 mt-1">
                  <a href="https://github.com/aadityahriday" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-amber transition-colors flex items-center gap-1 text-xs">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    aadityahriday
                  </a>
                  <a href="https://instagram.com/aadityahriday" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-amber transition-colors flex items-center gap-1 text-xs">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    @aadityahriday
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-text">Privacy Policy</h2>
          <button onClick={onClose} className="text-muted hover:text-text text-2xl">×</button>
        </div>
        
        <div className="space-y-6 text-muted text-sm">
          <p className="text-text font-medium">Last Updated: January 2026</p>
          
          <div>
            <h3 className="font-mono text-text font-medium mb-2">Data Collection</h3>
            <p>
              ResumeCopy does not collect, store, or transmit any personal data to our servers. All processing happens in your browser's memory. We do not have access to your resume, job descriptions, or any other content you input.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">API Keys</h3>
            <p>
              Your AI API keys (Anthropic, OpenAI, Gemini) and Overleaf session cookie are stored exclusively in your browser's localStorage. They are never transmitted to ResumeCopy servers. These keys are sent directly to their respective services (Anthropic, OpenAI, Google, Overleaf) for processing.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Third-Party Services</h3>
            <p>
              ResumeCopy integrates with third-party AI providers (Anthropic, OpenAI, Google) and Overleaf for PDF compilation. Your use of these services is subject to their respective privacy policies:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Anthropic Privacy Policy</a></li>
              <li><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">OpenAI Privacy Policy</a></li>
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Google Privacy Policy</a></li>
              <li><a href="https://www.overleaf.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">Overleaf Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Cookies</h3>
            <p>
              ResumeCopy does not use tracking cookies. The only cookies used are those set by third-party services you interact with directly.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Data Retention</h3>
            <p>
              Since ResumeCopy does not store any data on our servers, there is no data retention period. All data is cleared from browser memory when you close the tab or refresh the page.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Children's Privacy</h3>
            <p>
              ResumeCopy is not intended for use by children under 13. We do not knowingly collect information from children.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Changes to This Policy</h3>
            <p>
              We may update this privacy policy from time to time. We will notify users of any material changes by updating the date at the top of this policy.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Contact</h3>
            <p>
              If you have questions about this privacy policy, please contact us through our GitHub repository.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-text">Disclaimer</h2>
          <button onClick={onClose} className="text-muted hover:text-text text-2xl">×</button>
        </div>
        
        <div className="space-y-6 text-muted text-sm">
          <div>
            <h3 className="font-mono text-text font-medium mb-2">AI-Generated Content</h3>
            <p>
              ResumeCopy uses artificial intelligence to generate resume suggestions and optimizations. While we strive for accuracy, AI-generated content may contain errors, inaccuracies, or may not perfectly align with your specific situation. Always review and verify all content before submitting to employers.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">ATS Score Accuracy</h3>
            <p>
              The ATS scores provided by ResumeCopy are estimates based on keyword matching, formatting analysis, and common ATS criteria. Different ATS systems use different algorithms, and actual screening results may vary. A high score does not guarantee employment or interviews.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">No Employment Guarantee</h3>
            <p>
              ResumeCopy is a tool to assist with resume optimization. We do not guarantee job interviews, job offers, or employment outcomes. Your success depends on many factors beyond resume quality, including experience, skills, interview performance, and market conditions.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Third-Party Services</h3>
            <p>
              ResumeCopy relies on third-party services (AI providers, Overleaf) for core functionality. We are not responsible for the availability, accuracy, or performance of these services. Service outages or changes by third parties may affect ResumeCopy functionality.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">User Responsibility</h3>
            <p>
              Users are responsible for ensuring the accuracy of all information in their resumes. Misrepresentation or falsification of information may have serious consequences with potential employers. ResumeCopy is not liable for any consequences resulting from inaccurate or misleading resume content.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Limitation of Liability</h3>
            <p>
              ResumeCopy is provided "as is" without warranties of any kind, express or implied. In no event shall we be liable for any damages arising from the use or inability to use ResumeCopy, including but not limited to lost employment opportunities or financial losses.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-text font-medium mb-2">Professional Advice</h3>
            <p>
              ResumeCopy does not provide professional career advice, legal advice, or HR consulting. For personalized career guidance, consider consulting with professional career coaches or HR professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
