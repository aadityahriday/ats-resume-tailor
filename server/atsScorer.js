/**
 * ATS Resume Scorer — Pure Deterministic Algorithm
 * Zero AI involvement. Zero randomness. Same inputs always return same score.
 * Score out of 100 across 6 weighted dimensions.
 */

// ─── Stopwords ───────────────────────────────────────────────────
const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','as','is','was','are','were','be','been','being','have',
  'has','had','do','does','did','will','would','shall','should','may',
  'might','must','can','could','about','above','after','again','against',
  'all','am','any','because','before','below','between','both','during',
  'each','few','further','get','got','he','her','here','hers','herself',
  'him','himself','his','how','i','if','into','it','its','itself','just',
  'me','more','most','my','myself','no','nor','not','now','off','once',
  'only','other','our','ours','ourselves','out','over','own','per','same',
  'she','so','some','such','than','that','their','theirs','them',
  'themselves','then','there','these','they','this','those','through',
  'too','under','until','up','upon','us','very','we','what','when',
  'where','which','while','who','whom','why','you','your','yours',
  'yourself','yourselves','also','etc','ie','eg','vs','via','re',
  'able','across','along','already','although','among','another',
  'around','away','back','become','becomes','became','behind','beside',
  'besides','beyond','come','comes','came','could','done','down','else',
  'enough','even','every','everything','far','find','first','go','goes',
  'going','gone','good','great','help','however','keep','keeps','kept',
  'know','known','last','least','less','let','like','likely','long',
  'look','looking','looks','make','makes','making','many','may','might',
  'much','need','needs','never','new','next','nothing','often','old',
  'one','ones','open','part','perhaps','put','quite','rather','really',
  'right','said','say','says','see','seen','seem','seems','set','show',
  'shows','since','small','something','still','take','takes','taking',
  'tell','thing','things','think','thought','three','time','today',
  'together','told','took','toward','towards','try','turn','two',
  'use','used','using','want','wants','way','well','went','whether',
  'within','without','work','working','works','world','would','year',
  'years','yet','experience','role','team','company','job','position',
  'responsibilities','requirements','qualifications','preferred',
  'required','including','strong','excellent','ability','knowledge',
  'understanding','minimum','plus','bonus','ideally','proficiency',
  'ensure','support','provide','related','relevant','equivalent',
  'demonstrate','demonstrated','opportunity','join','looking','seek',
  'seeking','ideal','candidate','apply','application','equal','employer'
]);

// ─── Action Verbs ────────────────────────────────────────────────
const ACTION_VERBS = [
  'led','built','designed','developed','implemented','optimized',
  'delivered','managed','launched','improved','increased','reduced',
  'created','architected','automated','collaborated','mentored',
  'drove','owned','scaled','deployed','integrated','migrated',
  'analyzed','spearheaded','engineered','orchestrated','streamlined',
  'established','executed','transformed','configured','maintained',
  'resolved','enhanced','accelerated','pioneered','consolidated'
];

// ─── Section Headers ─────────────────────────────────────────────
const REQUIRED_SECTIONS = [
  'summary','education','experience','skills','projects','certifications','achievements'
];

// ─── Impact Words for Quantified Achievements ────────────────────
const IMPACT_WORDS = [
  '%','percent','users','revenue','growth','reduced','increased',
  'faster','customers','members','projects','improved','saved',
  'generated','achieved','delivered','clients','transactions',
  'requests','downloads','efficiency','performance','uptime',
  'accuracy','conversion','retention','engagement','traffic',
  'roi','profit','cost','budget','million','billion','thousand'
];

// ─── Helpers ─────────────────────────────────────────────────────
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#+\-/.]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1);
}

function removeStopwords(tokens) {
  return tokens.filter(t => !STOPWORDS.has(t));
}

function getNGrams(tokens, n) {
  const grams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    grams.push(tokens.slice(i, i + n).join(' '));
  }
  return grams;
}

function getFrequencyMap(arr) {
  const map = {};
  for (const item of arr) {
    map[item] = (map[item] || 0) + 1;
  }
  return map;
}

