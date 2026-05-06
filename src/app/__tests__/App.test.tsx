import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders header and footer', async () => {
    render(<App />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/GitHub/)).toBeInTheDocument();
    });
  });

  it('applies theme class from settings context', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.default')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText('show')).toBeInTheDocument();
    expect(screen.getByText('ask')).toBeInTheDocument();
    expect(screen.getByText('jobs')).toBeInTheDocument();
  });
});
