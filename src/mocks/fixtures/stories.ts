import { Story } from '../../app/shared/models/story';

export function createMockStory(overrides: Partial<Story> = {}, index = 0): Story {
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
    ...overrides,
  };
}

export function createMockStories(count = 30): Story[] {
  return Array.from({ length: count }, (_, i) => createMockStory({}, i));
}

export const mockStories = createMockStories(30);

export const mockJobStory: Story = createMockStory({
  type: 'job',
  url: 'https://example.com/job',
  domain: 'example.com',
  comments_count: 0,
  points: 0,
  user: '',
  title: 'Test Job at YC Startup',
}, 100);

export const mockJobStories: Story[] = Array.from({ length: 5 }, (_, i) =>
  createMockStory({
    type: 'job',
    url: `https://example.com/job-${i}`,
    domain: 'example.com',
    comments_count: 0,
    points: 0,
    user: '',
    title: `Job ${i + 1} at YC Startup`,
  }, 200 + i)
);
