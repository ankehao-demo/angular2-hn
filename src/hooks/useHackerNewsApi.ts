import { useState, useEffect } from 'react';
import type { Story } from '../types/story';
import type { User } from '../types/user';
import type { PollResult } from '../types/poll-result';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

export function useFeed(feedType: string, page: number) {
  const [items, setItems] = useState<Story[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setItems(null);
    setError('');

    fetch(`${BASE_URL}/${feedType}?page=${page}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: Story[]) => setItems(data))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(`Could not load ${feedType} stories.`);
        }
      });

    return () => controller.abort();
  }, [feedType, page]);

  return { items, error };
}

export function useItemContent(id: number) {
  const [item, setItem] = useState<Story | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setItem(null);
    setError('');

    fetch(`${BASE_URL}/item/${id}`, { signal: controller.signal })
      .then((res) => res.json())
      .then(async (story: Story) => {
        if (story.type === 'poll' && story.poll) {
          const numberOfPollOptions = story.poll.length;
          let pollVotesCount = 0;
          const pollResults: PollResult[] = [];

          for (let i = 1; i <= numberOfPollOptions; i++) {
            try {
              const res = await fetch(`${BASE_URL}/item/${story.id + i}`, {
                signal: controller.signal,
              });
              const pollResult: PollResult = await res.json();
              pollResults.push(pollResult);
              pollVotesCount += pollResult.points;
            } catch {
              // ignore poll fetch errors
            }
          }

          story.poll = pollResults;
          story.poll_votes_count = pollVotesCount;
        }
        setItem(story);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Could not load item comments.');
        }
      });

    return () => controller.abort();
  }, [id]);

  return { item, error };
}

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setUser(null);
    setError('');

    fetch(`${BASE_URL}/user/${id}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: User) => setUser(data))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(`Could not load user ${id}.`);
        }
      });

    return () => controller.abort();
  }, [id]);

  return { user, error };
}
