import { useCallback } from 'react';
import { Story } from '../models/story';
import { User } from '../models/user';
import { PollResult } from '../models/poll-result';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function fetchPollContent(id: number, signal?: AbortSignal): Promise<PollResult> {
  return fetchJson<PollResult>(`${BASE_URL}/item/${id}`, signal);
}

/**
 * React hook that provides methods to fetch data from the Hacker News API.
 *
 * Replaces Angular's HackerNewsAPIService.
 * All methods return Promises instead of Observables.
 * Pass an AbortSignal for cancellation support (replaces Observable unsubscribe).
 */
export function useHackerNewsApi() {
  const fetchFeed = useCallback(
    async (feedType: string, page: number, signal?: AbortSignal): Promise<Story[]> => {
      return fetchJson<Story[]>(`${BASE_URL}/${feedType}?page=${page}`, signal);
    },
    []
  );

  const fetchItemContent = useCallback(
    async (id: number, signal?: AbortSignal): Promise<Story> => {
      const story = await fetchJson<Story>(`${BASE_URL}/item/${id}`, signal);

      if (story.type === 'poll' && story.poll) {
        const numberOfPollOptions = story.poll.length;
        story.poll_votes_count = 0;

        const pollPromises = Array.from({ length: numberOfPollOptions }, (_, i) =>
          fetchPollContent(story.id + i + 1, signal)
        );

        const pollResults = await Promise.all(pollPromises);
        pollResults.forEach((pollResult, i) => {
          story.poll[i] = pollResult;
          story.poll_votes_count += pollResult.points;
        });
      }

      return story;
    },
    []
  );

  const fetchUser = useCallback(
    async (id: string, signal?: AbortSignal): Promise<User> => {
      return fetchJson<User>(`${BASE_URL}/user/${id}`, signal);
    },
    []
  );

  return { fetchFeed, fetchItemContent, fetchUser };
}
