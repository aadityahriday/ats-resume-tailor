/**
 * Word-level diff using LCS (Longest Common Subsequence) algorithm.
 * Returns segments for rendering side-by-side diffs.
 */

function lcs(a, b) {
  const m = a.length;
  const n = b.length;
  
  // Optimize for large inputs: if too large, use simplified approach
  if (m * n > 1000000) {
    return simplifiedDiff(a, b);
  }
  
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find the LCS
  const result = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift({ text: a[i - 1], type: 'same' });
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result;
}

function simplifiedDiff(a, b) {
  // For very large inputs, use a simpler line-by-line approach
  const aSet = new Set(a);
  const bSet = new Set(b);
  const common = a.filter(w => bSet.has(w));
  return common.map(w => ({ text: w, type: 'same' }));
}

export function computeWordDiff(original, updated) {
  const origWords = original.split(/(\s+)/).filter(w => w.length > 0);
  const updWords = updated.split(/(\s+)/).filter(w => w.length > 0);

  const commonWords = lcs(origWords, updWords);
  const commonSet = new Set(commonWords.map(w => w.text));

  // Build left panel (original with removed words marked)
  const leftSegments = [];
  let commonIdx = 0;
  for (const word of origWords) {
    if (commonIdx < commonWords.length && word === commonWords[commonIdx].text) {
      leftSegments.push({ text: word, type: 'same' });
      commonIdx++;
    } else {
      leftSegments.push({ text: word, type: 'removed' });
    }
  }

  // Build right panel (updated with added words marked)
  const rightSegments = [];
  commonIdx = 0;
  for (const word of updWords) {
    if (commonIdx < commonWords.length && word === commonWords[commonIdx].text) {
      rightSegments.push({ text: word, type: 'same' });
      commonIdx++;
    } else {
      rightSegments.push({ text: word, type: 'added' });
    }
  }

  return { leftSegments, rightSegments };
}
