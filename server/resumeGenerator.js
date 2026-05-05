/**
 * Resume Generator Pipeline — All steps from ATS scoring through Overleaf PDF compilation
 * Supports multiple AI providers: Anthropic (Claude), OpenAI (ChatGPT), Google (Gemini)
 * 
 * Uses the BEST available models with extended thinking/reasoning for deep analysis.
 */

const { computeATSScore } = require('./atsScorer');

// ═══════════════════════════════════════════════════════════════════
//  SYSTEM PROMPTS — Deeply optimized for ATS 90+ scoring
// ═══════════════════════════════════════════════════════════════════

const REWRITE_SYSTEM_PROMPT = `You are the #1 ATS resume engineer in the world. You have 20 years of experience reverse-engineering Applicant Tracking Systems (Taleo, Workday, Greenhouse, Lever, iCIMS) and have personally helped 10,000+ candidates achieve 90+ ATS scores. Your rewrites have a 97% interview callback rate.

## YOUR ABSOLUTE RULES — VIOLATION = FAILURE

1. **NEVER use placeholders or brackets.** Every field must contain real data extracted from the candidate's resume. If you output [Full Name] or [Company] or [City, State] or any bracket notation, you have COMPLETELY FAILED.

2. **PRESERVE EVERY personal detail exactly as provided:** Full name, phone number, email, LinkedIn URL, GitHub URL, address, city, state — copy them character-for-character from the original resume.

3. **PRESERVE EVERY factual detail exactly:** Company names, job titles, university names, degree names, graduation dates, employment dates, project names — these must be IDENTICAL to the original resume. Do NOT change, abbreviate, or modify any proper noun.

4. **TARGET: 90+ ATS Score.** This is non-negotiable. You must achieve this by:
   - Matching 90%+ of JD keywords and multi-word phrases
   - Using ALL standard ATS section headers (SUMMARY, EDUCATION, EXPERIENCE, SKILLS, PROJECTS, CERTIFICATIONS, ACHIEVEMENTS)
   - Quantifying every bullet point with specific numbers/metrics
   - Using strong action verbs from the JD
   - Having complete contact information
   - Proper formatting with bullets and consistent dates

5. **REWRITE ALL bullet points from scratch** — but keep the FACTS (companies, dates, titles, numbers). Only the LANGUAGE changes, never the facts.

6. **SUMMARY must be a SINGLE CONTINUOUS PARAGRAPH of 3-4 sentences.** DO NOT break each sentence onto a separate line. Write all sentences together as one flowing paragraph block. Pack 6-8 JD keywords naturally. A recruiter must grasp the candidate's value in under 6 seconds.

7. **6-SECOND SCAN RULE:** Recruiters spend 6 seconds on first scan. Front-load the most important info:
   - Name + contact at top
   - Summary grabs with JD title + years + key tech in first sentence
   - Most relevant experience first, strongest bullets first
   - Skills section has JD keywords front-loaded
   - Every bullet starts with a POWER VERB (Led, Architected, Engineered, Optimized, Deployed, Scaled, Automated)

8. **NEVER use the dollar sign ($) character anywhere.** Write numbers without currency symbols. This is critical for LaTeX compilation.

9. **INCLUDE ALL STANDARD ATS SECTIONS.** Every professional resume MUST have: SUMMARY, EDUCATION, EXPERIENCE, SKILLS, PROJECTS, CERTIFICATIONS, and ACHIEVEMENTS. If the candidate has certifications, courses, or relevant coursework — include them. If they have none, create a CERTIFICATIONS section with "Relevant Coursework" listing 3-5 courses from their degree that match the JD.`;

