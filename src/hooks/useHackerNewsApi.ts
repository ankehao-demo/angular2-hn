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
  if (story.type === 'poll') {
    const pollResults = await fetchPollContent(id);
    story.poll = pollResults;
  }
  return story;
}

export async function fetchPollContent(id: number): Promise<PollResult[]> {
  return lazyFetch<PollResult[]>(`${apiBaseUrl}/item/${id}/poll`);
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
