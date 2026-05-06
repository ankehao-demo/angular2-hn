import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SettingsProvider } from '../../../shared/services/SettingsContext';
import FeedItem from '../FeedItem';
import { createMockStory } from '../../../../mocks/fixtures/stories';

function renderFeedItem(storyOverrides = {}) {
  const item = createMockStory(storyOverrides);
  return render(
    <MemoryRouter>
      <SettingsProvider>
        <FeedItem item={item} />
      </SettingsProvider>
    </MemoryRouter>
  );
}

describe('FeedItem', () => {
  it('renders title', () => {
    renderFeedItem({ title: 'My Great Story' });
    expect(screen.getByText('My Great Story')).toBeInTheDocument();
  });

  it('renders points', () => {
    renderFeedItem({ points: 42 });
    expect(screen.getByText(/42 points by/)).toBeInTheDocument();
  });

  it('renders user', () => {
    renderFeedItem({ user: 'testauthor' });
    expect(screen.getAllByText('testauthor').length).toBeGreaterThan(0);
  });

  it('renders time_ago', () => {
    renderFeedItem({ time_ago: '3 hours ago' });
    expect(screen.getAllByText('3 hours ago').length).toBeGreaterThan(0);
  });

  it('renders domain for url items', () => {
    renderFeedItem({ url: 'https://test.com/article', domain: 'test.com' });
    expect(screen.getAllByText('(test.com)').length).toBeGreaterThan(0);
  });

  it('renders comment count using formatComment', () => {
    renderFeedItem({ comments_count: 5 });
    expect(screen.getAllByText('5 comments').length).toBeGreaterThan(0);
  });

  it('renders "discuss" for 0 comments', () => {
    renderFeedItem({ comments_count: 0 });
    expect(screen.getAllByText('discuss').length).toBeGreaterThan(0);
  });

  it('renders external link for items with http url', () => {
    renderFeedItem({ url: 'https://example.com', title: 'External Story' });
    const link = screen.getAllByText('External Story')[0].closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders internal link for items without http url', () => {
    renderFeedItem({ url: '', id: 555, title: 'Internal Story' });
    const link = screen.getAllByText('Internal Story')[0].closest('a');
    expect(link).toHaveAttribute('href', '/item/555');
  });

  it('respects openLinkInNewTab setting (default false)', () => {
    renderFeedItem({ url: 'https://example.com', title: 'Tab Test' });
    const link = screen.getAllByText('Tab Test')[0].closest('a');
    expect(link).not.toHaveAttribute('target', '_blank');
  });

  it('hides user/points for job type', () => {
    renderFeedItem({ type: 'job', points: 0, user: '' });
    expect(screen.queryByText(/points by/)).not.toBeInTheDocument();
  });
});