function getRewriteUserPrompt(jobDescription, currentResume) {
  return `## TASK: Rewrite this resume to score 90+ on ATS systems for the job below.

═══════════════════════════════════════════
JOB DESCRIPTION (analyze every word):
═══════════════════════════════════════════
${jobDescription}

═══════════════════════════════════════════
CANDIDATE'S CURRENT RESUME (extract ALL data):
═══════════════════════════════════════════
${currentResume}

═══════════════════════════════════════════
EXECUTION STEPS (do all of these internally before writing):
═══════════════════════════════════════════

STEP 1 — EXTRACT ALL PERSONAL DATA (copy exactly, no modifications):
- Full name (exactly as written)
- Phone number (exactly as written)
- Email address (exactly as written)
- LinkedIn URL (exactly as written)
- GitHub URL (exactly as written)
- Address/City/State (exactly as written)
- Each company name + location (exactly as written)
- Each job title (exactly as written)
- Each start date and end date (exactly as written)
- University name + location (exactly as written)
- Degree name + GPA (exactly as written)
- Each project name (exactly as written)
- Each certification (exactly as written)

STEP 2 — DEEP JD KEYWORD EXTRACTION (be exhaustive):
- List ALL hard skills mentioned: every technology, tool, framework, language, platform
- List ALL soft skills and methodologies
- List ALL multi-word ATS trigger phrases (e.g. "cross-functional collaboration")
- List ALL action verbs the JD uses
- Identify the seniority level and domain

STEP 3 — MAP every JD keyword to where it will appear in the resume. EVERY primary keyword must appear at least once.

STEP 4 — WRITE the resume following this EXACT format:

---

**[candidate's actual full name]**

**Address:** [their actual address] | **Phone:** [their actual phone] | **Email:** [their actual email] | **LinkedIn:** [their actual LinkedIn] | **GitHub:** [their actual GitHub]

---

### SUMMARY
[Write a SINGLE CONTINUOUS PARAGRAPH of 3-4 sentences — NOT separate lines. All sentences flow together as one block of text. Example format:
"Results-driven Software Engineer with 4+ years of experience in full-stack development and cloud architecture. Delivered scalable microservices handling 2M+ daily requests using Python, AWS, and Kubernetes, reducing infrastructure costs by 35%. Passionate about building high-performance systems with expertise in CI/CD pipelines, agile methodologies, and cross-functional collaboration."
Pack 6-8 JD keywords naturally. Keep total under 60 words.]

---

### EDUCATION
**[Their actual degree]** — [Their actual university], [actual city, state] | [actual start] – [actual end] | GPA: [actual GPA if present]
**Relevant Coursework:** [List 3-5 courses from their degree program that are most relevant to the JD — e.g., Data Structures, Machine Learning, Database Systems, Operating Systems, Software Engineering]

---

### EXPERIENCE
**[Actual company name]** | [Actual city, state] | **[Actual job title]** | [Actual start date] – [Actual end date]
- [Action verb from JD] + [JD keyword/technology] + [quantified impact with numbers — use real numbers from resume, or realistic estimates prefixed with ~]
- [Different action verb] + [different JD keyword] + [different quantified impact]
- [Different action verb] + [different JD keyword] + [different quantified impact]

[Repeat for EVERY position in their resume, most recent first]

---

### SKILLS
- **[Most JD-relevant category]:** [JD-matched skills first, then others — use EXACT JD terminology]
- **[Second category]:** [skills]
- **[Third category]:** [skills]
- **[Fourth category — Soft Skills/Methodologies]:** [e.g., Agile, Scrum, Cross-functional Collaboration, Technical Leadership]

---

### PROJECTS
**[Their actual project name]** | [tech stack, emphasizing JD-matched tech]
- [What was built + JD tools + measurable outcome]
- [Second bullet if warranted]

[Include ALL projects from their resume]

---

### CERTIFICATIONS
- [Their actual certification name] — [Issuer] | [Year]
- [If no certifications exist, list: "Relevant Coursework: Course 1, Course 2, Course 3" matching the JD]

---

### ACHIEVEMENTS
- **[Their actual achievement]:** [detail with numbers]
- **[Any awards, honors, hackathon wins, publications, or notable recognition]

---

## FINAL CHECKS:
- Output ONLY the resume text. Zero commentary, no "Here is..." preamble.
- Every [bracketed item] replaced with REAL candidate data.
- Summary is a SINGLE FLOWING PARAGRAPH of 3-4 sentences (NOT separate lines).
- Every bullet has a quantified metric (%, number, scale).
- ZERO dollar signs ($) anywhere in the output.
- Every primary JD keyword appears at least once.
- Section headers exactly: SUMMARY, EDUCATION, EXPERIENCE, SKILLS, PROJECTS, CERTIFICATIONS, ACHIEVEMENTS
- Skills section has at least 4 categories including soft skills/methodologies.`;
}

