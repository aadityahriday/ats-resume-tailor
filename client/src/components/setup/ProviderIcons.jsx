/**
 * Brand SVG marks for AI providers — replaces the 🟠 🟢 🔵 emoji.
 * All marks are simplified, not pixel-exact replicas, so no logo rights issues.
 */

export function AnthropicMark({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M14.5 4.5h3l5 15h-3l-1.1-3.4h-4.8L12.5 19.5h-3l5-15Zm.85 8.7h2.95l-1.47-4.55-1.48 4.55Z"
        fill="#FF9F43"
      />
      <path
        d="M5.5 4.5h2.7l4.6 15h-2.95l-.85-2.9H4.4l-.85 2.9H.6l4.9-15Zm.45 9.05h2.7L7.3 8.4l-1.35 5.15Z"
        fill="#FF9F43"
        opacity="0.85"
      />
    </svg>
  )
}

export function OpenAIMark({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 2.2 4 6.6v8.8L12 19.8l8-4.4V6.6L12 2.2Zm0 2.2 5.5 3v6L12 16.6l-5.5-3v-6L12 4.4Z"
        stroke="#10B981"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.4" stroke="#10B981" strokeWidth="1.6" />
    </svg>
  )
}

export function GeminiMark({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c.4 4.4 3.6 7.6 8 8-4.4.4-7.6 3.6-8 8-.4-4.4-3.6-7.6-8-8 4.4-.4 7.6-3.6 8-8Z"
        fill="url(#gemini-grad)"
      />
    </svg>
  )
}

export function OverleafMark({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2a7 7 0 0 1 6.93 6.05c-2.74-.3-5.06-1.16-6.93-2.55C10.13 9.89 7.81 10.75 5.07 11.05A7 7 0 0 1 12 5Zm-6.93 8.95c2.74.3 5.06 1.16 6.93 2.55 1.87-1.39 4.19-2.25 6.93-2.55A7 7 0 0 1 12 19a7 7 0 0 1-6.93-5.05Z"
        fill="#10B981"
      />
    </svg>
  )
}

export const BRAND_ICONS = {
  anthropic: AnthropicMark,
  openai: OpenAIMark,
  gemini: GeminiMark,
  overleaf: OverleafMark,
}