// ─── Dimension 1: Keyword Match (40 pts) ─────────────────────────
function scoreKeywordMatch(resumeText, jdText) {
  const jdTokens = removeStopwords(tokenize(jdText));
  const resumeTokens = removeStopwords(tokenize(resumeText));

  const resumeTextLower = resumeText.toLowerCase();

  // Single keywords from JD
  const jdUniqueKeywords = [...new Set(jdTokens)];
  const jdFreq = getFrequencyMap(jdTokens);

  // 2-grams and 3-grams from JD
  const jdBigrams = [...new Set(getNGrams(jdTokens, 2))];
  const jdTrigrams = [...new Set(getNGrams(jdTokens, 3))];
  const jdPhrases = [...new Set([...jdBigrams, ...jdTrigrams])];

  // Count keyword matches
  const resumeSet = new Set(resumeTokens);
  const matchedKeywords = jdUniqueKeywords.filter(k => resumeSet.has(k));
  const missingKeywords = jdUniqueKeywords.filter(k => !resumeSet.has(k));

  // Count phrase matches
  const matchedPhrases = jdPhrases.filter(p => resumeTextLower.includes(p));
  const missingPhrases = jdPhrases.filter(p => !resumeTextLower.includes(p));

  // Score calculation
  const keywordRatio = jdUniqueKeywords.length > 0
    ? matchedKeywords.length / jdUniqueKeywords.length
    : 0;
  const phraseRatio = jdPhrases.length > 0
    ? matchedPhrases.length / jdPhrases.length
    : 0;

  const keywordScore = Math.round(keywordRatio * 30);
  const phraseScore = Math.round(phraseRatio * 10);
  const totalScore = Math.min(40, keywordScore + phraseScore);

  // Sort missing keywords by JD frequency (most important first)
  missingKeywords.sort((a, b) => (jdFreq[b] || 0) - (jdFreq[a] || 0));

  return {
    score: totalScore,
    max: 40,
    matchedCount: matchedKeywords.length + matchedPhrases.length,
    totalKeywords: jdUniqueKeywords.length + jdPhrases.length,
    matchedKeywords: [...matchedKeywords, ...matchedPhrases],
    missingKeywords: missingKeywords.slice(0, 10),
    missingPhrases: missingPhrases.slice(0, 5)
  };
}