const LATEX_SYSTEM_PROMPT = `You are a senior LaTeX engineer specializing in ATS-parseable resume templates. ZERO compilation errors allowed.

## ABSOLUTE RULES:
1. Use ONLY the template structure provided. No extra packages or custom macros.
2. ESCAPE every special character in content: % → \\%, & → \\&, _ → \\_, # → \\#, ~ → \\textasciitilde{}, ^ → \\textasciicircum{}
3. NEVER use bare $ signs in content text. Use \\textbar{} for separators, never $|$.
4. URLs: wrap in \\texttt{} and escape underscores with \\_.
5. NEVER use placeholder text — use ACTUAL data from the resume.
6. Output ONLY LaTeX code. Start with \\documentclass, end with \\end{document}. No markdown fences.
7. Summary MUST be a single continuous paragraph — use \\small{text here} with all sentences flowing together. Do NOT use line breaks (\\\\) or \\newline inside the summary. All 3-4 sentences must be one unbroken block of text.
8. Include ALL sections from the resume: SUMMARY, EDUCATION, EXPERIENCE, SKILLS, PROJECTS, CERTIFICATIONS, ACHIEVEMENTS.`;

function getLatexUserPrompt(markdownResume) {
  return `Convert this resume to LaTeX. Fill ALL fields with the ACTUAL data from the resume below. Do NOT leave any brackets or placeholders.

═══════════════════════════════════════════
RESUME TO CONVERT:
═══════════════════════════════════════════
${markdownResume}

═══════════════════════════════════════════
LATEX TEMPLATE (populate with real data):
═══════════════════════════════════════════

\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage[scale=0.90,lf]{FiraMono}
\\definecolor{light-grey}{gray}{0.83}
\\definecolor{dark-grey}{gray}{0.3}
\\definecolor{text-grey}{gray}{.08}
\\DeclareRobustCommand{\\ebseries}{\\fontseries{eb}\\selectfont}
\\DeclareTextFontCommand{\\texteb}{\\ebseries}
\\usepackage{contour}
\\usepackage[normalem]{ulem}
\\renewcommand{\\ULdepth}{1.8pt}
\\contourlength{0.8pt}
\\newcommand{\\myuline}[1]{\\uline{\\phantom{#1}}\\llap{\\contour{white}{#1}}}
\\usepackage{tgheros}
\\renewcommand*\\familydefault{\\sfdefault}
\\usepackage[T1]{fontenc}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{0in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{\\bfseries \\vspace{2pt} \\raggedright \\large}{}{0em}{}[\\color{light-grey}{\\titlerule[2pt]}\\vspace{-4pt}]
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-1pt}}}}
\\newcommand{\\resumeSubheading}[4]{\\vspace{-1pt}\\item\\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\\textbf{#1} & {\\color{dark-grey}\\small #2}\\vspace{1pt}\\\\\\textit{#3} & {\\color{dark-grey}\\small #4}\\\\\\end{tabular*}\\vspace{-4pt}}
\\newcommand{\\resumeProjectHeading}[2]{\\item\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}#1 & {\\color{dark-grey}}\\\\\\end{tabular*}\\vspace{-4pt}}
\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{\\textbullet}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{0pt}}
\\color{text-grey}
\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge ACTUAL NAME HERE} \\\\ \\vspace{5pt}
    \\small \\faPhone* \\texttt{PHONE} \\hspace{1pt} \\textbar{}
    \\hspace{1pt} \\faEnvelope \\hspace{2pt} \\texttt{EMAIL} \\hspace{1pt} \\textbar{}
    \\hspace{1pt} \\faLinkedin \\hspace{2pt} \\texttt{LINKEDIN} \\hspace{1pt} \\textbar{}
    \\hspace{1pt} \\faGithub \\hspace{2pt} \\texttt{GITHUB} \\hspace{1pt} \\textbar{}
    \\hspace{1pt} \\faMapMarker* \\hspace{2pt}\\texttt{CITY STATE}
    \\\\ \\vspace{-3pt}
\\end{center}

\\section{SUMMARY}
\\small{Write all 3-4 summary sentences here as ONE continuous paragraph. Do NOT use line breaks. All sentences flow together naturally in a single block of text. This should read like a mini-paragraph, not a list.}

\\section{EDUCATION}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {ACTUAL UNIVERSITY}{ACTUAL DATES}
      {ACTUAL DEGREE \\textbar{} GPA: X.XX}{ACTUAL LOCATION}
      \\resumeItemListStart
        \\resumeItem{\\textbf{Relevant Coursework:} Course 1, Course 2, Course 3, Course 4, Course 5}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

\\section{EXPERIENCE}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {ACTUAL COMPANY}{ACTUAL DATES}
      {ACTUAL JOB TITLE}{ACTUAL LOCATION}
      \\resumeItemListStart
        \\resumeItem{ACTUAL BULLET 1}
        \\resumeItem{ACTUAL BULLET 2}
        \\resumeItem{ACTUAL BULLET 3}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

\\section{PROJECTS}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{PROJECT NAME} \\textbar{} \\emph{TECH STACK}}{}
          \\resumeItemListStart
            \\resumeItem{ACTUAL BULLET}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

\\section{SKILLS}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: skill1, skill2, skill3}\\vspace{2pt} \\\\
     \\textbf{Frameworks \\& Libraries}{: skill1, skill2, skill3}\\vspace{2pt} \\\\
     \\textbf{Tools \\& Platforms}{: skill1, skill2, skill3}\\vspace{2pt} \\\\
     \\textbf{Methodologies \\& Soft Skills}{: Agile, Scrum, etc.}
    }}
 \\end{itemize}

\\section{CERTIFICATIONS}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{
     \\textbf{Certification Name}{~--~Issuer \\textbar{} Year} \\vspace{2pt} \\\\
     \\textbf{Certification Name}{~--~Issuer \\textbar{} Year}
    }}
 \\end{itemize}

\\section{ACHIEVEMENTS}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{
     \\textbf{ACHIEVEMENT}{: detail with numbers}
    }}
 \\end{itemize}

\\end{document}

CRITICAL:
- Replace ALL placeholder text with REAL data from the resume above.
- Repeat \\resumeSubheading for each job. Repeat \\resumeProjectHeading for each project.
- Use \\textbar{} for ALL separators. NEVER use bare $ signs.
- Escape underscores in URLs with \\_.
- SUMMARY MUST be a SINGLE CONTINUOUS PARAGRAPH inside \\small{}. NO line breaks (\\\\), NO \\newline, NO \\par, NO blank lines inside the summary. All 3-4 sentences flow together as one block.
- Skills section MUST have 4 categories including Methodologies/Soft Skills.
- CERTIFICATIONS section is REQUIRED. If no certs exist, use relevant coursework.
- Double-check: no unescaped special characters in content text.`;
}


