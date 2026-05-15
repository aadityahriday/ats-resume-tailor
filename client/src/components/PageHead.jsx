import { useEffect } from 'react'

const DEFAULT_TITLE = 'ResumeCopy — Free AI Resume Builder & ATS Resume Optimizer | Score 90+ on ATS'
const DEFAULT_DESC = 'ResumeCopy is the #1 free AI resume builder and ATS resume optimizer. Paste your resume + job description and get an ATS-optimized, keyword-matched PDF resume in under 90 seconds.'

export default function PageHead({ title, description, canonical }) {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE

    const update = (selector, attr, value) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }

    if (description) update('meta[name="description"]', 'content', description)
    if (canonical) {
      update('link[rel="canonical"]', 'href', canonical)
      update('meta[property="og:url"]', 'content', canonical)
    }
    update('meta[property="og:title"]', 'content', title || DEFAULT_TITLE)
    if (description) update('meta[property="og:description"]', 'content', description)

    return () => {
      document.title = DEFAULT_TITLE
      update('meta[name="description"]', 'content', DEFAULT_DESC)
      update('link[rel="canonical"]', 'href', 'https://resumecopy.com/')
      update('meta[property="og:url"]', 'content', 'https://resumecopy.com/')
      update('meta[property="og:title"]', 'content', DEFAULT_TITLE)
      update('meta[property="og:description"]', 'content', DEFAULT_DESC)
    }
  }, [title, description, canonical])

  return null
}
