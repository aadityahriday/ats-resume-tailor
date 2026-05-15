/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        border: 'var(--color-border)',
        'border-bright': 'var(--color-border-bright)',
        amber: 'var(--color-amber)',
        'amber-hover': 'var(--color-amber-hover)',
        'amber-glow': 'var(--color-amber-glow)',
        success: 'var(--color-success)',
        'success-glow': 'var(--color-success-glow)',
        error: 'var(--color-error)',
        violet: 'var(--color-violet)',
        cyan: 'var(--color-cyan)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        muted: 'var(--color-muted)',
        'muted-light': 'var(--color-muted-light)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
