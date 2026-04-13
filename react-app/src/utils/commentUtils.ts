import { Comment } from '../models/comment';

/**
 * Flatten nested comments into a single array with level information preserved.
 */
export function flattenComments(comments: Comment[]): Comment[] {
  const result: Comment[] = [];

  function traverse(commentList: Comment[]) {
    for (const comment of commentList) {
      result.push(comment);
      if (comment.comments && comment.comments.length > 0) {
        traverse(comment.comments);
      }
    }
  }

  traverse(comments);
  return result;
}

/**
 * Count the total number of comments including nested replies.
 */
export function countComments(comments: Comment[]): number {
  let count = 0;
  for (const comment of comments) {
    count += 1;
    if (comment.comments && comment.comments.length > 0) {
      count += countComments(comment.comments);
    }
  }
  return count;
}
