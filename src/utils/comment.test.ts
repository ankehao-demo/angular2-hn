import { describe, expect, it } from 'vitest';
import { commentCountLabel } from './comment';

describe('commentCountLabel', () => {
  it('returns "discuss" when count is 0', () => {
    expect(commentCountLabel(0)).toBe('discuss');
  });

  it('returns singular form for a single comment', () => {
    expect(commentCountLabel(1)).toBe('1 comment');
  });

  it('returns plural form for multiple comments', () => {
    expect(commentCountLabel(5)).toBe('5 comments');
  });
});
