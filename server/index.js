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
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { computeATSScore } = require('./atsScorer');
const { rewriteResume, convertToLatex, overleafPipeline } = require('./resumeGenerator');
const { mapToAppError } = require('./errors');
const { withRetry } = require('./retry');
const { scrapeJobDescription } = require('./urlScraper');

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
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// ─── File Upload Middleware ───────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'));
    }
  }
});

// ─── Rate Limiting ───────────────────────────────────────────────
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyGenerator: (req) => {
    const apiKey = req.body.anthropicKey || req.body.openaiKey || req.body.geminiKey;
    if (apiKey && typeof apiKey === 'string') {
      return `key:${apiKey.substring(0, 10)}`;
    }
    return req.ip;
  },
  message: {
    status: 'error',
    message: "You've hit the rate limit (10 requests/hour). Please wait before trying again."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ─── Input Validation Middleware ───────────────────────────────
function validateInputs(req, res, next) {
  const { jobDescription, currentResume } = req.body;
  
  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.length < 50) {
    return res.status(400).json({
      status: 'error',
      message: 'Job description is too short or invalid. Please provide a complete job posting.'
    });
  }
  
  if (jobDescription.length > 50000) {
    return res.status(400).json({
      status: 'error',
      message: 'Job description is too long. Please provide a shorter job posting.'
    });
  }
  
  if (!currentResume || typeof currentResume !== 'string' || currentResume.length < 100) {
    return res.status(400).json({
      status: 'error',
      message: 'Resume is too short or invalid. Please provide a complete resume.'
    });
  }
  
  if (currentResume.length > 100000) {
    return res.status(400).json({
      status: 'error',
      message: 'Resume is too long. Please provide a shorter resume.'
    });
  }
  
  next();
}

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
app.post('/api/generate', generateLimiter, validateInputs, async (req, res) => {
  const startTime = Date.now();
  const stepTimings = {};
  
  // Overall timeout handler
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(504).json({
        status: 'error',
        message: 'Request timed out. Please try again.'
      });
    }
  }, 180000); // 3 minute total timeout

  try {
    const {
      jobDescription,
      currentResume,
      aiProvider = 'anthropic',
      anthropicKey,
      openaiKey,
      geminiKey,
      overleafSession
    } = req.body;

    // ── Validation ──
    if (!jobDescription || !jobDescription.trim()) {
      clearTimeout(timeout);
      return res.status(400).json({
        status: 'error',
        message: 'Job description is required. Paste the full job posting for best results.'
      });
    }

    if (!currentResume || !currentResume.trim()) {
      clearTimeout(timeout);
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
      clearTimeout(timeout);
      return res.status(400).json({
        status: 'error',
        message: keyValidation.message
      });
    }

    const session = overleafSession || process.env.OVERLEAF_SESSION_COOKIE;
    if (!session) {
      clearTimeout(timeout);
      return res.status(400).json({
        status: 'error',
        message: 'Overleaf session cookie not configured. Open Setup above and follow the cookie guide.'
      });
    }

    console.log(`[generate] Using AI provider: ${getProviderName(aiProvider)}`);

    // ── Step 1: Before Score ──
    let stepStart = Date.now();
    const beforeScore = computeATSScore(currentResume, jobDescription);
    stepTimings.beforeScore = Date.now() - stepStart;

    // ── Step 2: AI Rewrite ──
    stepStart = Date.now();
    const markdownResume = await withRetry(
      () => rewriteResume(aiProvider, apiKey, jobDescription, currentResume),
      { retries: 2, minDelayMs: 1000, maxDelayMs: 5000 }
    );
    stepTimings.rewrite = Date.now() - stepStart;

    // ── Step 3: After Score ──
    stepStart = Date.now();
    const afterScore = computeATSScore(markdownResume, jobDescription);
    stepTimings.afterScore = Date.now() - stepStart;

    // ── Step 4: LaTeX Conversion ──
    stepStart = Date.now();
    const latexCode = await withRetry(
      () => convertToLatex(aiProvider, apiKey, markdownResume),
      { retries: 2, minDelayMs: 1000, maxDelayMs: 5000 }
    );
    stepTimings.latex = Date.now() - stepStart;

    // ── Steps 5-9: Overleaf Pipeline ──
    stepStart = Date.now();
    const overleafResult = await withRetry(
      () => overleafPipeline(latexCode, session),
      { retries: 2, minDelayMs: 1000, maxDelayMs: 5000 }
    );
    stepTimings.overleaf = Date.now() - stepStart;

    if (overleafResult.compileFailed) {
      clearTimeout(timeout);
      return res.json({
        status: 'partial',
        message: `PDF compilation failed on Overleaf. You can open your project to debug and compile manually.`,
        aiProvider,
        beforeScore,
        afterScore,
        markdownResume: markdownResume || '',
        latexCode: latexCode || '',
        projectUrl: overleafResult.projectUrl || '',
        pdfBase64: null,
        timings: stepTimings,
        totalTime: Date.now() - startTime
      });
    }

    if (overleafResult.downloadFailed) {
      clearTimeout(timeout);
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

    clearTimeout(timeout);
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
    clearTimeout(timeout);
    
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
    } else {
      console.error('[generate] Unmapped error:', error.message);
      userMessage = 'An unexpected error occurred. Please try again.';
    }

    // Use typed error if available
    const appError = mapToAppError(error);
    return res.status(appError.statusCode).json({
      status: 'error',
      message: appError.userMessage || userMessage,
      code: appError.code,
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

// ─── File Parsing Endpoint ───────────────────────────────────────
app.post('/api/parse-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
    }

    const { buffer, mimetype, originalname } = req.file;
    let text = '';

    // Parse based on file type
    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (
      mimetype === 'application/msword' ||
      originalname.endsWith('.doc')
    ) {
      // DOC files require additional library, return error for now
      return res.status(400).json({ 
        status: 'error', 
        message: 'Legacy .doc files are not supported. Please save as .docx or .txt.' 
      });
    } else if (mimetype === 'text/plain' || originalname.endsWith('.txt')) {
      text = buffer.toString('utf-8');
    } else {
      return res.status(400).json({ status: 'error', message: 'Unsupported file type.' });
    }

    // Clean up the extracted text
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

    return res.json({ status: 'success', text });
  } catch (error) {
    console.error('[parse-file] Error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to parse file. Please try again or copy-paste the text directly.' 
    });
  }
});

// ─── Job Description URL Scraper Endpoint ───────────────────────
app.post('/api/scrape-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ status: 'error', message: 'URL is required.' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ status: 'error', message: 'Invalid URL format.' });
    }

    const result = await scrapeJobDescription(url);

    if (result.success) {
      return res.json({ status: 'success', text: result.text });
    } else {
      return res.status(400).json({ status: 'error', message: result.error });
    }
  } catch (error) {
    console.error('[scrape-url] Error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to scrape URL. Please copy-paste the job description directly.' 
    });
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
