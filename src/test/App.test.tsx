import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import { SettingsProvider } from '../context/SettingsContext';

vi.stubGlobal('ga', vi.fn());

function renderWithProviders(initialRoute = '/news/1') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </MemoryRouter>
  );
}

describe('App', () => {
  it('renders the header with navigation links', () => {
    renderWithProviders();
    expect(screen.getByText('React HN')).toBeInTheDocument();
    expect(screen.getByText('top')).toBeInTheDocument();
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText('show')).toBeInTheDocument();
    expect(screen.getByText('ask')).toBeInTheDocument();
    expect(screen.getByText('jobs')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    renderWithProviders();
    expect(screen.getByText(/Built with/)).toBeInTheDocument();
  });

  it('renders loading state for feed', () => {
    renderWithProviders('/news/1');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
