# ATS Resume Tailor

> Beat the Bots. Land the Interview.

Paste your resume and a job description. Claude Opus — Anthropic's most powerful model — rewrites, keyword-optimizes, and compiles a recruiter-ready PDF in under 90 seconds.

## ⚡ Quick Start (3 Steps)

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure API Keys (Choose One Method)

**Method A: In-App Setup (Recommended for non-technical users)**
- Just start the app and use the Setup panel in the UI to paste your keys
- Keys are saved in your browser's localStorage — never sent to our servers

**Method B: Environment Variables (For developers)**
```bash
# In the server/ directory
cp ../.env.example .env
# Edit .env with your actual values
```

### 3. Run the App

```bash
# Terminal 1: Start the backend
cd server
npm run dev

# Terminal 2: Start the frontend
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 How to Get Your API Keys

### Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create a free account (or sign in)
3. Click **"API Keys"** in the sidebar
4. Click **"Create Key"**
5. Copy the key (starts with `sk-ant-`)
6. Paste it into the Setup panel in the app

### Overleaf Session Cookie

1. Go to [overleaf.com](https://www.overleaf.com) and **log in**
2. Press **F12** to open DevTools
3. Click the **Application** tab (Chrome) or **Storage** tab (Firefox)
4. In the left sidebar, expand **Cookies** → click **https://www.overleaf.com**
5. Find the cookie named **`overleaf_session2`**
6. Click on it and **copy the entire Value** (it's a long string)
7. Paste it into the "Overleaf Session Cookie" field in the app

> **Note:** These cookies expire periodically. If you get "session expired" errors, repeat steps 1-7 to get fresh values.

### GCLB Token (Usually Optional)

Same process as above, but copy the value of the **`GCLB`** cookie. Most users won't need this — only add it if you get session errors without it.

---

## 🏗 Architecture

```
├── client/                 # React + Tailwind CSS frontend
│   └── src/
│       ├── App.jsx         # Main orchestrator
│       ├── components/     # All UI components
│       └── utils/          # Word diff algorithm
├── server/
│   ├── index.js            # Express server + API routes
│   ├── atsScorer.js        # Deterministic ATS scoring engine
│   └── resumeGenerator.js  # Claude + Overleaf pipeline
├── .env.example
└── README.md
```

## 📊 ATS Scoring Engine

The scoring is **100% algorithmic** — no AI, no randomness. Same inputs always return the same score.

| Dimension | Points | How It's Measured |
|---|---|---|
| Keyword Match | 40 | JD keywords + phrases found in resume |
| Section Headers | 15 | Presence of standard ATS sections |
| Quantified Achievements | 15 | Lines with numbers + impact words |
| Action Verbs | 10 | Match against 25 strong action verbs |
| Contact Completeness | 10 | Email, phone, LinkedIn, GitHub, location |
| Formatting Signals | 10 | Bullet count, word count, date format |

## 🔒 Security & Privacy

- Resume and job description are **never logged or stored** on the server
- All processing is **in-memory** per request
- API keys sent from the browser are used for that single request only
- Rate limited to 10 requests/hour per IP
- Helmet security headers enabled
- CORS restricted to same origin

---

Built with ❤️ using Claude Opus, React, and Overleaf.
