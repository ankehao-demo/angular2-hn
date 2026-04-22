import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FeedPage from './FeedPage';
import { SettingsProvider } from '../context/SettingsContext';
import type { Story } from '../types/story';

const mockStories: Story[] = [
  {
    id: 1,
    title: 'First story',
    points: 100,
    user: 'alice',
    time: 0,
    time_ago: '1 hour ago',
    type: 'news',
    url: 'https://example.com/first',
    domain: 'example.com',
    comments: [],
    comments_count: 3,
  },
  {
    id: 2,
    title: 'Second story',
    points: 50,
    user: 'bob',
    time: 0,
    time_ago: '2 hours ago',
    type: 'news',
    url: '',
    domain: '',
    comments: [],
    comments_count: 0,
  },
];

function renderFeed(path = '/news/1') {
  return render(
    <SettingsProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/news/:page" element={<FeedPage feedType="news" />} />
        </Routes>
      </MemoryRouter>
    </SettingsProvider>
  );
}

describe('FeedPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockStories,
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders story items fetched from the API', async () => {
    renderFeed();
    await waitFor(() =>
      expect(screen.getByText('First story')).toBeInTheDocument()
    );
    expect(screen.getByText('Second story')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      'https://node-hnapi.herokuapp.com/news?page=1',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('shows an error message when the API request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })
    );
    renderFeed();
    await waitFor(() =>
      expect(
        screen.getByText('Could not load news stories.')
      ).toBeInTheDocument()
    );
  });
});
