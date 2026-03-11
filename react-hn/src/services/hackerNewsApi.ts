import type { Story } from '../types/story';
import type { PollResult } from '../types/poll-result';
import type { User } from '../types/user';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

export async function fetchFeed(feedType: string, page: number): Promise<Story[]> {
  const res = await fetch(`${BASE_URL}/${feedType}?page=${page}`);
  return res.json();
}

export async function fetchItemContent(id: number): Promise<Story> {
  const story: Story = await fetch(`${BASE_URL}/item/${id}`).then(r => r.json());
  if (story.type === 'poll' && story.poll) {
    const pollPromises = story.poll.map((_, i) =>
      fetchPollContent(story.id + i + 1)
    );
    const pollResults = await Promise.all(pollPromises);
    story.poll = pollResults;
    story.poll_votes_count = pollResults.reduce((sum, p) => sum + p.points, 0);
  }
  return story;
}

export async function fetchPollContent(id: number): Promise<PollResult> {
  const res = await fetch(`${BASE_URL}/item/${id}`);
  return res.json();
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/user/${id}`);
  return res.json();
}
