import DOMPurify from 'dompurify';

// Strip scripts, event handlers, and any active content from HTML returned by
// the Hacker News API before rendering it via dangerouslySetInnerHTML.
export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