// ─── Dimension 2: Section Headers (15 pts) ───────────────────────
function scoreSectionHeaders(resumeText) {
  const found = [];
  const missing = [];

  for (const section of REQUIRED_SECTIONS) {
    // For 'certifications', also accept 'coursework' as equivalent
    const terms = section === 'certifications'
      ? [section, 'certification', 'coursework', 'courses']
      : [section];

    let matched = false;
    for (let t = 0; t < terms.length; t++) {
      const term = terms[t];
      const patterns = [
        new RegExp('^\\\\s*#+\\\\s*' + term, 'mi'),
        new RegExp('^\\\\s*' + term + '\\\\s*$', 'mi'),
        new RegExp('^\\\\s*' + term + '\\\\s*:', 'mi'),
        new RegExp('\\\\b' + term + '\\\\b', 'i'),
        new RegExp('^\\\\s*\\\\*\\\\*' + term + '\\\\*\\\\*', 'mi'),
        new RegExp('\\\\\\\\section\\\\{' + term + '\\\\}', 'i')
      ];
      for (let p = 0; p < patterns.length; p++) {
        if (patterns[p].test(resumeText)) {
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    if (matched) {
      found.push(section);
    } else {
      missing.push(section);
    }
  }

  const score = Math.round((found.length / REQUIRED_SECTIONS.length) * 15);

  return {
    score,
    max: 15,
    found,
    missing
  };
}

// ─── Dimension 3: Quantified Achievements (15 pts) ──────────────
function scoreQuantifiedAchievements(resumeText) {
  const lines = resumeText.split('\n');
  let count = 0;

  const numberPattern = /\d+/;

  for (const line of lines) {
    if (numberPattern.test(line)) {
      // Check if line has a number paired with impact word
      const lineLC = line.toLowerCase();
      const hasImpactWord = IMPACT_WORDS.some(w => lineLC.includes(w));
      const hasNumber = /\d+/.test(line);
      
      if (hasNumber && hasImpactWord) {
        count++;
      }
    }
  }

  // 3 points per quantified achievement, max 15
  const score = Math.min(15, count * 3);

  return {
    score,
    max: 15,
    count
  };
}

// ─── Dimension 4: Action Verbs (10 pts) ──────────────────────────
function scoreActionVerbs(resumeText) {
  const textLower = resumeText.toLowerCase();
  const found = [];

  for (const verb of ACTION_VERBS) {
    const pattern = new RegExp(`\\b${verb}\\b`, 'i');
    if (pattern.test(textLower)) {
      found.push(verb);
    }
  }

  const score = Math.round((found.length / ACTION_VERBS.length) * 10);

  return {
    score: Math.min(10, score),
    max: 10,
    found
  };
}

// ─── Dimension 5: Contact Completeness (10 pts) ─────────────────
function scoreContactInfo(resumeText) {
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);
  const hasGitHub = /github\.com/i.test(resumeText);
  
  // Location detection: City, State patterns or common location indicators
  const hasLocation = /\b[A-Z][a-z]+,?\s*[A-Z]{2}\b/.test(resumeText) ||
    /\b(address|location|city|state)\b/i.test(resumeText) ||
    /\b\d{5}(-\d{4})?\b/.test(resumeText); // ZIP code

  let score = 0;
  if (hasEmail) score += 3;
  if (hasPhone) score += 2;
  if (hasLinkedIn) score += 2;
  if (hasGitHub) score += 2;
  if (hasLocation) score += 1;

  return {
    score: Math.min(10, score),
    max: 10,
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasGitHub,
    hasLocation
  };
}

// ─── Dimension 6: Formatting Signals (10 pts) ───────────────────
function scoreFormatting(resumeText) {
  const lines = resumeText.split('\n');
  
  // Bullet count
  const bulletLines = lines.filter(l => /^\s*[-•*▪▸→]\s/.test(l) || /^\s*\d+\.\s/.test(l));
  const hasSufficientBullets = bulletLines.length >= 5;

  // Word count
  const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;
  const goodWordCount = wordCount >= 300 && wordCount <= 800;

  // Date format consistency (Mon YYYY)
  const datePattern = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/gi;
  const dateMatches = resumeText.match(datePattern) || [];
  const hasConsistentDates = dateMatches.length >= 2;

  let score = 0;
  if (hasSufficientBullets) score += 4;
  if (goodWordCount) score += 3;
  if (hasConsistentDates) score += 3;

  return {
    score: Math.min(10, score),
    max: 10,
    bulletCount: bulletLines.length,
    wordCount,
    dateFormatsFound: dateMatches.length,
    hasSufficientBullets,
    goodWordCount,
    hasConsistentDates
  };
}

// ─── Main Export ─────────────────────────────────────────────────
function computeATSScore(resumeText, jdText) {
  const keywordMatch = scoreKeywordMatch(resumeText, jdText);
  const sectionHeaders = scoreSectionHeaders(resumeText);
  const quantifiedAchievements = scoreQuantifiedAchievements(resumeText);
  const actionVerbs = scoreActionVerbs(resumeText);
  const contactInfo = scoreContactInfo(resumeText);
  const formatting = scoreFormatting(resumeText);

  const total = keywordMatch.score +
    sectionHeaders.score +
    quantifiedAchievements.score +
    actionVerbs.score +
    contactInfo.score +
    formatting.score;

  return {
    total: Math.min(100, total),
    breakdown: {
      keywordMatch: {
        score: keywordMatch.score,
        max: keywordMatch.max,
        matchedCount: keywordMatch.matchedCount,
        totalKeywords: keywordMatch.totalKeywords
      },
      sectionHeaders: {
        score: sectionHeaders.score,
        max: sectionHeaders.max,
        found: sectionHeaders.found,
        missing: sectionHeaders.missing
      },
      quantifiedAchievements: {
        score: quantifiedAchievements.score,
        max: quantifiedAchievements.max,
        count: quantifiedAchievements.count
      },
      actionVerbs: {
        score: actionVerbs.score,
        max: actionVerbs.max,
        found: actionVerbs.found
      },
      contactInfo: {
        score: contactInfo.score,
        max: contactInfo.max,
        hasEmail: contactInfo.hasEmail,
        hasPhone: contactInfo.hasPhone,
        hasLinkedIn: contactInfo.hasLinkedIn,
        hasGitHub: contactInfo.hasGitHub,
        hasLocation: contactInfo.hasLocation
      },
      formatting: {
        score: formatting.score,
        max: formatting.max
      }
    },
    topMissingKeywords: keywordMatch.missingKeywords,
    matchedKeywords: keywordMatch.matchedKeywords
  };
}

module.exports = { computeATSScore };
