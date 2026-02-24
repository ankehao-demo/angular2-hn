/**
 * Formats a comment count for display.
 *
 * Replaces Angular's CommentPipe (comment.pipe.ts).
 *
 * @param count - The number of comments
 * @returns A formatted string: "X comment(s)" or "discuss" if count is 0 or less
 */
export function formatComment(count: number): string {
  if (count > 0) {
    const label = count === 1 ? 'comment' : 'comments';
    return `${count} ${label}`;
  }
  return 'discuss';
}
