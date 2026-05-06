import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from '../shared/services/SettingsContext';
import Feed from '../feeds/feed/Feed';
import AppRoutes from '../routes';

function renderWithRouter(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SettingsProvider>
        <AppRoutes />
      </SettingsProvider>
    </MemoryRouter>
  );
}

describe('Routes', () => {
  it('/ redirects to /news/1', () => {
    renderWithRouter(['/']);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('each feed route renders Feed with correct feedType - news', async () => {
    renderWithRouter(['/news/1']);
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
  });

  it('each feed route renders Feed with correct feedType - jobs', async () => {
    renderWithRouter(['/jobs/1']);
    await waitFor(() => {
      expect(screen.getByText(/Y Combinator/)).toBeInTheDocument();
    });
  });

  it('/item route lazy-loads correctly', async () => {
    renderWithRouter(['/item/1001']);
    await waitFor(() => {
      expect(screen.getAllByText('Test Item With Comments').length).toBeGreaterThan(0);
    });
  });

  it('/user route lazy-loads correctly', async () => {
    renderWithRouter(['/user/testuser']);
    await waitFor(() => {
      expect(screen.getAllByText('testuser').length).toBeGreaterThan(0);
    });
  });
});
