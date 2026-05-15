/**
 * Build a Blob + object URL from a base64-encoded PDF.
 *
 * Tolerates accidental `data:application/pdf;base64,` prefixes and stray
 * whitespace from JSON pretty-printing.  Throws a friendly error if the
 * payload is missing, malformed, or empty.
 */
export function buildPdfBlobUrl(base64) {
  if (!base64 || typeof base64 !== 'string') {
    throw new Error('No PDF data available to download.')
  }

  const clean = base64
    .replace(/^data:application\/pdf;base64,/, '')
    .replace(/\s+/g, '')

  let bytes
  try {
    const binary = atob(clean)
    bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  } catch {
    throw new Error('PDF data is corrupted (invalid base64). Please regenerate.')
  }

  const blob = new Blob([bytes], { type: 'application/pdf' })
  if (blob.size === 0) {
    throw new Error('PDF is empty (0 bytes). Please regenerate.')
  }

  const url = URL.createObjectURL(blob)
  // Auto-revoke after 5 minutes so the URL stays valid long enough for both
  // the download AND a follow-up "Open in new tab" click from the toast,
  // without leaking forever.
  setTimeout(() => URL.revokeObjectURL(url), 5 * 60 * 1000)

  console.info(
    `[downloadPdf] blob ready — size=${blob.size}b, base64.length=${clean.length}, url=${url}`
  )
  return { url, blob }
}

/**
 * Trigger a PDF download from a base64 string.
 *
 * Returns the underlying blob URL so the caller can offer an
 * "Open in new tab" fallback (e.g. as a sonner toast action) — useful
 * because some browser configurations silently drop programmatic
 * `a.click()` events even though the JS code reports success.
 *
 * @param {string} base64       Pure base64 (no data: prefix, but tolerated)
 * @param {string} [filename]   File name shown in the save-as dialog
 * @returns {{ url: string, blob: Blob }}
 * @throws {Error}              If the base64 is missing or malformed
 */
export function downloadPdfFromBase64(base64, filename = 'tailored_resume.pdf') {
  const { url, blob } = buildPdfBlobUrl(base64)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  // Keep the anchor in the visual tree at off-screen position — fully
  // hidden anchors (display:none) get filtered out by some Chromium
  // download policies and the click is silently swallowed.
  a.style.position = 'fixed'
  a.style.top = '-9999px'
  a.style.left = '-9999px'
  document.body.appendChild(a)
  a.click()

  // Defer anchor cleanup so the browser actually has time to fetch the
  // blob URL before we tear the DOM node down.
  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a)
  }, 5000)

  console.info(`[downloadPdf] click dispatched — filename="${filename}", size=${blob.size}b`)
  return { url, blob }
}
