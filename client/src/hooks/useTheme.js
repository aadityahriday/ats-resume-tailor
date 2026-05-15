import { useState, useEffect } from 'react'

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('ats_theme')
    if (savedTheme) return savedTheme

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }

    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'light') {
      root.classList.add('light-theme')
      root.classList.remove('dark-theme')
    } else {
      root.classList.add('dark-theme')
      root.classList.remove('light-theme')
    }

    localStorage.setItem('ats_theme', theme)
  }, [theme])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const handleChange = (e) => {
      // Only change if user hasn't manually set a preference
      if (!localStorage.getItem('ats_theme')) {
        setTheme(e.matches ? 'light' : 'dark')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
