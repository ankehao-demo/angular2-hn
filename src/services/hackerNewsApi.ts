import { Story } from '../models/Story';
import { User } from '../models/User';
import { PollResult } from '../models/PollResult';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

export async function fetchFeed(feedType: string, page: number, signal?: AbortSignal): Promise<Story[]> {
    const res = await fetch(`${BASE_URL}/${feedType}?page=${page}`, { signal });
    if (!res.ok) throw new Error(`Failed to fetch ${feedType} feed`);
    return res.json();
}

export async function fetchItemContent(id: number, signal?: AbortSignal): Promise<Story> {
    const res = await fetch(`${BASE_URL}/item/${id}`, { signal });
    if (!res.ok) throw new Error('Failed to fetch item');
    const story: Story = await res.json();

    if (story.type === 'poll' && story.poll) {
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

export async function fetchPollContent(id: number, signal?: AbortSignal): Promise<PollResult> {
    const res = await fetch(`${BASE_URL}/item/${id}`, { signal });
    if (!res.ok) throw new Error('Failed to fetch poll content');
    return res.json();
}

export async function fetchUser(id: string, signal?: AbortSignal): Promise<User> {
    const res = await fetch(`${BASE_URL}/user/${id}`, { signal });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
}
