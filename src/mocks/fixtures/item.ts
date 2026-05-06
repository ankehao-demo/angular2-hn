import { Story } from '../../app/shared/models/story';
import { Comment } from '../../app/shared/models/comment';

export const mockComment: Comment = {
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
};

export const mockDeletedComment: Comment = {
  id: 2003,
  level: 0,
  user: '',
  time: 1609470000,
  time_ago: '3 hours ago',
  content: '',
  deleted: true,
  comments: [],
};

export const mockItem: Story = {
  id: 1001,
  title: 'Test Item With Comments',
  points: 250,
  user: 'testuser',
  time: 1609459200,
  time_ago: '5 hours ago',
  type: 'story',
  url: 'https://example.com/article',
  domain: 'example.com',
  comments: [mockComment, mockDeletedComment],
  comments_count: 3,
  content: '<p>This is the item content</p>',
  poll: [],
  poll_votes_count: 0,
  deleted: false,
  dead: false,
};

export const mockItemNoUrl: Story = {
  ...mockItem,
  id: 1002,
  url: '',
  domain: '',
};

export const mockPollItem: Story = {
  ...mockItem,
  id: 1003,
  type: 'poll',
  title: 'Test Poll',
  poll: [
    { points: 100, content: '<p>Option A</p>' },
    { points: 50, content: '<p>Option B</p>' },
  ],
  poll_votes_count: 150,
};
