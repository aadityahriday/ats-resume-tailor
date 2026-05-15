import { useState } from 'react'

const templates = [
  {
    id: 1,
    name: 'Modern Professional',
    description: 'Clean, ATS-friendly layout with modern typography. Perfect for tech and business roles.',
    category: 'Professional',
    features: ['ATS-optimized', 'Clean layout', 'Modern typography', 'Keyword-focused'],
    preview: '📄',
    color: '#8B5CF6'
  },
  {
    id: 2,
    name: 'Executive Classic',
    description: 'Traditional format with elegant styling. Ideal for senior leadership and C-suite positions.',
    category: 'Executive',
    features: ['Executive-level', 'Classic design', 'Leadership-focused', 'Achievement-driven'],
    preview: '📋',
    color: '#10B981'
  },
  {
    id: 3,
    name: 'Tech Startup',
    description: 'Bold, innovative design for tech companies and startups. Stands out while remaining ATS-compliant.',
    category: 'Tech',
    features: ['Innovative design', 'Tech-focused', 'Skills-highlighted', 'Project-centric'],
    preview: '💻',
    color: '#06B6D4'
  },
  {
    id: 4,
    name: 'Creative Minimal',
    description: 'Minimalist approach with subtle creative elements. Great for design, marketing, and creative roles.',
    category: 'Creative',
    features: ['Minimalist', 'Creative touches', 'Portfolio-ready', 'Visual-focused'],
    preview: '🎨',
    color: '#F43F5E'
  },
  {
    id: 5,
    name: 'Data Science',
    description: 'Optimized for data science and analytics roles. Emphasizes technical skills and projects.',
    category: 'Technical',
    features: ['Data-focused', 'Technical skills', 'Project showcase', 'Quantifiable results'],
    preview: '📊',
    color: '#FF9F43'
  },
  {
    id: 6,
    name: 'Entry Level',
    description: 'Perfect for recent graduates and entry-level positions. Highlights education and potential.',
    category: 'Entry Level',
    features: ['Education-focused', 'Growth-oriented', 'Skill-building', 'Internship-ready'],
    preview: '🎓',
    color: '#636B7E'
  }
]

export default function TemplateGallery() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...new Set(templates.map(t => t.category))]
  const filteredTemplates = filter === 'All' 
    ? templates 
    : templates.filter(t => t.category === filter)

  return (
    <section className="max-w-6xl mx-auto px-6 py-16" id="template-gallery">
      <div className="text-center mb-12">
        <span className="inline-block font-mono text-amber text-xs uppercase tracking-[0.2em] mb-3">
          Templates
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-text mb-4">
          Professional Resume Templates
        </h2>
        <p className="text-muted-light text-lg max-w-2xl mx-auto">
          Choose from our ATS-optimized templates designed to pass Applicant Tracking Systems and impress recruiters.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer ${
              filter === category
                ? 'bg-amber text-bg'
                : 'bg-surface border border-border text-muted hover:border-amber/50 hover:text-text'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="group relative bg-surface border border-border rounded-2xl p-6 cursor-pointer
                       hover:border-amber/50 hover:shadow-lg hover:shadow-amber/10 transition-all duration-300
                       hover:-translate-y-1"
          >
            {/* Template Preview */}
            <div 
              className="w-full h-48 rounded-xl flex items-center justify-center text-6xl mb-4
                         bg-gradient-to-br from-surface-raised to-surface border border-border/50
                         group-hover:from-amber/5 group-hover:to-transparent transition-all"
              style={{ borderColor: `${template.color}20` }}
            >
              {template.preview}
            </div>

            {/* Template Info */}
            <h3 className="font-serif text-xl text-text mb-2 group-hover:text-amber transition-colors">
              {template.name}
            </h3>
            <p className="text-muted text-sm mb-4 line-clamp-2">
              {template.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {template.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-1 rounded-md bg-surface-raised border border-border/50
                             text-[10px] font-mono text-muted-light"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-surface-raised border border-border/50">
              <span className="text-[10px] font-mono text-muted-light">{template.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SEO Content */}
      <div className="mt-16 bg-surface border border-border rounded-2xl p-8">
        <h3 className="font-serif text-2xl text-text mb-4">
          Why Our Templates Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-mono text-amber text-sm mb-2">ATS-Optimized</h4>
            <p className="text-muted text-sm">
              All templates are designed to pass Applicant Tracking Systems with proper formatting, keyword placement, and structure.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-amber text-sm mb-2">Professional Design</h4>
            <p className="text-muted text-sm">
              Clean, modern layouts that impress recruiters while maintaining readability and professional appearance.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-amber text-sm mb-2">Industry-Specific</h4>
            <p className="text-muted text-sm">
              Tailored templates for different industries and career levels, from entry-level to executive positions.
            </p>
          </div>
        </div>
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedTemplate(null)}
        >
          <div 
            className="bg-surface border border-border rounded-2xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl text-text">{selectedTemplate.name}</h3>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="text-muted hover:text-text text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="w-full h-64 rounded-xl flex items-center justify-center text-8xl mb-6
                       bg-gradient-to-br from-surface-raised to-surface border border-border/50">
              {selectedTemplate.preview}
            </div>

            <p className="text-muted-light mb-6">{selectedTemplate.description}</p>

            <div className="mb-6">
              <h4 className="font-mono text-amber text-sm mb-3">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1.5 rounded-lg bg-surface-raised border border-border/50
                               text-sm font-mono text-muted-light"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedTemplate(null)
                  document.getElementById('generator-form')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex-1 px-6 py-3 bg-amber text-bg font-mono font-semibold rounded-lg
                           hover:bg-amber-hover transition-colors cursor-pointer"
              >
                Use This Template
              </button>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-6 py-3 border border-border text-muted font-mono rounded-lg
                           hover:border-amber/50 hover:text-text transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
