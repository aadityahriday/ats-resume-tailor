/**
 * ATS Resume Tailor — Express Server
 * Main entry point for the backend API
 * Supports multiple AI providers: Anthropic (Claude), OpenAI (ChatGPT), Google (Gemini)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { computeATSScore } = require('./atsScorer');
const { rewriteResume, convertToLatex, overleafPipeline } = require('./resumeGenerator');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security Middleware ─────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://resumecopy.com',
    'https://www.resumecopy.com',
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));

// ─── Rate Limiting ───────────────────────────────────────────────
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    status: 'error',
    message: "You've hit the rate limit (10 requests/hour). Please wait before trying again."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ─── API Key Validation Helpers ──────────────────────────────────
function validateApiKey(provider, apiKey) {
  if (!apiKey || !apiKey.trim()) {
    return { valid: false, message: `API key for ${getProviderName(provider)} is missing. Go to Setup and paste your key.` };
  }

  switch (provider) {
    case 'anthropic':
      if (!apiKey.startsWith('sk-ant-')) {
        return { valid: false, message: 'Invalid Anthropic API key. Keys start with "sk-ant-". Get yours at console.anthropic.com → API Keys' };
      }
      break;
    case 'openai':
      if (!apiKey.startsWith('sk-')) {
        return { valid: false, message: 'Invalid OpenAI API key. Keys start with "sk-". Get yours at platform.openai.com → API Keys' };
      }
      break;
    case 'gemini':
      if (apiKey.length < 10) {
        return { valid: false, message: 'Invalid Gemini API key. Get yours at aistudio.google.com → API Keys' };
      }
      break;
    default:
      return { valid: false, message: `Unknown AI provider: ${provider}. Choose anthropic, openai, or gemini.` };
  }

  return { valid: true };
}

function getProviderName(provider) {
  const names = {
    anthropic: 'Anthropic (Claude)',
    openai: 'OpenAI (ChatGPT)',
    gemini: 'Google (Gemini)'
  };
  return names[provider] || provider;
}

// ─── Health Check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Main Generate Endpoint ─────────────────────────────────────
app.post('/api/generate', generateLimiter, async (req, res) => {
  const startTime = Date.now();
  const stepTimings = {};

  try {
    const {
      jobDescription,
      currentResume,
      aiProvider = 'anthropic',
      anthropicKey,
      openaiKey,
      geminiKey,
      overleafSession,
      overleafGclb
    } = req.body;

    // ── Validation ──
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Job description is required. Paste the full job posting for best results.'
      });
    }

    if (!currentResume || !currentResume.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Current resume is required. Paste your resume as plain text.'
      });
    }

    // ── Resolve API key for chosen provider ──
    let apiKey;
    switch (aiProvider) {
      case 'openai':
        apiKey = openaiKey || process.env.OPENAI_API_KEY;
        break;
      case 'gemini':
        apiKey = geminiKey || process.env.GEMINI_API_KEY;
        break;
      case 'anthropic':
      default:
        apiKey = anthropicKey || process.env.ANTHROPIC_API_KEY;
        break;
    }

    const keyValidation = validateApiKey(aiProvider, apiKey);
    if (!keyValidation.valid) {
      return res.status(400).json({
        status: 'error',
        message: keyValidation.message
      });
    }

    const session = overleafSession || process.env.OVERLEAF_SESSION_COOKIE;
    if (!session) {
      return res.status(400).json({
        status: 'error',
        message: 'Overleaf session cookie not configured. Open Setup above and follow the cookie guide.'
      });
    }

    const gclb = overleafGclb || process.env.OVERLEAF_GCLB_TOKEN || '';

    console.log(`[generate] Using AI provider: ${getProviderName(aiProvider)}`);

    // ── Step 1: Before Score ──
    let stepStart = Date.now();
    const beforeScore = computeATSScore(currentResume, jobDescription);
    stepTimings.beforeScore = Date.now() - stepStart;

    // ── Step 2: AI Rewrite ──
    stepStart = Date.now();
    const markdownResume = await rewriteResume(aiProvider, apiKey, jobDescription, currentResume);
    stepTimings.rewrite = Date.now() - stepStart;

    // ── Step 3: After Score ──
    stepStart = Date.now();
    const afterScore = computeATSScore(markdownResume, jobDescription);
    stepTimings.afterScore = Date.now() - stepStart;

    // ── Step 4: LaTeX Conversion ──
    stepStart = Date.now();
    const latexCode = await convertToLatex(aiProvider, apiKey, markdownResume);
    stepTimings.latex = Date.now() - stepStart;

    // ── Steps 5-9: Overleaf Pipeline ──
    stepStart = Date.now();
    const overleafResult = await overleafPipeline(latexCode, session, gclb);
    stepTimings.overleaf = Date.now() - stepStart;

    if (overleafResult.compileFailed) {
      return res.json({
        status: 'partial',
        message: `PDF compilation failed on Overleaf. You can open your project to debug and compile manually.`,
        aiProvider,
        beforeScore,
        afterScore,
        markdownResume,
        latexCode,
        projectUrl: overleafResult.projectUrl,
        pdfBase64: null,
        timings: stepTimings,
        totalTime: Date.now() - startTime
      });
    }

    if (overleafResult.downloadFailed) {
      return res.json({
        status: 'success',
        message: `PDF compiled successfully but could not be auto-downloaded. Open the Overleaf project to download it.`,
        aiProvider,
        beforeScore,
        afterScore,
        markdownResume,
        projectUrl: overleafResult.projectUrl,
        pdfBase64: null,
        timings: stepTimings,
        totalTime: Date.now() - startTime
      });
    }

    return res.json({
      status: 'success',
      aiProvider,
      beforeScore,
      afterScore,
      markdownResume,
      projectUrl: overleafResult.projectUrl,
      pdfUrl: overleafResult.pdfUrl,
      pdfBase64: overleafResult.pdfBase64,
      timings: stepTimings,
      totalTime: Date.now() - startTime
    });

  } catch (error) {
    // Never log resume or JD content
    console.error('[generate] Pipeline error:', error.message);

    let userMessage = error.message;

    // Friendly error mapping — Anthropic
    if (error.message.includes('authentication_error') || error.message.includes('invalid x-api-key')) {
      userMessage = 'Your Anthropic API key is invalid. Go to console.anthropic.com → API Keys → create a new key.';
    } else if (error.message.includes('rate_limit')) {
      userMessage = 'AI rate limit hit. Please wait a minute and try again.';
    } else if (error.message.includes('overloaded')) {
      userMessage = 'The AI model is currently overloaded. Please try again in a few minutes.';
    } else if (error.message.includes('CSRF') || error.message.includes('csrf')) {
      userMessage = 'Your Overleaf session has expired. Go to Setup → refresh your overleaf_session2 cookie value.';
    }
    // Friendly error mapping — OpenAI
    else if (error.message.includes('Incorrect API key') || error.message.includes('invalid_api_key')) {
      userMessage = 'Your OpenAI API key is invalid. Go to platform.openai.com → API Keys → create a new key.';
    } else if (error.message.includes('insufficient_quota') || error.message.includes('billing')) {
      userMessage = 'Your OpenAI account has no credits. Add billing at platform.openai.com → Settings → Billing.';
    }
    // Friendly error mapping — Gemini
    else if (error.message.includes('API_KEY_INVALID') || error.message.includes('PERMISSION_DENIED')) {
      userMessage = 'Your Gemini API key is invalid. Go to aistudio.google.com → Get API Key → create a new key.';
    } else if (error.message.includes('RESOURCE_EXHAUSTED')) {
      userMessage = 'Gemini API quota exhausted. Wait a moment or check your usage at aistudio.google.com.';
    }

    return res.status(500).json({
      status: 'error',
      message: userMessage,
      timings: stepTimings,
      totalTime: Date.now() - startTime
    });
  }
});

// ─── Score-only endpoint (for testing) ──────────────────────────
app.post('/api/score', (req, res) => {
  try {
    const { resumeText, jdText } = req.body;
    if (!resumeText || !jdText) {
      return res.status(400).json({ status: 'error', message: 'Both resumeText and jdText are required.' });
    }
    const score = computeATSScore(resumeText, jdText);
    return res.json({ status: 'success', score });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// ─── Start Server ────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n  ⚡ ATS Resume Tailor server running on http://localhost:${PORT}`);
    console.log(`  📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`  🔑 Anthropic key: ${process.env.ANTHROPIC_API_KEY ? 'configured' : 'not set (use UI)'}`);
    console.log(`  🔑 OpenAI key: ${process.env.OPENAI_API_KEY ? 'configured' : 'not set (use UI)'}`);
    console.log(`  🔑 Gemini key: ${process.env.GEMINI_API_KEY ? 'configured' : 'not set (use UI)'}`);
    console.log(`  📄 Overleaf session: ${process.env.OVERLEAF_SESSION_COOKIE ? 'configured' : 'not set (use UI)'}\n`);
  });
}

module.exports = app;
