import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchFeed, fetchItemContent, fetchUser, fetchPollContent } from '../useHackerNewsApi';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('fetchFeed', () => {
  it('fetches feed data for a given type and page', async () => {
    const mockStories = [{ id: 1, title: 'Test Story' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStories),
    });

    const result = await fetchFeed('news', 1);
    expect(mockFetch).toHaveBeenCalledWith('https://node-hnapi.herokuapp.com/news?page=1');
    expect(result).toEqual(mockStories);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(fetchFeed('news', 1)).rejects.toThrow('Failed to fetch news feed');
  });
});

describe('fetchItemContent', () => {
  it('fetches item content', async () => {
    const mockStory = { id: 1, title: 'Test', type: 'story', comments: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStory),
    });

    const result = await fetchItemContent(1);
    expect(mockFetch).toHaveBeenCalledWith('https://node-hnapi.herokuapp.com/item/1');
    expect(result).toEqual(mockStory);
  });

  it('fetches poll results for poll type items', async () => {
    const mockPoll = {
      id: 100,
      title: 'Poll',
      type: 'poll',
      poll: [{ points: 10, content: 'Option A' }, { points: 20, content: 'Option B' }],
    };
    const pollResult1 = { points: 10, content: 'Option A' };
    const pollResult2 = { points: 20, content: 'Option B' };

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPoll) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(pollResult1) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(pollResult2) });

    const result = await fetchItemContent(100);
    expect(result.poll).toEqual([pollResult1, pollResult2]);
    expect(result.poll_votes_count).toBe(30);
  });
});

describe('fetchUser', () => {
  it('fetches user data', async () => {
    const mockUser = { id: 'testuser', karma: 100 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    const result = await fetchUser('testuser');
    expect(mockFetch).toHaveBeenCalledWith('https://node-hnapi.herokuapp.com/user/testuser');
    expect(result).toEqual(mockUser);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(fetchUser('unknown')).rejects.toThrow('Failed to fetch user unknown');
  });
});

describe('fetchPollContent', () => {
  it('fetches poll content', async () => {
    const mockPollResult = { points: 42, content: 'Test option' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPollResult),
    });

    const result = await fetchPollContent(101);
    expect(mockFetch).toHaveBeenCalledWith('https://node-hnapi.herokuapp.com/item/101');
    expect(result).toEqual(mockPollResult);
  });
});
