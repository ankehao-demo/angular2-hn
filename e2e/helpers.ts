import { Page } from '@playwright/test';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

function createMockStory(index = 0) {
  return {
    id: 1000 + index,
    title: `Test Story ${index + 1}`,
    points: 100 + index,
    user: `user${index}`,
    time: 1609459200 + index * 3600,
    time_ago: `${index + 1} hours ago`,
    type: 'story',
    url: `https://example.com/story-${index}`,
    domain: 'example.com',
    comments: [],
    comments_count: index * 3,
    content: '',
    poll: [],
    poll_votes_count: 0,
    deleted: false,
    dead: false,
  };
}

export const mockStories = Array.from({ length: 30 }, (_, i) => createMockStory(i));

export const mockItem = {
  id: 1001,
  title: 'Test Item With Comments',
  points: 250,
  user: 'testuser',
  time: 1609459200,
  time_ago: '5 hours ago',
  type: 'story',
  url: 'https://example.com/article',
  domain: 'example.com',
  comments: [
    {
      id: 2001,
      level: 0,
      user: 'commenter1',
      time: 1609462800,
      time_ago: '2 hours ago',
      content: '<p>This is a test comment</p>',
      deleted: false,
      comments: [
        {
          id: 2002,
          level: 1,
          user: 'commenter2',
          time: 1609466400,
          time_ago: '1 hour ago',
          content: '<p>This is a nested reply</p>',
          deleted: false,
          comments: [],
        },
      ],
    },
    {
      id: 2003,
      level: 0,
      user: '',
      time: 1609470000,
      time_ago: '3 hours ago',
      content: '',
      deleted: true,
      comments: [],
    },
  ],
  comments_count: 3,
  content: '<p>This is the item content</p>',
  poll: [],
  poll_votes_count: 0,
  deleted: false,
  dead: false,
};

export const mockUser = {
  id: 'testuser',
  crated_time: 1609459200,
  created: '2 years ago',
  karma: 5000,
  avg: 10,
  about: '<p>A test user on Hacker News</p>',
};

export const mockJobStories = Array.from({ length: 5 }, (_, i) => ({
  ...createMockStory(200 + i),
  type: 'job',
  url: `https://example.com/job-${i}`,
  comments_count: 0,
  points: 0,
  user: '',
  title: `Job ${i + 1} at YC Startup`,
}));

export async function setupMockRoutes(page: Page) {
  await page.route(`${BASE_URL}/news**`, route =>
    route.fulfill({ json: mockStories })
  );
  await page.route(`${BASE_URL}/newest**`, route =>
    route.fulfill({ json: mockStories })
  );
  await page.route(`${BASE_URL}/show**`, route =>
    route.fulfill({ json: mockStories })
  );
  await page.route(`${BASE_URL}/ask**`, route =>
    route.fulfill({ json: mockStories })
  );
  await page.route(`${BASE_URL}/jobs**`, route =>
    route.fulfill({ json: mockJobStories })
  );
  await page.route(`${BASE_URL}/item/**`, route =>
    route.fulfill({ json: mockItem })
  );
  await page.route(`${BASE_URL}/user/**`, route =>
    route.fulfill({ json: mockUser })
  );
}
