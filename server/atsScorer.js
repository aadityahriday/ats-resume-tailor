/**
 * Advanced Deterministic ATS Resume Scorer
 * 
 * Features:
 * - Weighted Keyword Extraction (Approximated TF-IDF based on frequency & casing)
 * - Frequency Density Matching (Rewards multiple occurrences of core skills)
 * - Contextual Bullet Analysis (Action verbs at start of bullets, STAR method approximation)
 * - Readability & Buzzword Penalties (Penalizes cliches, checks optimal bullet length)
 * - Comprehensive Section & Contact parsing
 */

// ─── Dictionaries ──────────────────────────────────────────────────
const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','as','is','was','are','were',
  'be','been','being','have','has','had','do','does','did','will','would','shall','should','may','might','must',
  'can','could','about','above','after','again','against','all','am','any','because','before','below','between',
  'both','during','each','few','further','get','got','he','her','here','hers','herself','him','himself','his',
  'how','i','if','into','it','its','itself','just','me','more','most','my','myself','no','nor','not','now','off',
  'once','only','other','our','ours','ourselves','out','over','own','per','same','she','so','some','such','than',
  'that','their','theirs','them','themselves','then','there','these','they','this','those','through','too','under',
  'until','up','upon','us','very','we','what','when','where','which','while','who','whom','why','you','your',
  'yours','yourself','yourselves','also','etc','ie','eg','vs','via','re','experience','role','team','company',
  'job','position','responsibilities','requirements','qualifications','preferred','required','including','strong',
  'excellent','ability','knowledge','understanding','minimum','plus','bonus','ideally','proficiency','ensure',
  'support','provide','related','relevant','equivalent','demonstrate','demonstrated','opportunity','join','looking',
  'seek','seeking','ideal','candidate','apply','application','equal','employer','years','year','work','working',
  'works','world','new','need','needs','help','good','great','small','large','high','low','fast'
]);

const BUZZWORDS = [
  'hard worker', 'team player', 'detail-oriented', 'think outside the box', 'synergy', 'go-getter',
  'results-driven', 'bottom line', 'thought leader', 'dynamic', 'proactive', 'self-starter', 'visionary',
  'innovative', 'motivated', 'passionate', 'track record', 'guru', 'ninja', 'rockstar',
  'references available', 'objective:', 'responsible for', 'duties included', 'helped with'
];

const ACTION_VERBS = new Set([
  'led','built','designed','developed','implemented','optimized','delivered','managed','launched','improved',
  'increased','reduced','created','architected','automated','collaborated','mentored','drove','owned','scaled',
  'deployed','integrated','migrated','analyzed','spearheaded','engineered','orchestrated','streamlined',
  'established','executed','transformed','configured','maintained','resolved','enhanced','accelerated','pioneered',
  'consolidated','formulated','initiated','navigated','negotiated','revamped','standardized','upgraded','yielded',
  'maximized','minimized','forecasted','audited','budgeted','calculated','conceptualized','directed','facilitated',
  'guided','hired','trained','supervised','programmed','tested','troubleshot','visualized','synthesized'
]);

const REQUIRED_SECTIONS = ['summary', 'education', 'experience', 'skills'];
const OPTIONAL_SECTIONS = ['projects', 'certifications', 'achievements', 'publications', 'volunteer'];

