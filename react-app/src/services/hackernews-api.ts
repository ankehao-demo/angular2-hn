import { Story } from '../models/story';
import { UserProfile } from '../models/user-profile';

const API_BASE = 'https://node-hnapi.herokuapp.com';

export type FeedType = 'news' | 'newest' | 'show' | 'ask' | 'jobs';

export async function fetchFeed(feedType: FeedType, page: number = 1): Promise<Story[]> {
  const response = await fetch(`${API_BASE}/${feedType}?page=${page}`);
  if (!response.ok) throw new Error(`Failed to fetch ${feedType}`);
  return response.json();
}

interface CommentData {
  id: number;
  user: string;
  time_ago: string;
  content: string;
  comments: CommentData[];
  level: number;
}

export async function fetchItemContent(id: number): Promise<Story & { comments: CommentData[] }> {
  const response = await fetch(`${API_BASE}/item/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch item ${id}`);
  return response.json();
}

export async function fetchUser(id: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE}/user/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch user ${id}`);
  return response.json();
}
