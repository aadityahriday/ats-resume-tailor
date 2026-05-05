<div align="center">
  <img src="https://img.shields.io/badge/Status-Ultra%20Optimized-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Claude%20Opus-1E1E1E?style=for-the-badge" alt="Claude" />
</div>

<br />

<div align="center">
  <h1 align="center">ATS Resume Tailor</h1>
  <p align="center">
    <strong>Beat the Bots. Land the Interview.</strong>
    <br />
    <i>An n8n-inspired, premium workflow engine for ultra-optimizing ATS resumes.</i>
  </p>
</div>

---

Paste your current resume and a target job description. The engine uses advanced AI models (Claude Opus 4, GPT-4.1, Gemini 2.5 Pro) to rewrite, keyword-optimize, and compile a recruiter-ready LaTeX PDF in under 90 seconds. 

Features a stunning, fully animated node-based workflow UI.

## ✨ Features

- **Multi-Model Support:** Choose between Claude, ChatGPT, or Gemini for intelligent rewriting.
- **Deterministic ATS Scoring:** Algorithmic scoring out of 100 based on keyword matching, action verbs, and quantified achievements.
- **n8n-Style Workflow Engine:** Gorgeous frontend UI with animated data pipelines and terminal-style feedback.
- **LaTeX Compilation:** Automatically pipes output directly into Overleaf to generate perfectly formatted PDFs.
- **Privacy First:** 100% in-memory processing. Your API keys, JD, and resume are never stored on any server.

---

## ⚡ Quick Start (3 Steps)

### 1. Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/ats-resume-tailor.git
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

### AI Provider Keys
- **Anthropic:** Create a key at [console.anthropic.com](https://console.anthropic.com)
- **OpenAI:** Create a key at [platform.openai.com](https://platform.openai.com/api-keys)
- **Gemini:** Create a key at [aistudio.google.com](https://aistudio.google.com/apikey)

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

---

## 🏗 Architecture

```text
├── client/                 # React + Tailwind CSS frontend
│   └── src/
│       ├── App.jsx         # Main orchestrator
│       ├── components/     # UI: WorkflowPanel, Hero, SetupPanel
│       ├── index.css       # Premium Design System (glassmorphism, animations)
│       └── utils/          # Diff algorithms
├── server/
│   ├── index.js            # Express server
│   ├── atsScorer.js        # Deterministic ATS algorithm
│   └── resumeGenerator.js  # Core AI Prompt Engineering + LaTeX templates
├── .env.example
└── README.md
```

---

<div align="center">
  <p>Built with ❤️ for landing the interview.</p>
</div>
