import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the GitHub link', () => {
    render(<Footer />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('github.com'));
  });
});
