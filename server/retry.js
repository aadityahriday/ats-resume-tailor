/**
 * Retry helper with exponential backoff + full jitter.
 *
 * Used by AI providers and Overleaf calls to absorb transient 429 / 5xx errors.
 * Avoids p-retry as a hard dependency — small enough to inline.
 */

const DEFAULT_OPTS = {
  retries: 2,                  // 1 initial + 2 retries = 3 total attempts
  minDelayMs: 600,
  maxDelayMs: 4500,
  factor: 2.2,
  shouldRetry: (err) => {
    const msg = String(err?.message || err || '').toLowerCase()
    // Retry transient/upstream issues; fail fast on auth & validation
    if (msg.includes('authentication') || msg.includes('invalid x-api-key')) return false
    if (msg.includes('incorrect api key') || msg.includes('api_key_invalid')) return false
    if (msg.includes('insufficient_quota') || msg.includes('billing')) return false
    if (msg.includes('csrf')) return false
    if (msg.includes('rate_limit') || msg.includes('rate limit')) return true
    if (msg.includes('overloaded')) return true
    if (msg.includes('timeout') || msg.includes('etimedout')) return true
    if (msg.includes('econnreset') || msg.includes('econnrefused')) return true
    if (msg.includes('5')) return /\b5\d\d\b/.test(msg) // crude 5xx detection
    return true
  },
  onRetry: () => {},
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function withRetry(fn, options = {}) {
  const opts = { ...DEFAULT_OPTS, ...options }
  let attempt = 0
  let lastErr

  while (attempt <= opts.retries) {
    try {
      return await fn(attempt)
    } catch (err) {
      lastErr = err
      if (attempt === opts.retries || !opts.shouldRetry(err)) throw err

      const expDelay = Math.min(opts.maxDelayMs, opts.minDelayMs * Math.pow(opts.factor, attempt))
      const jitter = Math.random() * expDelay
      opts.onRetry({ attempt: attempt + 1, delay: jitter, err })
      await sleep(jitter)
      attempt++
    }
  }
  throw lastErr
}

module.exports = { withRetry, sleep }
