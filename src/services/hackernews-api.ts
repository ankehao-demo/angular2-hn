import type { Story } from '../types/story';
import type { User } from '../types/user';
import type { FeedType } from '../types/feed-type';
import type { PollResult } from '../types/poll-result';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchFeed(
  feedType: FeedType,
  page: number,
  signal?: AbortSignal
): Promise<Story[]> {
  return fetchJson<Story[]>(`${BASE_URL}/${feedType}?page=${page}`, signal);
}

export function fetchItemContent(
  id: number,
  signal?: AbortSignal
): Promise<Story> {
  return fetchJson<Story>(`${BASE_URL}/item/${id}`, signal);
}

export async function fetchPollContent(
  id: number,
  count: number,
  signal?: AbortSignal
): Promise<PollResult[]> {
  const requests: Promise<PollResult>[] = [];
  for (let i = 1; i <= count; i++) {
    requests.push(fetchJson<PollResult>(`${BASE_URL}/item/${id + i}`, signal));
  }
  return Promise.all(requests);
}

export function fetchUser(
  id: string,
  signal?: AbortSignal
): Promise<User> {
  return fetchJson<User>(`${BASE_URL}/user/${id}`, signal);
}
