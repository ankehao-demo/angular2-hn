/**
 * Lightweight HTML sanitizer that mirrors Angular's DomSanitizer behavior.
 * Strips <script> tags, event handler attributes (onclick, onerror, etc.),
 * and javascript: URLs to prevent XSS when rendering user-provided HTML.
 *
 * For production use, consider replacing with DOMPurify for more thorough sanitization.
 */
export function sanitizeHtml(html: string): string {
    if (!html) {
        return '';
    }

    let sanitized = html;

    // Remove <script> tags and their contents
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handler attributes (on*)
    sanitized = sanitized.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

    // Remove javascript: URLs in href/src attributes
    sanitized = sanitized.replace(/(href|src)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '$1=""');

    return sanitized;
}
