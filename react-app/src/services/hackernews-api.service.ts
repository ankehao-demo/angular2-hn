import type { Story } from '../models/story';
import type { User } from '../models/user';
import type { PollResult } from '../models/poll-result';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

const VALID_FEED_TYPES = new Set(['news', 'newest', 'show', 'ask', 'jobs', 'new']);

function buildApiUrl(path: string): string {
  const url = new URL(path, BASE_URL);
  if (url.origin !== BASE_URL) {
    throw new Error('Invalid API URL');
  }
  return url.toString();
}

export async function fetchFeed(feedType: string, page: number): Promise<Story[]> {
  if (!VALID_FEED_TYPES.has(feedType)) {
    throw new Error(`Invalid feed type: ${feedType}`);
  }
  const safePageNum = Math.max(1, Math.floor(page));
  const res = await fetch(buildApiUrl(`/${feedType}?page=${safePageNum}`));
  if (!res.ok) throw new Error(`Failed to fetch ${feedType}`);
  return res.json();
}

export async function fetchItemContent(id: number): Promise<Story> {
  const safeId = Math.floor(Math.abs(id));
  const res = await fetch(buildApiUrl(`/item/${safeId}`));
  if (!res.ok) throw new Error(`Failed to fetch item ${safeId}`);
  const story: Story = await res.json();

  if (story.type === 'poll' && story.poll) {
    const numberOfPollOptions = story.poll.length;
    story.poll_votes_count = 0;
    const pollPromises = [];
    for (let i = 1; i <= numberOfPollOptions; i++) {
      pollPromises.push(fetchPollContent(safeId + i));
    }
    const pollResults = await Promise.all(pollPromises);
    pollResults.forEach((result, index) => {
      story.poll[index] = result;
      story.poll_votes_count += result.points;
    });
  }

  return story;
}

export async function fetchPollContent(id: number): Promise<PollResult> {
  const safeId = Math.floor(Math.abs(id));
  const res = await fetch(buildApiUrl(`/item/${safeId}`));
  if (!res.ok) throw new Error(`Failed to fetch poll ${safeId}`);
  return res.json();
}

export async function fetchUser(id: string): Promise<User> {
  const safeId = encodeURIComponent(id);
  const res = await fetch(buildApiUrl(`/user/${safeId}`));
  if (!res.ok) throw new Error(`Failed to fetch user ${safeId}`);
  return res.json();
}
