import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from '../contexts/SettingsContext';
import { Loader } from '../components/shared/Loader';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { Header } from '../components/core/Header';
import { Footer } from '../components/core/Footer';

function withProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <SettingsProvider>{ui}</SettingsProvider>
    </BrowserRouter>
  );
}

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

describe('Loader', () => {
  it('renders loading text', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('ErrorMessage', () => {
  it('renders the error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders the offline notice', () => {
    render(<ErrorMessage message="Error" />);
    expect(
      screen.getByText(/offline viewing/i)
    ).toBeInTheDocument();
  });
});

describe('Header', () => {
  it('renders navigation links', () => {
    withProviders(<Header />);
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText('show')).toBeInTheDocument();
    expect(screen.getByText('ask')).toBeInTheDocument();
    expect(screen.getByText('jobs')).toBeInTheDocument();
  });

  it('renders logo image', () => {
    withProviders(<Header />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('renders settings icon', () => {
    withProviders(<Header />);
    expect(screen.getByAltText('Settings')).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders GitHub link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/hdjirdeh/angular2-hn'
    );
  });
});
