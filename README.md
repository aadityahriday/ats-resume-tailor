<div align="center">
  <img src="https://img.shields.io/badge/Status-Ultra%20Optimized-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Claude%20Opus-4-1E1E1E?style=for-the-badge" alt="Claude" />
  <img src="https://img.shields.io/badge/SEO-Optimized-green?style=for-the-badge" alt="SEO" />
  <br />
  <img src="https://img.shields.io/badge/Author-Aaditya%20Hriday-orange?style=for-the-badge" alt="Author" />
  <a href="https://github.com/aadityahriday"><img src="https://img.shields.io/badge/GitHub-aadityahriday-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
  <a href="https://instagram.com/aadityahriday"><img src="https://img.shields.io/badge/Instagram-@aadityahriday-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
</div>

<br />

<div align="center">
  <h1 align="center">ATS Resume Tailor</h1>
  <p align="center">
    <strong>Beat the Bots. Land the Interview.</strong>
    <br />
    <i>An n8n-inspired, premium workflow engine for ultra-optimizing ATS resumes with advanced SEO and UX features.</i>
  </p>
</div>

---

Paste your current resume and a target job description. The engine uses advanced AI models (Claude Opus 4, GPT-4.1, Gemini 2.5 Pro) to rewrite, keyword-optimize, and compile a recruiter-ready LaTeX PDF in under 90 seconds.

Features a stunning, fully animated node-based workflow UI with dark/light theme, keyboard shortcuts, and comprehensive export options.

## ✨ Features

### Core Functionality
- **Multi-Model Support:** Choose between Claude Opus 4, GPT-4.1, or Gemini 2.5 Pro for intelligent rewriting
- **Deterministic ATS Scoring:** Algorithmic scoring out of 100 based on keyword matching, action verbs, and quantified achievements
- **n8n-Style Workflow Engine:** Gorgeous frontend UI with animated data pipelines and terminal-style feedback
- **LaTeX Compilation:** Automatically pipes output directly into Overleaf to generate perfectly formatted PDFs
- **Privacy First:** 100% in-memory processing. Your API keys, JD, and resume are never stored on any server

### Advanced SEO & UX
- **SEO-Optimized:** Complete meta tags, Open Graph, Twitter Cards, and JSON-LD structured data for maximum discoverability
- **Onboarding Tour:** Interactive guided tour for first-time users using react-joyride
- **Dark/Light Theme:** Automatic system preference detection with manual toggle
- **Loading Skeletons:** Beautiful skeleton screens for better perceived performance
- **Success Celebration:** Confetti animation when ATS scores reach 90+

### File Handling
- **Drag-and-Drop Upload:** Support for PDF, DOCX, and TXT files with react-dropzone
- **Job Description Scraper:** Auto-scrape JDs from LinkedIn, Indeed, Greenhouse, and Lever URLs
- **Multiple Export Formats:** Export as PDF, DOCX, Markdown, or Plain Text
- **Mobile Responsive:** Fully optimized for touch devices with mobile-first design

### User Experience
- **Keyboard Shortcuts:** Power user shortcuts (Cmd+K, Cmd+R, Cmd+S, Cmd+E, Escape)
- **Real-Time Analytics:** Character/word count with visual progress bars and recommended ranges
- **ATS Visualization:** Interactive radar chart showing score breakdown by dimension
- **Template Gallery:** SEO-optimized template showcase with live preview and filtering
- **Footer Modals:** About Us, Privacy Policy, and Disclaimer in elegant popup modals

---

## ⚡ Quick Start (3 Steps)

### 1. Install Dependencies

```bash
# Clone the repository
git clone https://github.com/aadityahriday/ats-resume-tailor.git
cd ats-resume-tailor

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

You have two options for configuration:

**Method A: In-App Setup (Recommended)**
- Start the app without keys. Use the built-in Setup Panel to paste your API keys securely in your browser's `localStorage`.

**Method B: Environment Variables**
```bash
# In the server/ directory
cp ../.env.example .env
# Edit .env with your actual values
```

### 3. Run the Engine

```bash
# Terminal 1: Start the backend
cd server
npm run dev

# Terminal 2: Start the frontend UI
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 How to Get Your API Keys

