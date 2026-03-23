import { useState, useEffect } from 'react';
import type { Story } from '../types/Story';
import type { User } from '../types/User';
import type { PollResult } from '../types/PollResult';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

export function useFeed(feedType: string, page: number) {
    const [items, setItems] = useState<Story[] | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setItems(null);
        setError('');
        const controller = new AbortController();

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
        setItem(null);
        setError('');
        const controller = new AbortController();

        fetch(`${BASE_URL}/item/${id}`, { signal: controller.signal })
            .then((res) => res.json())
            .then((story: Story) => {
                if (story.type === 'poll' && story.poll) {
                    const numberOfPollOptions = story.poll.length;
                    story.poll_votes_count = 0;

                    const pollPromises = Array.from({ length: numberOfPollOptions }, (_, i) =>
                        fetch(`${BASE_URL}/item/${story.id + i + 1}`, { signal: controller.signal }).then((res) =>
                            res.json()
                        )
                    );

                    Promise.all(pollPromises)
                        .then((pollResults: PollResult[]) => {
                            let totalVotes = 0;
                            pollResults.forEach((result, i) => {
                                story.poll[i] = result;
                                totalVotes += result.points;
                            });
                            story.poll_votes_count = totalVotes;
                            setItem({ ...story });
                        })
                        .catch((err) => {
                            if (err.name !== 'AbortError') {
                                setItem(story);
                            }
                        });
                } else {
                    setItem(story);
                }
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
        setUser(null);
        setError('');
        const controller = new AbortController();

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
