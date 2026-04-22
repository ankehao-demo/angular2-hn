export function formatCommentCount(count: number): string {
  if (count === 0) {
    return 'discuss';
  }
  return count === 1 ? '1 comment' : `${count} comments`;
}
