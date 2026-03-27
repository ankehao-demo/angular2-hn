import { Story } from '../types/Story';
import { User } from '../types/User';
import { PollResult } from '../types/PollResult';

const baseUrl = 'https://node-hnapi.herokuapp.com';

export function fetchFeed(
  feedType: string,
  page: number,
  signal?: AbortSignal
): Promise<Story[]> {
  return fetch(`${baseUrl}/${feedType}?page=${page}`, { signal }).then((res) =>
    res.json()
  );
}

export async function fetchItemContent(
  id: number,
  signal?: AbortSignal
): Promise<Story> {
  const story: Story = await fetch(`${baseUrl}/item/${id}`, { signal }).then(
    (res) => res.json()
  );

  if (story.type === 'poll' && story.poll && story.poll.length > 0) {
    const numberOfPollOptions = story.poll.length;
    story.poll_votes_count = 0;

    const pollPromises: Promise<PollResult>[] = [];
    for (let i = 1; i <= numberOfPollOptions; i++) {
      pollPromises.push(fetchPollContent(story.id + i, signal));
    }

    const pollResults = await Promise.all(pollPromises);
    pollResults.forEach((pollResult, index) => {
      story.poll[index] = pollResult;
      story.poll_votes_count += pollResult.points;
    });
  }

  return story;
}

export function fetchPollContent(
  id: number,
  signal?: AbortSignal
): Promise<PollResult> {
  return fetch(`${baseUrl}/item/${id}`, { signal }).then((res) => res.json());
}

export function fetchUser(
  id: string,
  signal?: AbortSignal
): Promise<User> {
  return fetch(`${baseUrl}/user/${id}`, { signal }).then((res) => res.json());
}
