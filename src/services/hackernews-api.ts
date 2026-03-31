import { Story, User } from '../types';

const BASE_URL = 'https://node-hnapi.herokuapp.com';
const HNPWA_URL = 'https://api.hnpwa.com/v0';

export async function fetchFeed(feedType: string, page: number): Promise<Story[]> {
  const res = await fetch(`${BASE_URL}/${feedType}?page=${page}`);
  if (!res.ok) throw new Error(`Failed to fetch feed: ${res.status}`);
  return res.json();
}

export async function fetchItemContent(id: number): Promise<Story> {
  const res = await fetch(`${BASE_URL}/item/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch item: ${res.status}`);
  return res.json();
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${HNPWA_URL}/user/${id}.json`);
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
  return res.json();
}
