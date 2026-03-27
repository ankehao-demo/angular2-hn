export type FeedType = 'news' | 'newest' | 'show' | 'ask' | 'jobs';

export interface PollResult {
  item: string;
  points: number;
  content: string;
}

export interface Comment {
  id: number;
  user: string;
  time_ago: string;
  content: string;
  comments: Comment[];
  deleted: boolean;
}

export interface Story {
  id: number;
  title: string;
  points: number;
  user: string;
  time: number;
  time_ago: string;
  type: string;
  url: string;
  domain: string;
  content: string;
  comments: Comment[];
  comments_count: number;
  poll: PollResult[];
  poll_votes_count: number;
  deleted: boolean;
  dead: boolean;
  text?: string;
}

export interface User {
  about: string;
  created: string;
  id: string;
  karma: number;
}

export interface Settings {
  showSettings: boolean;
  openLinkInNewTab: boolean;
  theme: string;
  titleFontSize: string;
  listSpacing: string;
}
