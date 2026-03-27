export function formatComment(commentCount: number): string {
  if (commentCount > 0) {
    const st = commentCount === 1 ? 'comment' : 'comments';
    return `${commentCount} ${st}`;
  }
  return 'discuss';
}
