import type { Story } from '../types/story';
import type { User } from '../types/user';
import type { PollResult } from '../types/poll-result';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

export async function fetchFeed(feedType: string, page: number): Promise<Story[]> {
  const res = await fetch(`${BASE_URL}/${feedType}?page=${page}`);
  if (!res.ok) throw new Error(`Failed to fetch ${feedType} feed`);
  return res.json();
}

export async function fetchItemContent(id: number): Promise<Story> {
  const res = await fetch(`${BASE_URL}/item/${id}`);
  if (!res.ok) throw new Error('Failed to fetch item');
  const story: Story = await res.json();

  if (story.type === 'poll' && story.poll) {
    const numberOfPollOptions = story.poll.length;
    story.poll_votes_count = 0;

    const pollPromises = [];
    for (let i = 1; i <= numberOfPollOptions; i++) {
      pollPromises.push(fetchPollContent(story.id + i));
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
  const res = await fetch(`${BASE_URL}/item/${id}`);
  if (!res.ok) throw new Error('Failed to fetch poll content');
  return res.json();
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`);
  if (!res.ok) throw new Error('Failed to fetch user');
  const data = await res.json();
  if (!data) throw new Error('User not found');
  return {
    id: data.id,
    crated_time: data.created,
    created: new Date(data.created * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    karma: data.karma,
    avg: 0,
    about: data.about || '',
  };
}
