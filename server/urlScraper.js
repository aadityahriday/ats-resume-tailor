/**
 * Job Description URL Scraper
 * Scrapes job descriptions from LinkedIn, Indeed, Greenhouse, Lever, and other job boards
 */

const cheerio = require('cheerio');

/**
 * Extract job description from a URL
 * @param {string} url - Job posting URL
 * @returns {Promise<{success: boolean, text?: string, error?: string}>}
 */
async function scrapeJobDescription(url) {
  try {
    // Validate URL
    const urlObj = new URL(url);
    
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    let jobDescription = '';

    // LinkedIn
    if (url.includes('linkedin.com')) {
      jobDescription = extractLinkedInDescription($);
    }
    // Indeed
    else if (url.includes('indeed.com')) {
      jobDescription = extractIndeedDescription($);
    }
    // Greenhouse
    else if (url.includes('greenhouse.io')) {
      jobDescription = extractGreenhouseDescription($);
    }
    // Lever
    else if (url.includes('lever.co')) {
      jobDescription = extractLeverDescription($);
    }
    // Workday
    else if (url.includes('myworkdayjobs.com')) {
      jobDescription = extractWorkdayDescription($);
    }
    // Generic fallback
    else {
      jobDescription = extractGenericDescription($);
    }

    // Clean up the extracted text
    jobDescription = jobDescription
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    if (!jobDescription || jobDescription.length < 100) {
      return {
        success: false,
        error: 'Could not extract job description from this URL. Please copy-paste the text directly.',
      };
    }

    return { success: true, text: jobDescription };
  } catch (error) {
    console.error('[urlScraper] Error:', error.message);
    return {
      success: false,
      error: `Failed to scrape URL: ${error.message}. Please copy-paste the job description directly.`,
    };
  }
}

function extractLinkedInDescription($) {
  // LinkedIn uses various selectors for job descriptions
  const selectors = [
    '.show-more-less-html__markup',
    '.description__text',
    '[class*="description"]',
    '#job-details',
  ];

  for (const selector of selectors) {
    const text = $(selector).text();
    if (text && text.length > 100) {
      return text;
    }
  }

  // Fallback: get all text from main content area
  return $('.jobs-description__content, .job-description').text() || '';
}

function extractIndeedDescription($) {
  const selectors = [
    '#jobDescriptionText',
    '.job-description',
    '#jobDescription',
    '[class*="jobDescription"]',
  ];

  for (const selector of selectors) {
    const text = $(selector).text();
    if (text && text.length > 100) {
      return text;
    }
  }

  return $('.jobsearch-jobDescriptionText').text() || '';
}

function extractGreenhouseDescription($) {
  const selectors = [
    '#content',
    '.content',
    '.job-description',
    '[class*="description"]',
  ];

  for (const selector of selectors) {
    const text = $(selector).text();
    if (text && text.length > 100) {
      return text;
    }
  }

  return '';
}

function extractLeverDescription($) {
  const selectors = [
    '.section',
    '.description',
    '[class*="description"]',
    '.posting-description',
  ];

  for (const selector of selectors) {
    const text = $(selector).text();
    if (text && text.length > 100) {
      return text;
    }
  }

  return '';
}

function extractWorkdayDescription($) {
  const selectors = [
    '[data-automation-id="jobDescription"]',
    '.job-description',
    '.description',
    '[class*="description"]',
  ];

  for (const selector of selectors) {
    const text = $(selector).text();
    if (text && text.length > 100) {
      return text;
    }
  }

  return '';
}

function extractGenericDescription($) {
  // Try common patterns for job descriptions
  const selectors = [
    '[class*="job"][class*="description"]',
    '[class*="description"][class*="job"]',
    '.job-description',
    '.description',
    '#description',
    'article',
    'main',
  ];

  for (const selector of selectors) {
    const text = $(selector).text();
    if (text && text.length > 200) {
      return text;
    }
  }

  // Last resort: get body text but filter out navigation/footer
  $('nav, footer, header, .nav, .footer, .header').remove();
  return $('body').text();
}

module.exports = { scrapeJobDescription };
