import { Story } from '../models/story';
import { User } from '../models/user';
import { PollResult } from '../models/poll-result';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

export async function fetchFeed(feedType: string, page: number): Promise<Story[]> {
    const res = await fetch(`${BASE_URL}/${feedType}?page=${page}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${feedType} feed (status ${res.status})`);
    }
    return res.json();
}

export async function fetchItemContent(id: number): Promise<Story> {
    const res = await fetch(`${BASE_URL}/item/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch item ${id} (status ${res.status})`);
    }
    const story: Story = await res.json();
    if (story.type === 'poll' && story.poll && story.poll.length > 0) {
        const pollPromises = story.poll.map((_, i) => fetchPollContent(story.id + i + 1));
        story.poll = await Promise.all(pollPromises);
        story.poll_votes_count = story.poll.reduce((sum, p) => sum + p.points, 0);
    }
    return story;
}

export async function fetchPollContent(id: number): Promise<PollResult> {
    const res = await fetch(`${BASE_URL}/item/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch poll content ${id} (status ${res.status})`);
    }
    return res.json();
}

export async function fetchUser(id: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/user/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch user ${id} (status ${res.status})`);
    }
    return res.json();
}