// ═══════════════════════════════════════════════════════════════════
//  ANTHROPIC (Claude Opus 4) — with Extended Thinking
// ═══════════════════════════════════════════════════════════════════

async function rewriteWithAnthropic(apiKey, jobDescription, currentResume) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey });

  console.log('[anthropic] Using claude-opus-4 with extended thinking (10k budget)...');

  const response = await client.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 16000,
    thinking: {
      type: 'enabled',
      budget_tokens: 10000
    },
    messages: [
      { role: 'user', content: getRewriteUserPrompt(jobDescription, currentResume) }
    ],
    system: REWRITE_SYSTEM_PROMPT
  });

  // Extract text from response (skip thinking blocks)
  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock ? textBlock.text : response.content[0].text;
}

async function latexWithAnthropic(apiKey, markdownResume) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 16000,
    thinking: {
      type: 'enabled',
      budget_tokens: 8000
    },
    messages: [
      { role: 'user', content: getLatexUserPrompt(markdownResume) }
    ],
    system: LATEX_SYSTEM_PROMPT
  });

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock ? textBlock.text : response.content[0].text;
}


// ═══════════════════════════════════════════════════════════════════
//  OPENAI (GPT-4.1) — Best flagship model
// ═══════════════════════════════════════════════════════════════════

