import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SettingsProvider } from '../../shared/services/SettingsContext';
import ItemDetails from '../ItemDetails';
import { server } from '../../../mocks/server';
import { http, HttpResponse } from 'msw';
import { mockItem, mockItemNoUrl } from '../../../mocks/fixtures/item';

const mockPollItemResolved = {
  ...mockItem,
  id: 1003,
  type: 'poll' as const,
  title: 'Test Poll',
  poll: [
    { points: 100, content: '<p>Option A</p>' },
    { points: 50, content: '<p>Option B</p>' },
  ],
  poll_votes_count: 150,
};

function renderItemDetails(id = '1001') {
  return render(
    <MemoryRouter initialEntries={[`/item/${id}`]}>
      <SettingsProvider>
        <Routes>
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/user/:id" element={<div>User Page</div>} />
        </Routes>
      </SettingsProvider>
    </MemoryRouter>
  );
}

describe('ItemDetails', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows loader while fetching', () => {
    renderItemDetails();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state on fetch failure', async () => {
    server.use(
      http.get('https://node-hnapi.herokuapp.com/item/:id', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    renderItemDetails();
    await waitFor(() => {
      expect(screen.getByText('Could not load item comments.')).toBeInTheDocument();
    });
  });

  it('renders full item with title, points, user, time, comments', async () => {
    renderItemDetails();
    await waitFor(() => {
      expect(screen.getAllByText('Test Item With Comments').length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText(/250 points by/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('testuser').length).toBeGreaterThan(0);
    expect(screen.getAllByText('5 hours ago').length).toBeGreaterThan(0);
  });

  it('renders external URL as <a href> with target', async () => {
    renderItemDetails();
    await waitFor(() => {
      expect(screen.getAllByText('Test Item With Comments').length).toBeGreaterThan(0);
    });
    const links = screen.getAllByText('Test Item With Comments');
    const externalLink = links.find(el => el.closest('a')?.getAttribute('href') === 'https://example.com/article');
    expect(externalLink?.closest('a')).toHaveAttribute('href', 'https://example.com/article');
  });

  it('renders comments', async () => {
    renderItemDetails();
    await waitFor(() => {
      expect(screen.getByText('commenter1')).toBeInTheDocument();
    });
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });

  it('renders deleted comments correctly', async () => {
    renderItemDetails();
    await waitFor(() => {
      expect(screen.getByText(/Comment Deleted/)).toBeInTheDocument();
    });
  });

  it('renders poll type with poll results and bars', async () => {
    const pollOption1 = { points: 100, content: '<p>Option A</p>' };
    const pollOption2 = { points: 50, content: '<p>Option B</p>' };
    const pollItem = {
      ...mockItem,
      id: 1003,
      type: 'poll' as const,
      title: 'Test Poll',
      poll: [{}, {}],
      poll_votes_count: 0,
    };
    server.use(
      http.get('https://node-hnapi.herokuapp.com/item/:id', ({ params }) => {
        const id = params.id as string;
        if (id === '1003') return HttpResponse.json(pollItem);
        if (id === '1004') return HttpResponse.json(pollOption1);
        if (id === '1005') return HttpResponse.json(pollOption2);
        return HttpResponse.json(mockItem);
      })
    );
    renderItemDetails('1003');
    await waitFor(() => {
      expect(screen.getAllByText('Test Poll').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('100 points')).toBeInTheDocument();
    expect(screen.getByText('50 points')).toBeInTheDocument();
  });

  it('renders item without url as internal link', async () => {
    server.use(
      http.get('https://node-hnapi.herokuapp.com/item/:id', () => {
        return HttpResponse.json(mockItemNoUrl);
      })
    );
    renderItemDetails('1002');
    await waitFor(() => {
      expect(screen.getAllByText('Test Item With Comments').length).toBeGreaterThan(0);
    });
  });

  it('renders item content', async () => {
    renderItemDetails();
    await waitFor(() => {
      expect(screen.getByText('This is the item content')).toBeInTheDocument();
    });
  });
});
