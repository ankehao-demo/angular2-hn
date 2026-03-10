/**
 * Equivalent of Angular's CommentPipe (shared/pipes/comment.pipe.ts).
 * Transforms a comment count into a display string.
 */
export function formatCommentCount(count: number): string {
    if (count > 0) {
        const label = count === 1 ? 'comment' : 'comments';
        return `${count} ${label}`;
    }
    return 'discuss';
}
