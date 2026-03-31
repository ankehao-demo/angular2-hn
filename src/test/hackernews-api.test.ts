import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchFeed, fetchItemContent, fetchUser } from '../services/hackernews-api';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
    mockFetch.mockClear();
});

describe('fetchFeed', () => {
    it('fetches feed data for given type and page', async () => {
        const mockStories = [{ id: 1, title: 'Test Story' }];
        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockStories),
        });

        const result = await fetchFeed('news', 1);

        expect(mockFetch).toHaveBeenCalledWith('https://node-hnapi.herokuapp.com/news?page=1');
        expect(result).toEqual(mockStories);
    });
});

describe('fetchItemContent', () => {
    it('fetches item content by id', async () => {
        const mockStory = { id: 123, title: 'Test', type: 'story', comments: [] };
        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockStory),
        });

        const result = await fetchItemContent(123);

        expect(mockFetch).toHaveBeenCalledWith('https://node-hnapi.herokuapp.com/item/123');
        expect(result).toEqual(mockStory);
    });

    it('fetches poll options in parallel for poll type', async () => {
        const mockPoll = {
            id: 200,
            title: 'Poll',
            type: 'poll',
            poll: [{}, {}],
            comments: [],
        };
        const pollOption1 = { points: 10, content: 'Option 1' };
        const pollOption2 = { points: 20, content: 'Option 2' };

        mockFetch
            .mockResolvedValueOnce({ json: () => Promise.resolve(mockPoll) })
            .mockResolvedValueOnce({ json: () => Promise.resolve(pollOption1) })
            .mockResolvedValueOnce({ json: () => Promise.resolve(pollOption2) });

        const result = await fetchItemContent(200);

        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(result.poll).toEqual([pollOption1, pollOption2]);
        expect(result.poll_votes_count).toBe(30);
    });
});

describe('fetchUser', () => {
    it('fetches user data by id', async () => {
        const mockUser = { id: 'testuser', karma: 100 };
        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockUser),
        });

        const result = await fetchUser('testuser');

        expect(mockFetch).toHaveBeenCalledWith('https://node-hnapi.herokuapp.com/user/testuser');
        expect(result).toEqual(mockUser);
    });
});