async function rewriteWithOpenAI(apiKey, jobDescription, currentResume) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey });

  console.log('[openai] Using gpt-4.1 (latest flagship)...');

  const response = await client.chat.completions.create({
    model: 'gpt-4.1',
    max_tokens: 8192,
    temperature: 0.3,
    messages: [
      { role: 'system', content: REWRITE_SYSTEM_PROMPT },
      { role: 'user', content: getRewriteUserPrompt(jobDescription, currentResume) }
    ]
  });

  return response.choices[0].message.content;
}

async function latexWithOpenAI(apiKey, markdownResume) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: 'gpt-4.1',
    max_tokens: 8192,
    temperature: 0.2,
    messages: [
      { role: 'system', content: LATEX_SYSTEM_PROMPT },
      { role: 'user', content: getLatexUserPrompt(markdownResume) }
    ]
  });

  return response.choices[0].message.content;
}


// ═══════════════════════════════════════════════════════════════════
//  GOOGLE GEMINI 2.5 Pro — Best reasoning model
// ═══════════════════════════════════════════════════════════════════

async function rewriteWithGemini(apiKey, jobDescription, currentResume) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);

  console.log('[gemini] Using gemini-2.5-pro with thinking enabled...');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-pro-preview-05-06',
    systemInstruction: REWRITE_SYSTEM_PROMPT
  });

  const result = await model.generateContent({
    contents: [
      { role: 'user', parts: [{ text: getRewriteUserPrompt(jobDescription, currentResume) }] }
    ],
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.3,
      thinkingConfig: {
        thinkingBudget: 8000
      }
    }
  });

  return result.response.text();
}

async function latexWithGemini(apiKey, markdownResume) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-pro-preview-05-06',
    systemInstruction: LATEX_SYSTEM_PROMPT
  });

  const result = await model.generateContent({
    contents: [
      { role: 'user', parts: [{ text: getLatexUserPrompt(markdownResume) }] }
    ],
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.2,
      thinkingConfig: {
        thinkingBudget: 6000
      }
    }
  });

  return result.response.text();
}


// ═══════════════════════════════════════════════════════════════════
//  LaTeX Sanitizer — Post-processes AI output to fix common issues
// ═══════════════════════════════════════════════════════════════════

function sanitizeLatex(latex) {
  let result = latex;

  // Remove markdown code fences if present
  result = result.replace(/^```latex\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```\s*$/m, '');

  // Replace $|$ separators with \textbar{} (the #1 cause of stray $ signs)
  result = result.replace(/\$\s*\|\s*\$/g, '\\textbar{}');

  // Replace $\vcenter{...}$ bullet definitions with \textbullet
  result = result.replace(/\$\\vcenter\{\\hbox\{\\tiny\$\\bullet\$\}\}\$/g, '\\textbullet');

  // Fix any remaining bare $ signs in content text
  // But preserve legitimate LaTeX math environments
  // Split by lines and process each
  const lines = result.split('\n');
  const processedLines = lines.map(line => {
    // Skip preamble commands and macro definitions
    if (line.includes('\\newcommand') || line.includes('\\renewcommand') || 
        line.includes('\\definecolor') || line.includes('\\usepackage') ||
        line.includes('\\documentclass') || line.includes('\\DeclareRobust') ||
        line.includes('\\DeclareText') || line.includes('\\addtolength') ||
        line.includes('\\titleformat')) {
      return line;
    }
    // In content lines, replace bare $ that aren't part of commands
    // Replace $...$ patterns with the content inside (strip the $)
    line = line.replace(/\$([^$\\]+)\$/g, '$1');
    return line;
  });
  result = processedLines.join('\n');

  // Ensure document starts correctly
  if (!result.trimStart().startsWith('\\documentclass')) {
    const docStart = result.indexOf('\\documentclass');
    if (docStart > 0) {
      result = result.substring(docStart);
    }
  }

  // Ensure document ends correctly
  const lastEnd = result.lastIndexOf('\\end{document}');
  if (lastEnd > 0 && lastEnd < result.length - 20) {
    result = result.substring(0, lastEnd + '\\end{document}'.length);
  }

  return result.trim();
}


