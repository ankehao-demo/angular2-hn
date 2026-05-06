import { fetchFeed, fetchItemContent, fetchUser, fetchPollContent } from '../hackernews-api';
import { server } from '../../../../mocks/server';
import { http, HttpResponse } from 'msw';
import { mockStories } from '../../../../mocks/fixtures/stories';
import { mockItem, mockPollItem } from '../../../../mocks/fixtures/item';
import { mockUser } from '../../../../mocks/fixtures/user';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

describe('hackernews-api', () => {
  describe('fetchFeed', () => {
    it('returns stories for news feed', async () => {
      const result = await fetchFeed('news', 1);
      expect(result).toEqual(mockStories);
    });

    it('returns stories for newest feed', async () => {
      const result = await fetchFeed('newest', 1);
      expect(result).toEqual(mockStories);
    });

    it('returns stories for show feed', async () => {
      const result = await fetchFeed('show', 1);
      expect(result).toEqual(mockStories);
    });

    it('returns stories for ask feed', async () => {
      const result = await fetchFeed('ask', 1);
      expect(result).toEqual(mockStories);
    });

    it('returns stories for jobs feed', async () => {
      const result = await fetchFeed('jobs', 1);
      expect(result).toEqual(mockStories);
    });

    it('throws error on network failure', async () => {
      server.use(
        http.get(`${BASE_URL}/news`, () => {
          return HttpResponse.error();
        })
      );
      await expect(fetchFeed('news', 1)).rejects.toThrow();
    });

    it('throws error on non-200 response', async () => {
      server.use(
        http.get(`${BASE_URL}/news`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      await expect(fetchFeed('news', 1)).rejects.toThrow('Failed to fetch news feed');
    });
  });

  describe('fetchItemContent', () => {
    it('returns story with comments', async () => {
      const result = await fetchItemContent(1001);
      expect(result).toEqual(mockItem);
      expect(result.comments).toHaveLength(2);
    });

    it('handles poll type with aggregated poll_votes_count', async () => {
      server.use(
        http.get(`${BASE_URL}/item/:id`, ({ params }) => {
          const id = Number(params.id);
          if (id === 1003) {
            return HttpResponse.json(mockPollItem);
          }
          return HttpResponse.json({ points: 75, content: '<p>Poll Option</p>' });
        })
      );
      const result = await fetchItemContent(1003);
      expect(result.type).toBe('poll');
      expect(result.poll_votes_count).toBe(150);
    });

    it('throws error on failure', async () => {
      server.use(
        http.get(`${BASE_URL}/item/:id`, () => {
          return new HttpResponse(null, { status: 404 });
        })
      );
      await expect(fetchItemContent(9999)).rejects.toThrow('Failed to fetch item 9999');
    });
  });

  describe('fetchPollContent', () => {
    it('returns poll result', async () => {
      const result = await fetchPollContent(1001);
      expect(result).toBeDefined();
    });

    it('throws on non-200', async () => {
      server.use(
        http.get(`${BASE_URL}/item/:id`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      await expect(fetchPollContent(9999)).rejects.toThrow();
    });
  });

  describe('fetchUser', () => {
    it('returns user data', async () => {
      const result = await fetchUser('testuser');
      expect(result).toEqual(mockUser);
    });

    it('throws error on failure', async () => {
      server.use(
        http.get(`${BASE_URL}/user/:id`, () => {
          return new HttpResponse(null, { status: 404 });
        })
      );
      await expect(fetchUser('nonexistent')).rejects.toThrow('Failed to fetch user nonexistent');
    });

    it('throws error on network failure', async () => {
      server.use(
        http.get(`${BASE_URL}/user/:id`, () => {
          return HttpResponse.error();
        })
      );
      await expect(fetchUser('testuser')).rejects.toThrow();
    });
  });
});
