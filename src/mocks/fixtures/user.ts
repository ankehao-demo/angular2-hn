import { User } from '../../app/shared/models/user';

export const mockUser: User = {
  id: 'testuser',
  crated_time: 1609459200,
  created: '2 years ago',
  karma: 5000,
  avg: 10,
  about: '<p>A test user on Hacker News</p>',
};

export const mockUserNoAbout: User = {
  ...mockUser,
  id: 'simpleuser',
  about: '',
};