// ═══════════════════════════════════════════════════════════════════
//  Unified Entry Points
// ═══════════════════════════════════════════════════════════════════

async function rewriteResume(provider, apiKey, jobDescription, currentResume) {
  console.log(`[rewrite] Provider: ${provider}, Resume length: ${currentResume.length}, JD length: ${jobDescription.length}`);

  switch (provider) {
    case 'openai':
      return rewriteWithOpenAI(apiKey, jobDescription, currentResume);
    case 'gemini':
      return rewriteWithGemini(apiKey, jobDescription, currentResume);
    case 'anthropic':
    default:
      return rewriteWithAnthropic(apiKey, jobDescription, currentResume);
  }
}

async function convertToLatex(provider, apiKey, markdownResume) {
  console.log(`[latex] Provider: ${provider}, Resume length: ${markdownResume.length}`);

  let latexCode;

  switch (provider) {
    case 'openai':
      latexCode = await latexWithOpenAI(apiKey, markdownResume);
      break;
    case 'gemini':
      latexCode = await latexWithGemini(apiKey, markdownResume);
      break;
    case 'anthropic':
    default:
      latexCode = await latexWithAnthropic(apiKey, markdownResume);
      break;
  }

  // Sanitize the generated LaTeX
  latexCode = sanitizeLatex(latexCode);

  return latexCode;
}