### Overleaf Session Cookie (Required for PDF Generation)
1. Go to [overleaf.com](https://www.overleaf.com) and **log in**.
2. Press **F12** to open DevTools.
3. Click the **Application** tab (Chrome) or **Storage** tab (Firefox).
4. In the left sidebar, expand **Cookies** → click **https://www.overleaf.com**.
5. Find the cookie named **`overleaf_session2`**.
6. Click on it and **copy the entire Value**.
7. Paste it into the Setup panel in the app.

**Note:** The GCLB token is no longer required. Only the session cookie is needed.

### AI Provider Keys
- **Anthropic (Claude Opus 4):** Create a key at [console.anthropic.com](https://console.anthropic.com)
- **OpenAI (GPT-4.1):** Create a key at [platform.openai.com](https://platform.openai.com/api-keys)
- **Google (Gemini 2.5 Pro):** Create a key at [aistudio.google.com](https://aistudio.google.com/apikey)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Scroll to form / Focus input |
| `Cmd/Ctrl + R` | Generate resume (if ready) |
| `Cmd/Ctrl + S` | Save (placeholder for future) |
| `Cmd/Ctrl + E` | Export (placeholder for future) |
| `Escape` | Close all modals |
| `Cmd/Ctrl + /` | Show keyboard shortcuts help (placeholder) |

---

## 📊 ATS Scoring Engine

The scoring is **100% algorithmic** — no AI, no randomness. Same inputs always return the same score.

| Dimension | Points | How It's Measured |
|---|---|---|
| **Keyword Match** | 40 | JD keywords + phrases found in resume |
| **Section Headers** | 15 | Presence of standard ATS sections |
| **Quantified Impact**| 15 | Lines with numbers + impact words |
| **Action Verbs** | 10 | Match against 35+ strong action verbs |
| **Contact Data** | 10 | Email, phone, LinkedIn, GitHub, location |
| **Formatting** | 10 | Bullet count, word count, date format |

**Visualization:** The ATS score breakdown is displayed in an interactive radar chart showing performance across all dimensions.

---

## 🎨 UI/UX Features

### Theme System
- **Auto Detection:** Respects system color scheme preference
- **Manual Toggle:** Switch between dark and light modes via navbar button
- **Persistent:** Theme preference saved in localStorage

### Real-Time Feedback
- **Character/Word Count:** Live count with visual progress bars
- **Recommended Ranges:** 
  - Job Description: 200-2000 words
  - Resume: 300-1000 words
- **Color Coding:** Error (below min), Amber (above max), Success (within range)

### Loading States
- **Skeleton Screens:** Beautiful loading placeholders for cards, forms, and workflows
- **Smooth Transitions:** Animated transitions for better perceived performance
- **Workflow Animation:** Real-time step-by-step progress visualization

### Template Gallery
- **6 Professional Templates:** Modern Professional, Executive Classic, Tech Startup, Creative Minimal, Data Science, Entry Level
- **Category Filtering:** Filter by Professional, Executive, Tech, Creative, Technical, Entry Level
- **Live Preview:** Interactive template preview with detailed modal view
- **SEO Optimized:** Template descriptions optimized for search engines

---

## 🏗 Architecture

```text
├── client/                 # React + Tailwind CSS frontend
│   └── src/
│       ├── App.jsx                 # Main orchestrator
│       ├── main.jsx                # Entry point with lazy loading
│       ├── components/            # UI Components
│       │   ├── Hero.jsx            # SEO-optimized hero section
│       │   ├── SetupPanel.jsx      # API key configuration
│       │   ├── GeneratorForm.jsx   # Input forms with file upload
│       │   ├── WorkflowPanel.jsx    # n8n-style workflow visualization
│       │   ├── ScoreComparison.jsx  # Before/after score comparison
│       │   ├── ATSScoreVisualization.jsx # Radar chart visualization
│       │   ├── ResultCard.jsx      # Generated resume display
│       │   ├── HistoryPanel.jsx    # Local storage history
│       │   ├── TemplateGallery.jsx # Template showcase
│       │   ├── OnboardingTour.jsx  # First-time user guide
│       │   ├── ExportModal.jsx     # Export format selection
│       │   ├── FooterModals.jsx    # About, Privacy, Disclaimer modals
│       │   ├── Navbar.jsx          # Navigation with theme toggle
│       │   └── LoadingSkeleton.jsx # Loading placeholders
│       ├── hooks/                  # Custom React hooks
│       │   ├── useKeyboardShortcuts.js # Global keyboard shortcuts
│       │   └── useTheme.js         # Theme management
│       ├── index.css              # Premium Design System
│       └── utils/                 # Diff algorithms
├── server/
│   ├── index.js                   # Express server with file upload & URL scraping
│   ├── atsScorer.js              # Deterministic ATS algorithm
│   ├── resumeGenerator.js        # Core AI Prompt Engineering + LaTeX templates
│   ├── urlScraper.js             # Job description URL scraper
│   └── errors.js                 # Error handling utilities
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

---

## 🔒 Privacy & Security

- **No Server Storage:** All API keys, resumes, and job descriptions are processed in-memory only
- **LocalStorage Only:** User preferences and API keys stored locally in browser
- **No Tracking:** No analytics, cookies, or third-party tracking
- **Overleaf Integration:** Session cookie used only for PDF compilation, not stored

---

## 🚀 Performance Optimizations

- **Code Splitting:** Lazy loading of main App component for faster initial load
- **Core Web Vitals:** Optimized LCP, FID, and CLS metrics
- **Skeleton Loading:** Perceived performance improvements with skeleton screens
- **Efficient Rendering:** React.memo and useCallback for optimal re-renders

---

## 🌐 SEO Features

- **Meta Tags:** Complete title, description, and viewport meta tags
- **Open Graph:** Facebook/LinkedIn sharing optimization
- **Twitter Cards:** Twitter sharing optimization
- **JSON-LD Structured Data:** SoftwareApplication, FAQPage, HowTo, Organization schemas
- **Semantic HTML:** Proper heading hierarchy and semantic markup

---

## 📱 Mobile Support

- **Touch Optimization:** Large tap targets (min 44x44px)
- **Responsive Grid:** Adaptive layouts for all screen sizes
- **Touch Gestures:** Swipe and pinch support where applicable
- **Mobile-First:** Design approach prioritizing mobile experience

---

## 🎓 Supported File Formats

### Input
- **PDF:** Parsed using pdf-parse library
- **DOCX:** Parsed using mammoth library
- **TXT:** Plain text files
- **URL:** Auto-scraped from LinkedIn, Indeed, Greenhouse, Lever

### Output
- **PDF:** Professional LaTeX compilation via Overleaf
- **DOCX:** Word document format
- **Markdown:** .md files for version control
- **Plain Text:** .txt files for universal compatibility

---

## 🛠 Technology Stack

### Frontend
- **React 18:** Modern React with hooks
- **Vite:** Fast build tool and dev server
- **Tailwind CSS:** Utility-first CSS framework
- **Recharts:** Data visualization for radar charts
- **React Joyride:** Onboarding tour library
- **React Hotkeys Hook:** Keyboard shortcuts
- **React Dropzone:** Drag-and-drop file upload
- **Framer Motion:** Smooth animations
- **Canvas Confetti:** Celebration effects

### Backend
- **Node.js:** JavaScript runtime
- **Express:** Web framework
- **Multer:** File upload handling
- **pdf-parse:** PDF file parsing
- **Mammoth:** DOCX file parsing
- **Cheerio:** HTML scraping for job descriptions

### AI Providers
- **Anthropic API:** Claude Opus 4 with extended thinking
- **OpenAI API:** GPT-4.1
- **Google AI:** Gemini 2.5 Pro

---

## 📝 Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Anthropic (Claude Opus 4) — Get from: console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (GPT-4.1) — Get from: platform.openai.com
OPENAI_API_KEY=sk-proj-...

# Google Gemini — Get from: aistudio.google.com
GEMINI_API_KEY=AIzaSy...

# Overleaf Session — Get from: overleaf.com → F12 → Application → Cookies → overleaf_session2
OVERLEAF_SESSION_COOKIE=...
```

**Note:** All keys are optional. You can configure them through the in-app Setup panel instead.

---

## 👤 Author

**Aaditya Hriday**

- 🐙 GitHub: [@aadityahriday](https://github.com/aadityahriday)
- 📸 Instagram: [@aadityahriday](https://instagram.com/aadityahriday)

---

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

---

## 📄 License

MIT License - feel free to use this for your job search!

---

<div align="center">
  <p>Built with ❤️ by <strong>Aaditya Hriday</strong> for landing the interview.</p>
  <p><i>Beat the ATS bots. Get the job.</i></p>
  <br />
  <a href="https://github.com/aadityahriday">GitHub</a> · <a href="https://instagram.com/aadityahriday">Instagram</a>
</div>
