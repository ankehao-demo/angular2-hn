import { Story, User } from '../types';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

export async function fetchFeed(feedType: string, page: number): Promise<Story[]> {
  const res = await fetch(`${BASE_URL}/${feedType}?page=${page}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${feedType} feed`);
  }
  return res.json();
}

export async function fetchItemContent(id: number): Promise<Story> {
  const res = await fetch(`${BASE_URL}/item/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch item ${id}`);
  }
  return res.json();
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/user/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch user ${id}`);
  }
  return res.json();
}
