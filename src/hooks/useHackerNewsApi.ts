import { useState, useEffect, useCallback } from 'react';
import { Story } from '../models/story';
import { User } from '../models/user';
import { PollResult } from '../models/pollResult';

const apiBaseUrl = 'https://node-hnapi.herokuapp.com';

async function lazyFetch<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchFeed(feedType: string, page: number): Promise<Story[]> {
  return lazyFetch<Story[]>(`${apiBaseUrl}/${feedType}?page=${page}`);
}

export async function fetchItemContent(id: number): Promise<Story> {
  const story = await lazyFetch<Story>(`${apiBaseUrl}/item/${id}`);
  if (story.type === 'poll' && story.poll && story.poll.length > 0) {
    const numberOfPollOptions = story.poll.length;
    story.poll_votes_count = 0;
    const pollPromises = [];
    for (let i = 1; i <= numberOfPollOptions; i++) {
      pollPromises.push(fetchPollContent(story.id + i));
    }
    const pollResults = await Promise.all(pollPromises);
    for (let i = 0; i < pollResults.length; i++) {
      story.poll[i] = pollResults[i];
      story.poll_votes_count += pollResults[i].points || 0;
    }
  }
  return story;
}

export async function fetchPollContent(id: number): Promise<PollResult> {
  return lazyFetch<PollResult>(`${apiBaseUrl}/item/${id}`);
}

export async function fetchUser(id: string): Promise<User> {
  return lazyFetch<User>(`${apiBaseUrl}/user/${id}`);
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiFetch<T>(fetchFn: () => Promise<T>, deps: unknown[]): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const memoizedFetchFn = useCallback(fetchFn, deps);

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    memoizedFetchFn()
      .then((data) => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [memoizedFetchFn]);

  return state;
}
