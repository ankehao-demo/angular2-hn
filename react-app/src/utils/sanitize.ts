import DOMPurify from 'dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['a', 'p', 'i', 'b', 'em', 'strong', 'code', 'pre', 'br', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: ['href', 'rel', 'target'],
  });
}
