/**
 * Typed error classes — replace the giant if/else error mapper in index.js.
 *
 * Each error has:
 *  - statusCode : HTTP status to return
 *  - userMessage: friendly, actionable message for the UI
 *  - code       : stable error code for client logic
 */

class AppError extends Error {
  constructor(message, { statusCode = 500, userMessage, code = 'unknown' } = {}) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.userMessage = userMessage || message
    this.code = code
  }
}

class ValidationError extends AppError {
  constructor(userMessage, { code = 'validation' } = {}) {
    super(userMessage, { statusCode: 400, userMessage, code })
  }
}

class AuthError extends AppError {
  constructor(userMessage, { code = 'auth' } = {}) {
    super(userMessage, { statusCode: 401, userMessage, code })
  }
}

class RateLimitError extends AppError {
  constructor(userMessage, { code = 'rate_limit' } = {}) {
    super(userMessage, { statusCode: 429, userMessage, code })
  }
}

class UpstreamError extends AppError {
  constructor(userMessage, { code = 'upstream', statusCode = 502 } = {}) {
    super(userMessage, { statusCode, userMessage, code })
  }
}

/**
 * Map raw provider/Overleaf error messages to our typed errors.
 */
function mapToAppError(err) {
  if (err instanceof AppError) return err

  const msg = String(err?.message || err || '')
  const lower = msg.toLowerCase()

  // Anthropic
  if (lower.includes('authentication_error') || lower.includes('invalid x-api-key')) {
    return new AuthError(
      'Your Anthropic API key is invalid. Go to console.anthropic.com → API Keys → create a new key.',
      { code: 'anthropic_auth' }
    )
  }
  if (lower.includes('overloaded')) {
    return new UpstreamError(
      'The AI model is currently overloaded. Please try again in a few minutes.',
      { code: 'anthropic_overloaded', statusCode: 503 }
    )
  }

  // OpenAI
  if (lower.includes('incorrect api key') || lower.includes('invalid_api_key')) {
    return new AuthError(
      'Your OpenAI API key is invalid. Go to platform.openai.com → API Keys → create a new key.',
      { code: 'openai_auth' }
    )
  }
  if (lower.includes('insufficient_quota') || lower.includes('billing')) {
    return new AppError(
      'Your OpenAI account has no credits. Add billing at platform.openai.com → Settings → Billing.',
      { statusCode: 402, code: 'openai_quota', userMessage: 'OpenAI account has no credits — add billing.' }
    )
  }

  // Gemini
  if (lower.includes('api_key_invalid') || lower.includes('permission_denied')) {
    return new AuthError(
      'Your Gemini API key is invalid. Go to aistudio.google.com → Get API Key → create a new key.',
      { code: 'gemini_auth' }
    )
  }
  if (lower.includes('resource_exhausted')) {
    return new RateLimitError(
      'Gemini API quota exhausted. Wait a moment or check your usage at aistudio.google.com.',
      { code: 'gemini_quota' }
    )
  }

  // Generic rate-limit
  if (lower.includes('rate_limit') || lower.includes('rate limit')) {
    return new RateLimitError(
      'AI rate limit hit. Please wait a minute and try again.',
      { code: 'rate_limit' }
    )
  }

  // Overleaf
  if (lower.includes('csrf')) {
    return new AuthError(
      'Your Overleaf session has expired. Go to Setup → refresh your overleaf_session2 cookie value.',
      { code: 'overleaf_csrf' }
    )
  }
  if (lower.includes('overleaf')) {
    return new UpstreamError(msg, { code: 'overleaf', statusCode: 502 })
  }

  // Fallback
  return new AppError(msg || 'Something went wrong. Please try again.', { statusCode: 500, code: 'internal' })
}

module.exports = {
  AppError,
  ValidationError,
  AuthError,
  RateLimitError,
  UpstreamError,
  mapToAppError,
}