// ─── Core NLP Helpers ──────────────────────────────────────────────
function cleanAndTokenize(text) {
  return text
    .replace(/[^a-zA-Z0-9+#.\-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1);
}

function getNGrams(tokens, n) {
  const grams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    grams.push(tokens.slice(i, i + n).join(' '));
  }
  return grams;
}

// ─── Dimension 1: Role & Keyword Alignment (35 pts) ────────────────
function scoreKeywordAlignment(resumeText, jdText) {
  // 1. Extract proper nouns and technical terms from JD (casing heuristic)
  const jdWords = jdText.split(/\s+/);
  const techTerms = new Set();
  
  for (let i = 1; i < jdWords.length; i++) {
    const word = jdWords[i].replace(/[^a-zA-Z0-9+#.\-]/g, '');
    // If it's capitalized but not at the start of a sentence, it's likely a proper noun/tech term
    if (/^[A-Z][a-z0-9+#.\-]+$/.test(word) && !/[.!?]\s*$/.test(jdWords[i-1])) {
      if (!STOPWORDS.has(word.toLowerCase())) techTerms.add(word.toLowerCase());
    }
    // Also catch fully uppercase acronyms (e.g., API, AWS, SQL)
    if (/^[A-Z]{2,}$/.test(word)) {
      techTerms.add(word.toLowerCase());
    }
  }

  // 2. Standard tokenization & frequency
  const jdTokens = cleanAndTokenize(jdText.toLowerCase()).filter(t => !STOPWORDS.has(t));
  const resumeTokens = cleanAndTokenize(resumeText.toLowerCase()).filter(t => !STOPWORDS.has(t));
  
  const jdFreq = {};
  jdTokens.forEach(t => jdFreq[t] = (jdFreq[t] || 0) + 1);
  
  const resumeFreq = {};
  resumeTokens.forEach(t => resumeFreq[t] = (resumeFreq[t] || 0) + 1);

  // 3. Weighting system
  let totalJdWeight = 0;
  let matchedWeight = 0;
  
  const jdUnique = Object.keys(jdFreq);
  const missingKeywords = [];
  const matchedKeywords = [];

  for (const token of jdUnique) {
    // Base weight by frequency
    let weight = jdFreq[token];
    // Boost if it's identified as a tech term/acronym
    if (techTerms.has(token)) weight *= 2.5;
    // Cap weight to prevent keyword stuffing skew
    weight = Math.min(weight, 10);
    
    totalJdWeight += weight;
    
    if (resumeFreq[token]) {
      // Density matching: reward if resume mentions it roughly proportionally
      const densityScore = Math.min(resumeFreq[token], jdFreq[token]) / jdFreq[token];
      matchedWeight += weight * (0.5 + (0.5 * densityScore));
      matchedKeywords.push(token);
    } else {
      missingKeywords.push({ word: token, weight });
    }
  }

  // 4. Bigrams (Phrases)
  const jdBigrams = getNGrams(jdTokens, 2);
  const jdBigramFreq = {};
  jdBigrams.forEach(b => jdBigramFreq[b] = (jdBigramFreq[b] || 0) + 1);
  
  const resumeTextLower = resumeText.toLowerCase();
  
  for (const [bigram, freq] of Object.entries(jdBigramFreq)) {
    if (freq > 1) { // Only care about repeating phrases
      let weight = freq * 1.5;
      totalJdWeight += weight;
      if (resumeTextLower.includes(bigram)) {
        matchedWeight += weight;
        matchedKeywords.push(bigram);
      } else {
        missingKeywords.push({ word: bigram, weight });
      }
    }
  }

  const scoreRatio = totalJdWeight > 0 ? matchedWeight / totalJdWeight : 0;
  // Apply exponential decay for strict ATS scoring (humans usually get 30-50%, AI gets 85%+)
  const harshRatio = Math.pow(scoreRatio, 1.4);
  const score = Math.round(harshRatio * 35);
  
  missingKeywords.sort((a, b) => b.weight - a.weight);

  return {
    score: Math.min(35, score),
    max: 35,
    matchedCount: matchedKeywords.length,
    missingKeywords: missingKeywords.slice(0, 10).map(k => k.word),
    matchedKeywords: [...new Set(matchedKeywords)]
  };
}

// ─── Dimension 2: Experience & Impact (25 pts) ─────────────────────
function scoreExperienceImpact(resumeText) {
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const bulletLines = lines.filter(l => /^\s*[-•*▪▸→]\s/.test(l));
  
  let actionVerbStarts = 0;
  let quantifiedBullets = 0;
  let starBullets = 0;

  const numberPattern = /\b\d+(?:[.,]\d+)?%?|\b(?:million|billion|thousand|hundred)\b/i;
  const impactPattern = /\b(reduced|increased|saved|generated|improved|achieved|delivered|accelerated|grew|maximized)\b/i;

  for (const bullet of bulletLines) {
    const text = bullet.replace(/^\s*[-•*▪▸→]\s/, '').trim();
    if (!text) continue;

    const firstWord = text.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
    let hasActionStart = false;
    
    if (ACTION_VERBS.has(firstWord)) {
      actionVerbStarts++;
      hasActionStart = true;
    }

    const hasNumber = numberPattern.test(text);
    const hasImpact = impactPattern.test(text);

    if (hasNumber) quantifiedBullets++;
    if (hasActionStart && hasNumber && hasImpact) starBullets++;
  }

  const totalBullets = Math.max(bulletLines.length, 1);
  
  // Scoring logic
  let score = 0;
  // Up to 10 points for bullets starting with action verbs (target: >90%)
  const actionVerbRatio = actionVerbStarts / totalBullets;
  score += Math.min(10, Math.pow(actionVerbRatio / 0.9, 1.2) * 10);
  
  // Up to 10 points for quantification (target: >60%)
  const quantifiedRatio = quantifiedBullets / totalBullets;
  score += Math.min(10, Math.pow(quantifiedRatio / 0.6, 1.2) * 10);

  // Up to 5 points for STAR method (Action + Number + Impact) (target: >30%)
  const starRatio = starBullets / totalBullets;
  score += Math.min(5, Math.pow(starRatio / 0.3, 1.2) * 5);

  return {
    score: Math.round(score),
    max: 25,
    bulletCount: totalBullets,
    actionVerbStarts,
    quantifiedBullets,
    starBullets
  };
}

// ─── Dimension 3: Readability & Buzzwords (15 pts) ─────────────────
function scoreReadability(resumeText) {
  const textLower = resumeText.toLowerCase();
  
  // 1. Penalize Buzzwords & Cliches (max -8 points)
  let buzzwordsFound = [];
  for (const buzz of BUZZWORDS) {
    if (textLower.includes(buzz)) buzzwordsFound.push(buzz);
  }
  // Penalize heavier for multiple buzzwords (2 points per buzzword)
  const buzzwordPenalty = Math.min(8, buzzwordsFound.length * 2);
  
  // 2. Bullet Length Optimization (target: 15-25 words per bullet)
  const bulletLines = resumeText.split('\n').filter(l => /^\s*[-•*▪▸→]\s/.test(l));
  let optimalBullets = 0;
  
  for (const bullet of bulletLines) {
    const wordCount = bullet.split(/\s+/).length;
    if (wordCount >= 10 && wordCount <= 35) optimalBullets++;
  }
  
  const totalBullets = Math.max(bulletLines.length, 1);
  const optimalRatio = optimalBullets / totalBullets;
  const lengthScore = Math.min(10, (optimalRatio / 0.8) * 10); // 10 pts max

  // 3. Word Count Boundary (5 pts)
  const totalWords = resumeText.split(/\s+/).length;
  let wordCountScore = 0;
  if (totalWords >= 300 && totalWords <= 800) wordCountScore = 5;
  else if (totalWords > 800 && totalWords <= 1200) wordCountScore = 3;

  let score = lengthScore + wordCountScore - buzzwordPenalty;

  return {
    score: Math.max(0, Math.round(score)),
    max: 15,
    buzzwordsFound,
    optimalBullets,
    totalWords
  };
}

// ─── Dimension 4: Structure & Parseability (15 pts) ────────────────
function scoreStructure(resumeText) {
  const foundReq = [];
  const foundOpt = [];

  for (const section of REQUIRED_SECTIONS) {
    const pattern = new RegExp(`(?:^|\\n)\\s*(?:#+\\s*)?\\b${section}\\b\\s*(?:$|\\n|:)`, 'i');
    if (pattern.test(resumeText)) foundReq.push(section);
  }

  for (const section of OPTIONAL_SECTIONS) {
    const pattern = new RegExp(`(?:^|\\n)\\s*(?:#+\\s*)?\\b${section}\\b\\s*(?:$|\\n|:)`, 'i');
    if (pattern.test(resumeText)) foundOpt.push(section);
  }

  let score = 0;
  // 10 points for required sections (strict penalty for missing sections)
  const reqRatio = foundReq.length / REQUIRED_SECTIONS.length;
  score += Math.round(Math.pow(reqRatio, 1.5) * 10);
  
  // 5 points for having at least one optional section (shows depth)
  if (foundOpt.length > 0) score += 5;

  return {
    score: Math.min(15, score),
    max: 15,
    foundRequired: foundReq,
    missingRequired: REQUIRED_SECTIONS.filter(s => !foundReq.includes(s)),
    foundOptional: foundOpt
  };
}

// ─── Dimension 5: Core Requirements (10 pts) ───────────────────────
function scoreCoreRequirements(resumeText) {
  let score = 0;
  
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,15}/.test(resumeText);
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);
  
  // Higher Ed signals
  const hasDegree = /\b(B\.?S\.?|B\.?A\.?|M\.?S\.?|Ph\.?D\.?|Bachelor|Master|Doctorate|Degree)\b/i.test(resumeText);

  if (hasEmail) score += 3;
  if (hasPhone) score += 3;
  if (hasLinkedIn) score += 2;
  if (hasDegree) score += 2;

  return {
    score: Math.min(10, score),
    max: 10,
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasDegree
  };
}

// ─── Main Export ───────────────────────────────────────────────────
function computeATSScore(resumeText, jdText) {
  const alignment = scoreKeywordAlignment(resumeText, jdText);
  const impact = scoreExperienceImpact(resumeText);
  const readability = scoreReadability(resumeText);
  const structure = scoreStructure(resumeText);
  const core = scoreCoreRequirements(resumeText);

  const total = alignment.score + impact.score + readability.score + structure.score + core.score;

  return {
    total: Math.min(100, Math.max(0, total)),
    breakdown: {
      keywordMatch: {
        score: alignment.score,
        max: alignment.max,
        matchedCount: alignment.matchedCount
      },
      quantifiedAchievements: {
        score: impact.score,
        max: impact.max,
        count: impact.quantifiedBullets
      },
      actionVerbs: {
        score: Math.round(impact.score * 0.4), // Derived from impact score for backwards compatibility in UI
        max: 10,
        found: impact.actionVerbStarts
      },
      sectionHeaders: {
        score: structure.score,
        max: structure.max,
        missing: structure.missingRequired
      },
      contactInfo: {
        score: core.score,
        max: core.max
      },
      formatting: {
        score: readability.score,
        max: readability.max
      }
    },
    topMissingKeywords: alignment.missingKeywords,
    matchedKeywords: alignment.matchedKeywords,
    metrics: {
      actionVerbStarts: impact.actionVerbStarts,
      starBullets: impact.starBullets,
      buzzwordsFound: readability.buzzwordsFound
    }
  };
}

module.exports = { computeATSScore };
