import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SettingsProvider } from '../../../shared/services/SettingsContext';
import Feed from '../Feed';
import { server } from '../../../../mocks/server';
import { http, HttpResponse } from 'msw';

function renderFeed(feedType: string, page = '1') {
  return render(
    <MemoryRouter initialEntries={[`/${feedType}/${page}`]}>
      <SettingsProvider>
        <Routes>
          <Route path="/:feedType/:page" element={<Feed feedType={feedType} />} />
        </Routes>
      </SettingsProvider>
    </MemoryRouter>
  );
}

describe('Feed', () => {
  it('shows Loader while fetching', () => {
    renderFeed('news');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows ErrorMessage on fetch failure', async () => {
    server.use(
      http.get('https://node-hnapi.herokuapp.com/news', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    renderFeed('news');
    await waitFor(() => {
      expect(screen.getByText('Could not load news stories.')).toBeInTheDocument();
    });
  });

  it('renders ordered list with correct start attribute based on page', async () => {
    renderFeed('news', '2');
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
    const ol = screen.getByRole('list');
    expect(ol).toHaveAttribute('start', '31');
  });

  it('renders stories after fetching', async () => {
    renderFeed('news');
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Story 2')).toBeInTheDocument();
  });

  it('pagination - "More" link is visible when 30 items', async () => {
    renderFeed('news');
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
    expect(screen.getByText('More ›')).toBeInTheDocument();
  });

  it('pagination - "Prev" is not visible on page 1', async () => {
    renderFeed('news', '1');
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
    expect(screen.queryByText('‹ Prev')).not.toBeInTheDocument();
  });

  it('pagination - "Prev" is visible on page 2', async () => {
    renderFeed('news', '2');
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
    expect(screen.getByText('‹ Prev')).toBeInTheDocument();
  });

  it('jobs feed shows Y Combinator header text', async () => {
    renderFeed('jobs');
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
    expect(screen.getByText(/Y Combinator/)).toBeInTheDocument();
  });

  it('More link has correct href', async () => {
    renderFeed('news', '1');
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
    expect(screen.getByText('More ›').closest('a')).toHaveAttribute('href', '/news/2');
  });

  it('Prev link has correct href on page 2', async () => {
    renderFeed('news', '2');
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
    expect(screen.getByText('‹ Prev').closest('a')).toHaveAttribute('href', '/news/1');
  });
});
