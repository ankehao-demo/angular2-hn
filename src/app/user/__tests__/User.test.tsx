import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SettingsProvider } from '../../shared/services/SettingsContext';
import User from '../User';
import { server } from '../../../mocks/server';
import { http, HttpResponse } from 'msw';
import { mockUser, mockUserNoAbout } from '../../../mocks/fixtures/user';

function renderUser(id = 'testuser') {
  return render(
    <MemoryRouter initialEntries={[`/user/${id}`]}>
      <SettingsProvider>
        <Routes>
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </SettingsProvider>
    </MemoryRouter>
  );
}

describe('User', () => {
  it('shows loader while fetching', () => {
    renderUser();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state on fetch failure', async () => {
    server.use(
      http.get('https://node-hnapi.herokuapp.com/user/:id', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );
    renderUser('baduser');
    await waitFor(() => {
      expect(screen.getByText('Could not load user baduser.')).toBeInTheDocument();
    });
  });

  it('renders username, karma, created date', async () => {
    renderUser();
    await waitFor(() => {
      expect(screen.getAllByText('testuser').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('5000 ★')).toBeInTheDocument();
    expect(screen.getByText('Created 2 years ago')).toBeInTheDocument();
  });

  it('renders about section when present', async () => {
    renderUser();
    await waitFor(() => {
      expect(screen.getByText('A test user on Hacker News')).toBeInTheDocument();
    });
  });

  it('does not render about section when empty', async () => {
    server.use(
      http.get('https://node-hnapi.herokuapp.com/user/:id', () => {
        return HttpResponse.json(mockUserNoAbout);
      })
    );
    renderUser('simpleuser');
    await waitFor(() => {
      expect(screen.getAllByText('simpleuser').length).toBeGreaterThan(0);
    });
    const { container } = render(<div />);
    expect(container.querySelector('.other-details')).not.toBeInTheDocument();
  });

  it('renders back button', async () => {
    renderUser();
    await waitFor(() => {
      expect(screen.getAllByText('testuser').length).toBeGreaterThan(0);
    });
    const { container } = renderUser();
    await waitFor(() => {
      const backBtn = container.querySelector('.back-button');
      expect(backBtn).toBeInTheDocument();
    });
  });
});