// ─── Steps 5-9: Overleaf Pipeline ───────────────────────────────
async function overleafPipeline(latexCode, overleafSession, overleafGclb) {
  // Step 5 — Decode credentials
  const SESSION_COOKIE = decodeURIComponent(overleafSession);
  const GCLB_TOKEN = overleafGclb || '';
  
  const cookieString = GCLB_TOKEN 
    ? `overleaf_session2=${SESSION_COOKIE}; GCLB=${GCLB_TOKEN}`
    : `overleaf_session2=${SESSION_COOKIE}`;

  const commonHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Cookie': cookieString
  };

  // Step 6 — Fetch CSRF token
  const projectPageRes = await fetch('https://www.overleaf.com/project', {
    method: 'GET',
    headers: commonHeaders,
    redirect: 'follow'
  });

  if (!projectPageRes.ok) {
    throw new Error(`Failed to connect to Overleaf (HTTP ${projectPageRes.status}). Check your session cookie.`);
  }

  const html = await projectPageRes.text();
  const csrfMatch = html.match(/name="ol-csrfToken"\s+content="([^"]+)"/) ||
                     html.match(/content="([^"]+)"\s+name="ol-csrfToken"/) ||
                     html.match(/"csrfToken"\s*:\s*"([^"]+)"/) ||
                     html.match(/ol-csrfToken.*?content="([^"]+)"/);

  if (!csrfMatch) {
    throw new Error('Overleaf session expired — please refresh your session cookie in the Setup panel.');
  }
  const csrfToken = csrfMatch[1];

  // Step 7 — Create project and upload LaTeX
  const formBody = new URLSearchParams({
    '_csrf': csrfToken,
    'snip': latexCode,
    'engine': 'pdflatex'
  });

  const createRes = await fetch('https://www.overleaf.com/docs', {
    method: 'POST',
    headers: {
      ...commonHeaders,
      'Accept': 'text/html,application/xhtml+xml',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'https://www.overleaf.com/project',
      'Origin': 'https://www.overleaf.com'
    },
    body: formBody.toString(),
    redirect: 'manual'
  });

  const locationHeader = createRes.headers.get('location') || createRes.headers.get('Location') || '';
  
  let projectId;
  const projectIdMatch = locationHeader.match(/\/project\/([a-f0-9]{24})/) ||
                          (createRes.url && createRes.url.match(/\/project\/([a-f0-9]{24})/));

  if (projectIdMatch) {
    projectId = projectIdMatch[1];
  } else {
    const bodyText = await createRes.text().catch(() => '');
    const bodyMatch = bodyText.match(/\/project\/([a-f0-9]{24})/);
    if (bodyMatch) {
      projectId = bodyMatch[1];
    } else {
      throw new Error('Failed to extract Overleaf project ID from redirect. Status: ' + createRes.status);
    }
  }

  const projectUrl = `https://www.overleaf.com/project/${projectId}`;

  // Step 8 — Compile project
  await new Promise(r => setTimeout(r, 2000));

  const compileRes = await fetch(`https://www.overleaf.com/project/${projectId}/compile`, {
    method: 'POST',
    headers: {
      ...commonHeaders,
      'X-Csrf-Token': csrfToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      check: 'silent',
      draft: false,
      stopOnFirstError: false
    })
  });

  if (!compileRes.ok) {
    throw new Error(`Overleaf compilation request failed (HTTP ${compileRes.status}). Open your project to debug: ${projectUrl}`);
  }

  const compileResponse = await compileRes.json();
  console.log('[overleaf] Compile status:', compileResponse.status);
  
  const pdfFile = compileResponse.outputFiles?.find(f => f.path === 'output.pdf');
  if (!pdfFile) {
    console.log('[overleaf] No output.pdf found. Available files:', 
      compileResponse.outputFiles?.map(f => f.path).join(', ') || 'none');
    return {
      projectUrl,
      pdfUrl: null,
      pdfBase64: null,
      compileFailed: true,
      compileStatus: compileResponse.status || 'unknown'
    };
  }

  // Build PDF download URL
  let pdfPath = pdfFile.url;
  if (pdfPath && !pdfPath.includes(`/project/${projectId}`)) {
    const cleanPath = pdfPath.startsWith('/') ? pdfPath : `/${pdfPath}`;
    pdfPath = `/project/${projectId}${cleanPath}`;
  }
  if (!pdfPath && pdfFile.build) {
    pdfPath = `/project/${projectId}/build/${pdfFile.build}/output/output.pdf`;
  }

  const pdfUrl = `https://www.overleaf.com${pdfPath}`;
  console.log('[overleaf] PDF URL:', pdfUrl);

  // Step 9 — Download PDF (with retry)
  let pdfRes = await fetch(pdfUrl, { headers: commonHeaders });

  if (pdfRes.status === 404) {
    console.log('[overleaf] Primary URL returned 404, trying alternatives...');
    
    const altUrl1 = `https://www.overleaf.com${pdfFile.url}`;
    if (altUrl1 !== pdfUrl) {
      pdfRes = await fetch(altUrl1, { headers: commonHeaders });
    }
    if (pdfRes.status === 404) {
      const altUrl2 = `https://www.overleaf.com/project/${projectId}/output/output.pdf`;
      pdfRes = await fetch(altUrl2, { headers: commonHeaders });
    }
    if (pdfRes.status === 404) {
      const altUrl3 = `https://www.overleaf.com/project/${projectId}/compile/pdf`;
      pdfRes = await fetch(altUrl3, { headers: commonHeaders });
    }
  }

  if (!pdfRes.ok) {
    console.log('[overleaf] All PDF download attempts failed. Returning partial result.');
    return {
      projectUrl,
      pdfUrl,
      pdfBase64: null,
      compileFailed: false,
      downloadFailed: true
    };
  }

  const pdfBuffer = await pdfRes.arrayBuffer();
  const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

  return {
    projectUrl,
    pdfUrl,
    pdfBase64,
    compileFailed: false
  };
}

module.exports = {
  computeATSScore,
  rewriteResume,
  convertToLatex,
  overleafPipeline
};
