import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchFeed, fetchUser, fetchPollContent } from '../services/hackerNewsApi';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('hackerNewsApi', () => {
  describe('fetchFeed', () => {
    it('fetches feed data from the correct URL', async () => {
      const mockStories = [{ id: 1, title: 'Test Story' }];
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockStories),
      });

      const result = await fetchFeed('news', 1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://node-hnapi.herokuapp.com/news?page=1',
        { signal: undefined }
      );
      expect(result).toEqual(mockStories);
    });

    it('passes abort signal to fetch', async () => {
      const controller = new AbortController();
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve([]),
      });

      await fetchFeed('show', 2, controller.signal);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://node-hnapi.herokuapp.com/show?page=2',
        { signal: controller.signal }
      );
    });
  });

  describe('fetchUser', () => {
    it('fetches user data from the correct URL', async () => {
      const mockUser = { id: 'testuser', karma: 100 };
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockUser),
      });

      const result = await fetchUser('testuser');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://node-hnapi.herokuapp.com/user/testuser',
        { signal: undefined }
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('fetchPollContent', () => {
    it('fetches poll content from the correct URL', async () => {
      const mockPoll = { points: 10, content: 'Option A' };
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockPoll),
      });

      const result = await fetchPollContent(123);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://node-hnapi.herokuapp.com/item/123',
        { signal: undefined }
      );
      expect(result).toEqual(mockPoll);
    });
  });
});
